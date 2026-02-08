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
import { ReceiptResponse } from "../types/ReceiptResponse";
import { useNavigate } from "react-router-dom";

type Props = {
  
    salesAPI: ISalesAPI;
};

export function SalesPage({ salesAPI }: Props) {
  
  const { token } = useAuth();
  const navigate = useNavigate();
  /* ---------- CATALOG STATE ---------- */
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  /* ---------- BUY STATE ---------- */
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [saleType, setSaleType] = useState(SaleType.RETAIL);
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);

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
      setReceipt(receipt);
      setResult(`Kupovina uspešna! Račun #${receipt.receiptId}`);
    setProducts(prev =>
  prev.map(p =>
    p.id === productId
      ? { ...p, quantity: p.quantity - quantity }
      : p
  )
);
           
     
    } catch (e: any) {
  const msg =
    e?.response?.data?.message ||
    e?.response?.data ||
    "Greška pri kupovini";

  setError(msg);
}finally {
      setLoadingBuy(false);
    }
  }

  /* ---------- INIT ---------- */
  useEffect(() => {
    loadCatalog();
  }, []);

  return (
    <>
        <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          padding: "8px 18px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 10px 18px rgba(0,0,0,0.22)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.18)";
        }}
      >
        ← Nazad
      </button>
      <div>
        <br></br>
        <h1 style={{ textAlign: "left", marginBottom: 8,marginLeft: 20 }}>
          Prodaja parfema
        </h1>
        
      
        <br></br>
      </div>
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
      {receipt?.qrCode && (
        <div style={{ marginTop: 20 }}>
          <h3>Fiskalni QR kod</h3>
          <img
            src={receipt.qrCode}
            alt="Fiscal QR Code"
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}
      <div style={{ position: "relative", minHeight: "100vh" }}>
  

  {/* ostatak stranice */}
</div>

    </>
  );
}