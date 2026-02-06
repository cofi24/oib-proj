import { ISalesService } from "../Domain/services/ISalesService";
import { GetCatalogDTO } from "../Domain/DTOs/GetCatalogDTO";
import { ProductResponse } from "../Domain/types/ProductResponse";
import { IProductRepository } from "../Domain/services/IProductRepository";
import { BuyRequestDTO } from "../Domain/DTOs/BuyRequestDTO";
import { ReceiptResponse } from "../Domain/types/ReceiptResponse";
import { StorageClient } from "./clients/StorageClient";
import { AnalyticsClient } from "./clients/AnalyticsClient";
import { AuditingService } from "./AuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { ProcessingClient } from "./clients/ProcessingClient";
import { generateReceiptQr } from "../helper/qrGenerator";



export class SalesService implements ISalesService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly storageClient: StorageClient,
    private readonly analyticsClient: AnalyticsClient,
    private readonly auditingService: IAuditingService,
    private readonly processingClient: ProcessingClient
  ) {}

async getCatalog(query: GetCatalogDTO, headers: Record<string, string>): Promise<ProductResponse[]> {
  try {
    const batches = await this.processingClient.getCatalogg(headers);
    
     
    
    let products = batches
      .filter((batch: any) => {
        // Prikaži samo batche koji imaju dostupne bočice (nisu sve prodate)
        const available = (batch.bottleCount || 0) - (batch.soldCount || 0);
        return available > 0;
      })
      .map((batch: any) => {
        const available = (batch.bottleCount || 0) - (batch.soldCount || 0);
        
        // Cena zavisi od volumena
        let price = 89.99; // Default za 150ml
        if (batch.bottleVolumeMl === 250) {
          price = 139.99;
        }
        
        return {
          id: batch.id,
          name: batch.perfumeType || `Parfem #${batch.id}`,
          brand: "O'Sinjel De Or",
          price: price,
          quantity: available, // Broj dostupnih bočica
          volumeMl: batch.bottleVolumeMl,
          batchInfo: `${available} od ${batch.bottleCount} dostupno`
        };
      });

    // Primeni pretragu
    if (query.search && query.search.trim().length > 0) {
      const searchLower = query.search.toLowerCase();
      products = products.filter((p: any) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
      );
    }

    // Primeni sortiranje
    const sortBy = query.sortBy || "name";
    const sortOrder = query.sortOrder || "asc";
    
    products.sort((a: any, b: any) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === "price") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    
    return products;
    
  } catch (err) {
    console.error("[SalesService] Error fetching catalog:", err);
    throw err;
  }
}
async buy(userRole: string, request: BuyRequestDTO): Promise<ReceiptResponse> {
  const role = (userRole ?? "").trim() || "SELLER";

  await this.auditingService.log(
    AuditLogType.INFO,
    `[SALES] Buy started | role=${role} | items=${request?.items?.length ?? 0}`
  );

  if (!request?.items || request.items.length === 0) {
    throw new Error("Items are required.");
  }
  if (!request.saleType || !request.paymentMethod) {
    throw new Error("saleType and paymentMethod are required.");
  }

  // UMESTO productRepo, dobij podatke iz Processing servisa!
  const batches = await this.processingClient.getCatalogg({
    "x-user-role": role,
  });

  // Mapiraj receipt items iz batches
  const receiptItems = request.items.map((item) => {
    // Pronađi batch po ID-u
    const batch = batches.find((b: any) => b.id === item.productId);
    
    if (!batch) {
      throw new Error(`Batch with id=${item.productId} not found.`);
    }

    const available = (batch.bottleCount || 0) - (batch.soldCount || 0);
    
    if (available < item.quantity) {
      throw new Error(
        `Not enough stock for ${batch.perfumeType}. Available=${available}, requested=${item.quantity}.`
      );
    }

    // Cena na osnovu volumena
    const unitPrice = batch.bottleVolumeMl === 250 ? 139.99 : 89.99;
    const total = unitPrice * item.quantity;

    return {
      productId: batch.id,
      name: batch.perfumeType, // ← OVDE SADA UZIMA IZ BATCH-a!
      quantity: item.quantity,
      unitPrice,
      total,
    };
  });

  const grandTotal = receiptItems.reduce((sum, i) => sum + i.total, 0);
  const packagingAmount = request.items.reduce((sum, i) => sum + i.quantity, 0);

  try {
    await this.storageClient.sendPackaging(role, packagingAmount);

    const receipt = await this.analyticsClient.createReceipt({
      saleType: request.saleType,
      paymentMethod: request.paymentMethod,
      items: receiptItems,
      grandTotal,
    });
    // 🧾 E-FISKALIZACIJA – QR PAYLOAD
    // ===============================
    const qrPayload = {
      receiptId: receipt.receiptId,
      items: receiptItems.map(i => ({
        productCode: i.productId,
        productName: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.total
      })),
      totalAmount: grandTotal,
      createdAt: new Date().toISOString()
    };

    const qrCode = await generateReceiptQr(qrPayload);
    await this.auditingService.log(
      AuditLogType.INFO,
      `[SALES] Buy success | receipt=${receipt.receiptId} | total=${grandTotal}`
    );
    
    return {
  ...receipt,
  qrCode
};
  } catch (err) {
    console.error("BUY FAILED - STORAGE or ANALYTICS ERROR:", err);
    throw err;
  }
}



}
