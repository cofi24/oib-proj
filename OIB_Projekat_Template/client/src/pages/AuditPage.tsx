import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { IAuditAPI } from "../api/audit/IAuditAPI";
import { AuditLogDTO } from "../models/audit/AuditLogDTO";
import { AuditLogComp } from "../components/audit/AuditLogComp";
import { UpdateAuditLogDTO } from "../models/audit/UpdateAuditLogDTO";
import { useAuth } from "../hooks/useAuthHook";


interface AuditLogsPageProps {
  auditAPI: IAuditAPI;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ auditAPI }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchLogs = async () => {
    if (!token) {
      setError("Niste ulogovani");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await auditAPI.getAll(token);
      setLogs(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Greška prilikom učitavanja događaja";

      setError(message);
      console.error("Error fetching audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError("Niste ulogovani");
      return;
    }

    if (!window.confirm(`Da li ste sigurni da želite da obrišete događaj #${id}?`)) {
      return;
    }

    try {
      await auditAPI.delete(token, id);
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
      setSuccess(`Događaj #${id} je uspešno obrisan`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Greška prilikom brisanja događaja";

      setError(message);
      console.error("Error deleting audit log:", err);
    }
  };

  const handleUpdate = async (id: number, data: UpdateAuditLogDTO) => {
    if (!token) {
      setError("Niste ulogovani");
      return;
    }

    try {
      const updatedLog = await auditAPI.update(token, id, data);

      setLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === id ? updatedLog : log))
      );

      setSuccess(`Događaj #${id} je uspešno ažuriran`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Greška prilikom ažuriranja događaja";

      setError(message);
      console.error("Error updating audit log:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {error && (
        <div className="audit-notification audit-error">
          <div className="audit-notification-content">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M8 4V8M8 10V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={fetchLogs} className="btn btn-standard audit-notification-btn">
            Pokušaj ponovo
          </button>
        </div>
      )}

      {success && (
        <div className="audit-notification audit-success">
          <div className="audit-notification-content">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      <AuditLogComp
        logs={logs}
        isLoading={isLoading}
        onBack={handleBack}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onRefresh={fetchLogs}
      />
    </div>
  );
};