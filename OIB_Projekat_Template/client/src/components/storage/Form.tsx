import React from "react";

type Props = {
  
  
  quantity: number;
  setQuantity: (v: number) => void;
  error: string | null;
  disabled: boolean;
  onSend: () => void;
};

export const Form: React.FC<Props> = ({
  
  quantity,
  setQuantity,
  error,
  disabled,
  onSend,
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: 24,
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        📦 Slanje u skladište
      </h3>

      

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Broj ambalaza za slanje"
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          marginBottom: 20,
          fontSize: 15,
          outline: "none",
        }}
      />

      <button
  onClick={onSend}
  disabled={disabled || quantity <= 0}
  style={{
    width: "100%",
    padding: "14px 0",
    borderRadius: 8,
    border: "none",
    background:
      !disabled && quantity > 0
        ? "#22c55e"
        : "#94a3b8",
    color: "white",
    fontWeight: 600,
    fontSize: 15,
    cursor:
      !disabled && quantity > 0
        ? "pointer"
        : "not-allowed",
    transition: "all 0.2s",
  }}
>
  🚚 Pošalji
</button>


      {error && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.15)",
            borderRadius: 8,
            color: "#fee2e2",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
