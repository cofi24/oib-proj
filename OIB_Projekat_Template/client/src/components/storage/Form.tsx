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
  const isValid = !disabled && quantity > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        📦 Slanje u skladište
      </h3>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Broj ambalaza za slanje"
        style={styles.input}
      />

      <button
        onClick={onSend}
        disabled={!isValid}
        style={{
          ...styles.button,
          background: isValid ? "#10b981" : "#475569",
          cursor: isValid ? "pointer" : "not-allowed",
          boxShadow: isValid ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
        }}
      >
        🚚 Pošalji
      </button>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "linear-gradient(135deg, #132f4c 0%, #0d2238 100%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    marginBottom: 24,
  },
  title: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 24px 0",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    marginBottom: 20,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    background: "#0a1929",
    color: "#ffffff",
  },
  button: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 8,
    border: "none",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 15,
    transition: "all 0.2s",
  },
  error: {
    marginTop: 16,
    padding: "12px 16px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    color: "#fecaca",
    fontSize: 14,
    fontWeight: 600,
  },
};