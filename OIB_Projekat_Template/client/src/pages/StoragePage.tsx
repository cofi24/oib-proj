import { useState } from "react";
import { Form } from "../components/storage/Form";
import { IStorageAPI } from "../api/storage/IStorageAPI";
import { useAuth } from "../hooks/useAuthHook";
import { SendPackagingDTO } from "../models/storage/SendPackagingDTO";

type Props = {
  storageAPI: IStorageAPI;
};

export function StoragePage({ storageAPI }: Props) {
  const { token, user } = useAuth();

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
    </>
  );
}