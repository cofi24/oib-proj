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
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🛒 Prodaja proizvoda</h3>
      </div>

      <div style={styles.formBody}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Product ID</label>
          <input
            type="number"
            placeholder="Unesite ID proizvoda"
            value={productId || ""}
            onChange={(e) => setProductId(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Količina</label>
          <input
            type="number"
            min={1}
            placeholder="Unesite količinu"
            value={quantity || ""}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Način plaćanja</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            style={styles.select}
          >
            <option value={PaymentMethod.CASH}>💵 Gotovina</option>
            <option value={PaymentMethod.CARD}>💳 Kartica</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tip prodaje</label>
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value as SaleType)}
            style={styles.select}
          >
            <option value={SaleType.RETAIL}>🏪 Maloprodaja</option>
            <option value={SaleType.WHOLESALE}>🏭 Veleprodaja</option>
          </select>
        </div>
      </div>

      <div style={styles.formFooter}>
        <button
          onClick={onBuy}
          disabled={disabled || productId <= 0 || quantity <= 0}
          style={{
            ...styles.btnBuy,
            opacity: disabled || productId <= 0 || quantity <= 0 ? 0.5 : 1,
            cursor: disabled || productId <= 0 || quantity <= 0 ? "not-allowed" : "pointer",
          }}
        >
          <span style={styles.btnIcon}>💳</span>
          Kupi
        </button>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
    marginBottom: 24,
      maxWidth: 950,
      margin: "0 auto 24px auto",
  },
  header: {
    padding: "20px 24px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
  },
  formBody: {
    padding: 24,
    display: "grid",
    gap: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s ease",
  },
  select: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  formFooter: {
    padding: "20px 24px",
    background: "#0d2238",
    borderTop: "2px solid #1e4976",
  },
  btnBuy: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 16,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
  },
  btnIcon: {
    fontSize: 20,
  },
  errorContainer: {
    margin: "0 24px 24px 24px",
    padding: 16,
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: 500,
  },
};