import { useState } from "react";
import { Form } from "../components/storage/Form";
import { IStorageAPI } from "../api/storage/IStorageAPI";
import { useAuth } from "../hooks/useAuthHook";
import { SendPackagingDTO } from "../models/storage/SendPackagingDTO";
import { useNavigate } from "react-router-dom";
type Props = {
  storageAPI: IStorageAPI;
};

export function StoragePage({ storageAPI }: Props) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  /* ---------- FORM STATE ---------- */
  const [quantity, setQuantity] = useState(1);

  /* ---------- UI STATE ---------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------- ACTION ---------- */
  async function onSend() {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload: SendPackagingDTO = {
        role: user!.role,   // ⬅ dolazi iz AuthContext
        amount: quantity,   // ⬅ jedini input
      };

      await storageAPI.sendPackaging(token!, payload);

      setSuccess("📦 Ambalaža uspešno poslata u skladište");
      setQuantity(1);
    } catch (e: any) {
      setError(e.message ?? "Greška pri slanju u skladište");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form
        quantity={quantity}
        setQuantity={setQuantity}
        error={error}
        disabled={loading}
        onSend={onSend}
      />

      {success && (
        <p style={{ color: "green", fontWeight: 600 }}>
          {success}
        </p>
      )}
      <div style={{ position: "relative", minHeight: "100vh" }}>
  <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 20,
      right: 20,
      padding: "8px 14px",
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

  {/* ostatak stranice */}
</div>
    </>
  );
}