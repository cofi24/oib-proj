import React from "react";
import { AuditLogDTO } from "../../models/audit/AuditLogDTO";



export const Log: React.FC<{ logs: AuditLogDTO[] }> = ({ logs }) => {
  return (
    <div className="card">
      <h3>Dnevnik proizvodnje</h3>

      {logs.map(l => (
        <div
          key={l.id}
          style={{
            padding: 8,
            borderBottom: "1px solid var(--win11-divider)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {new Date(l.createdAt).toLocaleString()} • {l.type}
          </div>
          <div>{(l.description ?? "")}</div>
        </div>
      ))}
    </div>
  );
};
