import {useState,useEffect} from "react";
import type {BuyRequestDTO} from "../models/sales/BuyRequestDTO";
import type {ProductResponse} from "../types/ProductRespones";
import {GetCatalogDTO} from "../models/sales/GetCatalogDTO";
import {Catalog} from "../components/sales/Catalog";
import {PaymentMethod} from "../enums/Payment";
import {SaleType} from "../enums/SaleType";
import {Form} from "../components/sales/Buy";
import { ISalesAPI } from "../api/sales/ISalesAPI";
import { useAuth } from "../hooks/useAuthHook";

type Props = {
  
    salesAPI: ISalesAPI;
};

export function SalesPage({ salesAPI }: Props) {
  
  const { token } = useAuth();

  /* ---------- CATALOG STATE ---------- */
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  /* ---------- BUY STATE ---------- */
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [saleType, setSaleType] = useState(SaleType.RETAIL);

  /* ---------- UI STATE ---------- */
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  /* ---------- LOAD CATALOG ---------- */
  async function loadCatalog() {
    try {
      setLoadingCatalog(true);
      setError(null);

      const query: GetCatalogDTO = {};
      const data = await salesAPI.getCatalog(token!, query);

      setProducts(data);
    } catch (e: any) {
      setError(e.message ?? "Greška pri učitavanju kataloga");
    } finally {
      setLoadingCatalog(false);
    }
  }

  /* ---------- BUY ---------- */
  async function onBuy() {
    try {
      setLoadingBuy(true);
      setError(null);

      const payload: BuyRequestDTO = {
        items: [{ productId, quantity }],
        paymentMethod,
        saleType,
      };

      const receipt = await salesAPI.buy(token!, payload);
      setResult(`Kupovina uspešna! Račun #${receipt.receiptId}`);

      // posle kupovine refresuj katalog
      await loadCatalog();
    } catch (e: any) {
      setError(e.message ?? "Greška pri kupovini");
    } finally {
      setLoadingBuy(false);
    }
  }

  /* ---------- INIT ---------- */
  useEffect(() => {
    loadCatalog();
  }, []);

  return (
    <>
      {/* KATALOG */}
      <Catalog
        products={products}
        loading={loadingCatalog}
        onRefresh={loadCatalog}
      />

      {/* BUY FORM */}
      <Form
        productId={productId}
        setProductId={setProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        saleType={saleType}
        setSaleType={setSaleType}
        error={error}
        disabled={loadingBuy}
        onBuy={onBuy}
      />

      {result && <p style={{ color: "green" }}>{result}</p>}
    </>
  );
}