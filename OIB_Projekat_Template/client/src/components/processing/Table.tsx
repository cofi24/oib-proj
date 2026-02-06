import React from "react";
import { AmountDTO } from "../../models/processing/AmountDTO";



export const Table: React.FC<{
  amount: AmountDTO[];
}> = ({ amount }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🔬 Prerada</h3>
      </div>

      <div style={styles.content}>
        {amount.length === 0 ? (
          <div style={styles.empty}>
            Nema prerade.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Parfem</th>
                  <th style={styles.th}>Bočice</th>
                  <th style={styles.th}>Zapremina</th>
                  <th style={styles.th}>Biljke</th>
                </tr>
              </thead>
              <tbody>
                {amount.map(b => (
                  <tr key={b.id} style={styles.row}>
                    <td style={styles.td}>{b.id}</td>
                    <td style={styles.td}>{b.perfumeType}</td>
                    <td style={styles.td}>{b.bottleCount}</td>
                    <td style={styles.td}>{b.bottleVolumeMl} ml</td>
                    <td style={styles.td}>{b.plantsNeeded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    overflow: "hidden",
    background: "#132f4c",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    marginBottom: 34,
  },
  header: {
    padding: "16px 20px",
    borderBottom: "2px solid #1e4976",
    background: "#0d2238",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
  },
  content: {
    padding: 16,
    background: "#0a1929",
  },
  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64b5f6",
    fontSize: 15,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    background: "#132f4c",
    borderBottom: "2px solid #1e4976",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  td: {
    padding: "12px 16px",
    fontSize: 14,
    color: "#e0e0e0",
  },
};
