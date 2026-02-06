import React from "react";
import type { PerformanceRepoDTO } from "../../models/performance/PerformanceRepoDTO";

type Props = {
  reports: PerformanceRepoDTO[];
  selectedId?: number | null;
  onSelect: (r: PerformanceRepoDTO) => void;
  onPdf: (id: number) => void;
};

export const Table: React.FC<Props> = ({ reports, selectedId, onSelect, onPdf }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Istorija izveštaja</h3>
        <div style={styles.badge}>Ukupno: {reports.length}</div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Algoritam</th>
              <th style={styles.th}>Vreme</th>
              <th style={styles.th}>Uspešnost</th>
              <th style={styles.th}>Resursi</th>
              <th style={styles.th}>Datum</th>
              <th style={styles.th}>Akcije</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.noData}>
                  <div style={styles.noDataMessage}>
                    <span style={styles.noDataIcon}>📋</span>
                    <p style={styles.noDataText}>
                      Nema izveštaja. Pokreni simulaciju da se kreira novi.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((r) => {
                const active = selectedId === r.id;
                return (
                  <tr
                    key={r.id}
                    style={{
                      ...styles.tableRow,
                      background: active ? "rgba(33, 150, 243, 0.15)" : "transparent",
                      borderLeft: active ? "3px solid #2196f3" : "3px solid transparent",
                    }}
                  >
                    <td style={styles.td}>
                      <span style={styles.idBadge}>{r.id}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.algorithmName}>{r.algorithmName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.metricValue}>{r.executionTime.toFixed(0)} ms</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.progressContainer}>
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${r.successRate}%`,
                            backgroundColor: getSuccessColor(r.successRate),
                          }}
                        />
                        <span style={styles.progressText}>{r.successRate.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.progressContainer}>
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${r.resourceUsage}%`,
                            backgroundColor: getResourceColor(r.resourceUsage),
                          }}
                        />
                        <span style={styles.progressText}>{r.resourceUsage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>
                        {new Date(r.createdAt).toLocaleString("sr-RS")}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          type="button"
                          style={styles.btnView}
                          onClick={() => onSelect(r)}
                          title="Prikaži detalje"
                        >
                          👁 Prikaži
                        </button>
                        <button
                          type="button"
                          style={styles.btnPdf}
                          onClick={() => onPdf(r.id)}
                          title="Preuzmi PDF"
                        >
                          📄 PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper funkcije za boje
const getSuccessColor = (rate: number): string => {
  if (rate >= 80) return "#10b981"; // zelena
  if (rate >= 50) return "#f59e0b"; // narandžasta
  return "#ef4444"; // crvena
};

const getResourceColor = (usage: number): string => {
  if (usage >= 80) return "#ef4444"; // crvena
  if (usage >= 50) return "#f59e0b"; // narandžasta
  return "#10b981"; // zelena
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
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
    whiteSpace: "nowrap",
  },
  tableRow: {
    transition: "all 0.2s ease",
    cursor: "pointer",
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
  algorithmName: {
    fontWeight: 600,
    color: "#90caf9",
  },
  metricValue: {
    fontFamily: "monospace",
    color: "#64b5f6",
    fontWeight: 600,
  },
  progressContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 120,
    height: 24,
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    transition: "width 0.3s ease",
    borderRadius: 12,
  },
  progressText: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 11,
    fontWeight: 700,
    color: "#ffffff",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
  dateText: {
    fontSize: 13,
    color: "#90caf9",
    whiteSpace: "nowrap",
  },
  actionButtons: {
    display: "flex",
    gap: 8,
    whiteSpace: "nowrap",
  },
  btnView: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 6,
    border: "1px solid rgba(59, 130, 246, 0.5)",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnPdf: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 6,
    border: "1px solid rgba(16, 185, 129, 0.5)",
    background: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  noData: {
    textAlign: "center",
    padding: 48,
  },
  noDataMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  noDataIcon: {
    fontSize: 64,
    opacity: 0.4,
  },
  noDataText: {
    color: "#64b5f6",
    fontSize: 15,
    margin: 0,
    lineHeight: 1.6,
  },
};