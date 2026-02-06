import React from "react";


type ProductionPlant = {
  id: number;
  plantType: string;
  oilStrength: number;
  status: string;
  createdAt: string | Date;
};

const plantStatusSR: Record<string, string> = {
  PLANTED: "POSAĐENA",
  HARVESTED: "UBRANA",
};

export const Table: React.FC<{ plants: ProductionPlant[] }> = ({ plants }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANTED":
        return "#10b981";
      case "HARVESTED":
        return "#f59e0b";
      default:
        return "#64b5f6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PLANTED":
        return "🌱";
      case "HARVESTED":
        return "🌾";
      default:
        return "📦";
    }
  };

  const getOilColor = (strength: number) => {
    if (strength > 7) return "#ef4444";
    if (strength > 4) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🌿 Biljke</h3>
        <div style={styles.badge}>Ukupno: {plants.length}</div>
      </div>

      <div style={styles.tableContainer}>
        {plants.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🌱</span>
            <p style={styles.emptyText}>Nema zasađenih biljaka</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Tip</th>
                <th style={styles.th}>Jačina ulja</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Vreme proizvodnje</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((p) => (
                <tr key={p.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.idBadge}>{p.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.plantType}>{p.plantType}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.oilStrength}>
                      <div
                        style={{
                          ...styles.oilBar,
                          width: `${Math.min(p.oilStrength * 10, 100)}%`,
                          backgroundColor: getOilColor(p.oilStrength),
                        }}
                      />
                      <span
                        style={{
                          ...styles.oilValue,
                          color: getOilColor(p.oilStrength),
                        }}
                      >
                        {p.oilStrength.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(p.status),
                      }}
                    >
                      {getStatusIcon(p.status)} {plantStatusSR[p.status] ?? p.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.dateText}>
                      {new Date(p.createdAt).toLocaleString("sr-RS")}
                    </span>
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
    marginBottom: 34,
    
  },
  header: {
    padding: "20px 24px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  tableContainer: {
    overflowX: "auto",
    padding: "0 24px 24px 24px",
    overflow: "auto",
    scrollbarWidth: "thin",
    maxHeight: "420px"
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
  idBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 6,
    background: "rgba(100, 181, 246, 0.2)",
    color: "#64b5f6",
    fontWeight: 700,
    fontSize: 13,
  },
  plantType: {
    fontWeight: 600,
    color: "#90caf9",
  },
  oilStrength: {
    position: "relative",
    width: 120,
    height: 24,
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  oilBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    transition: "all 0.3s ease",
    borderRadius: 12,
  },
  oilValue: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 12,
    fontWeight: 700,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
  dateText: {
    fontSize: 13,
    color: "#90caf9",
    whiteSpace: "nowrap",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 200,
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