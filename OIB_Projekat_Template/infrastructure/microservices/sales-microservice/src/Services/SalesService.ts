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




export class SalesService implements ISalesService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly storageClient: StorageClient,
    private readonly analyticsClient: AnalyticsClient,
    private readonly auditingService: IAuditingService
  ) {}

  async getCatalog(query: GetCatalogDTO): Promise<ProductResponse[]> {
    const products = await this.productRepo.getCatalog(query);

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      quantity: p.quantity,
    }));
  }

async buy(userRole: string, request: BuyRequestDTO): Promise<ReceiptResponse> {
  
  const role = (userRole ?? "").trim() || "SELLER";

   await this.auditingService.log(
    AuditLogType.INFO,
    `[SALES] Buy started | role=${role} | items=${request?.items?.length ?? 0}`
  )

  if (!request?.items || request.items.length === 0) {
    throw new Error("Items are required.");
  }
  if (!request.saleType || !request.paymentMethod) {
    throw new Error("saleType and paymentMethod are required.");
  }
  
  // 1) rezerviši / umanji stanje i dobiješ proizvode (sa cenom/nazivom)
  const updatedProducts = await this.productRepo.reserveProducts(request.items);

  // 2) receipt items
  const receiptItems = request.items.map((it) => {
    const p = updatedProducts.find((x) => x.id === it.productId);
    if (!p) throw new Error(`Internal error: missing reserved product id=${it.productId}`);

    const unitPrice = Number(p.price);
    const total = unitPrice * it.quantity;

    return {
      productId: p.id,
      name: p.name,
      quantity: it.quantity,
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
     await this.auditingService.log(
      AuditLogType.INFO,
      `[SALES] Buy success | receipt=${receipt.receiptId} | total=${grandTotal}`
    );
    return receipt;
  } catch (err) {
    console.error("BUY FAILED - STORAGE or ANALYTICS ERROR:", err);
    await this.productRepo.restoreProducts(request.items);
    throw err;
  }
}



}
