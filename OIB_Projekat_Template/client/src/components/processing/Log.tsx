import React from "react";
import { AuditLogDTO } from "../../models/audit/AuditLogDTO";




export const Log: React.FC<{ logs: AuditLogDTO[] }> = ({ logs }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📋 Dnevnik prerade</h3>
      </div>

      <div style={styles.content}>
        {logs.length === 0 ? (
          <div style={styles.empty}>Nema logova prerade.</div>
        ) : (
          logs.map(l => (
            <div key={l.id} style={styles.logRow}>
              <div style={styles.logMeta}>
                {new Date(l.createdAt).toLocaleString("sr-RS")} • {l.type}
              </div>
              <div style={styles.logText}>
                {l.description ?? ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    
    background: "#132f4c",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "auto",
    scrollbarWidth: "thin",
    maxHeight: "420px"
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
  logRow: {
    padding: "12px 16px",
    marginBottom: 8,
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  logMeta: {
    fontSize: 12,
    color: "#90caf9",
    marginBottom: 6,
    fontWeight: 600,
  },
  logText: {
    fontSize: 14,
    color: "#e0e0e0",
    lineHeight: 1.5,
  },
};