import React from "react";
import type { ProductResponse } from "../../types/ProductRespones";

type Props = {
  products: ProductResponse[];
  loading: boolean;
  onRefresh: () => void;
};
export const Catalog: React.FC<Props> = ({
  products,
  loading,
  
}) => {
  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h3 style={styles.title}>📦 Katalog proizvoda</h3>
          <div style={styles.badge}>Ukupno: {products.length}</div>
        </div>
        
      </div>

      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
            <span style={styles.loadingText}>Učitavanje proizvoda...</span>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p style={styles.emptyText}>Nema proizvoda u katalogu</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Naziv</th>
                <th style={styles.th}>Brend</th>
                <th style={styles.th}>Cena</th>
                <th style={styles.th}>Količina</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.indexBadge}>{p.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.productName}>{p.name}</span>
                  </td>
                  <td style={styles.td}>{p.brand}</td>
                  <td style={styles.td}>
                    <span style={styles.price}>{p.price.toFixed(2)} RSD</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.quantityBadge,
                      backgroundColor: p.quantity > 10 ? "#10b981" : p.quantity > 0 ? "#f59e0b" : "#ef4444",
                    }}>
                      {p.quantity}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {p.quantity > 10 ? (
                      <span style={styles.statusAvailable}>✓ Dostupno</span>
                    ) : p.quantity > 0 ? (
                      <span style={styles.statusLow}>⚠ Malo zaliha</span>
                    ) : (
                      <span style={styles.statusOut}>✗ Nema na stanju</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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
    padding: "0px 24px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
  },
  badge: {
    background: "#1e3a5f",
    color: "#64b5f6",
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
  },
  btnRefresh: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid rgba(59, 130, 246, 0.5)",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnIcon: {
    fontSize: 16,
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: 16,
    textAlign: "left",
    fontSize: 13,
    fontWeight: 700,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "2px solid #2962ff",
    background: "#0d2238",
  },
  tableRow: {
    transition: "all 0.2s ease",
  },
  td: {
    padding: 16,
    fontSize: 14,
    color: "#e3f2fd",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  indexBadge: {
    
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "rgba(100, 181, 246, 0.2)",
    color: "#64b5f6",
    fontWeight: 700,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontWeight: 600,
    color: "#90caf9",
  },
  price: {
    fontFamily: "monospace",
    color: "#10b981",
    fontWeight: 700,
    fontSize: 15,
  },
  quantityBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    color: "#ffffff",
    minWidth: 40,
    textAlign: "center",
  },
  statusAvailable: {
    color: "#10b981",
    fontSize: 13,
    fontWeight: 600,
  },
  statusLow: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: 600,
  },
  statusOut: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: 600,
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 240,
    padding: 48,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    border: "4px solid #1e4976",
    borderTopColor: "#2196f3",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: 14,
    color: "#90caf9",
    fontWeight: 600,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 240,
    padding: 48,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.4,
  },
  emptyText: {
    color: "#64b5f6",
    fontSize: 15,
    margin: 0,
  },
};