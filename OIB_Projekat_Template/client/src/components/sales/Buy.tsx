import React from "react";

import { PaymentMethod } from "../../enums/Payment";
import { SaleType } from "../../enums/SaleType";

type Props = {
  productId: number;
  setProductId: (v: number) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (v: PaymentMethod) => void;
  saleType: SaleType;
  setSaleType: (v: SaleType) => void;
  error: string | null;
  disabled: boolean;
  onBuy: () => void;
};

export const Form: React.FC<Props> = ({
  productId,
  setProductId,
  quantity,
  setQuantity,
  paymentMethod,
  setPaymentMethod,
  saleType,
  setSaleType,
  error,
  disabled,
  onBuy,
}) => {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
      borderRadius: 16,
      padding: 32,
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      marginBottom: 24
    }}>
      <h3 style={{ color: "white", textAlign: "center", marginBottom: 24 }}>
        🛒 Prodaja proizvoda
      </h3>

      <input
        type="number"
        placeholder="Product ID"
        value={productId}
        onChange={e => setProductId(Number(e.target.value))}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      <input
        type="number"
        min={1}
        placeholder="Količina"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      <select
        value={paymentMethod}
        onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginBottom: 12 }}
      >
        <option value={PaymentMethod.CASH}>Gotovina</option>
        <option value={PaymentMethod.CARD}>Kartica</option>
      </select>

      <select
        value={saleType}
        onChange={e => setSaleType(e.target.value as SaleType)}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginBottom: 16 }}
      >
        <option value={SaleType.RETAIL}>Maloprodaja</option>
        <option value={SaleType.WHOLESALE}>Veleprodaja</option>
      </select>

      <button
        onClick={onBuy}
        disabled={disabled || productId <= 0 || quantity <= 0}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 8,
          border: "none",
          background: !disabled ? "#10b981" : "#94a3b8",
          color: "white",
          fontWeight: 600,
          cursor: !disabled ? "pointer" : "not-allowed"
        }}
      >
        💳 Kupi
      </button>

      {error && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: "rgba(239,68,68,0.15)",
          borderRadius: 8,
          color: "#fee2e2"
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};