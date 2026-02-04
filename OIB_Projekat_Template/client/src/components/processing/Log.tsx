import React from "react";
import { AuditLogDTO } from "../../models/audit/AuditLogDTO";




export const Log: React.FC<{ logs: AuditLogDTO[] }> = ({
  logs,
}) => {
  return (
    <div className="card">
      <h3>Dnevnik prerade</h3>

      {logs.length === 0 ? (
        <div className="empty-state">Nema logova prerade.</div>
      ) : (
        logs.map(l => (
          <div key={l.id} className="log-row">
            <div className="log-meta">
              {new Date(l.createdAt).toLocaleString()} • {l.type}
            </div>
            <div className="log-text">
              {(l.description ?? "")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
