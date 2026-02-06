import React from "react";
import { AuditLogDTO } from "../../models/audit/AuditLogDTO";



export const Log: React.FC<{ logs: AuditLogDTO[] }> = ({ logs }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "INFO":
        return "#3498db";
      case "WARNING":
        return "#f39c12";
      case "ERROR":
        return "#e74c3c";
      default:
        return "#3498db";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "INFO":
        return "ℹ️";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      default:
        return "📝";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📋 Dnevnik proizvodnje</h3>
        <div style={styles.badge}>Ukupno: {logs.length}</div>
      </div>

      <div style={styles.logContainer}>
        {logs.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📭</span>
            <p style={styles.emptyText}>Nema događaja u dnevniku</p>
          </div>
        ) : (
          logs.map((l) => (
            <div key={l.id} style={styles.logItem}>
              <div style={styles.logIcon}>
                <span style={{ fontSize: 18 }}>{getTypeIcon(l.type)}</span>
              </div>
              
              <div style={styles.logContent}>
                <div style={styles.logMeta}>
                  <span style={styles.logDate}>
                    {new Date(l.createdAt).toLocaleString("sr-RS")}
                  </span>
                  <span
                    style={{
                      ...styles.logType,
                      backgroundColor: getTypeColor(l.type),
                    }}
                  >
                    {l.type}
                  </span>
                </div>
                <div style={styles.logDescription}>{l.description ?? ""}</div>
              </div>
            </div>
          ))
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
  logContainer: {
    maxHeight: 500,
    overflowY: "auto",
    padding: "0 24px 24px 24px",
  },
  logItem: {
    display: "flex",
    gap: 16,
    padding: "16px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    background: "rgba(33, 150, 243, 0.15)",
    border: "1px solid rgba(33, 150, 243, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  logMeta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  logDate: {
    fontSize: 12,
    color: "#90caf9",
    fontWeight: 500,
  },
  logType: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ffffff",
  },
  logDescription: {
    fontSize: 14,
    color: "#e3f2fd",
    lineHeight: 1.6,
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