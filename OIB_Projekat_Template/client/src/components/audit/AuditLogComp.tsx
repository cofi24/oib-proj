import React,{useState,useMemo} from "react";
import { AuditLogDTO } from "../../models/audit/AuditLogDTO";
import { AuditLogType } from "../../enums/AuditLogType";
import { UpdateAuditLogDTO } from "../../models/audit/UpdateAuditLogDTO";   

interface AuditLogTableProps {
  logs: AuditLogDTO[];
  isLoading?: boolean;
  onBack?: () => void;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: UpdateAuditLogDTO) => Promise<void>;
  onRefresh?: () => void;
}

export const AuditLogComp: React.FC<AuditLogTableProps> = ({
  logs,
  isLoading,
  onBack,
  onDelete,
  onUpdate,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<AuditLogType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "type">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLog, setSelectedLog] = useState<AuditLogDTO | null>(null);
  const [editingLog, setEditingLog] = useState<AuditLogDTO | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateAuditLogDTO>({
    type: AuditLogType.INFO,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs;

    if (filterType !== "ALL") {
      filtered = filtered.filter((log) => log.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const comparison = a.type.localeCompare(b.type);
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });
  }, [logs, filterType, searchTerm, sortBy, sortOrder]);

 

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const toggleSort = (column: "date" ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleEditClick = (log: AuditLogDTO) => {
    setEditingLog(log);
    setEditFormData({
      type: log.type || AuditLogType.INFO,
      description: log.description || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingLog || !onUpdate) return;

    setIsSubmitting(true);
    try {
      await onUpdate(editingLog.id, editFormData);
      setEditingLog(null);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

 

  if (isLoading) {
    return (
      <div style={{ padding: 30 }}>
        <div className="loading-container">
          <div className="spinner"></div>
          <div style={{ marginTop: 12, color: "var(--win11-text-secondary)" }}>
            Učitavanje događaja...
          </div>
        </div>
      </div>
    );
  }

  

 return (
  <div>
    <h1>Evidencija događaja</h1>

    <p>Ukupno: {logs.length}</p>
 

    <hr />

    <div>
      <label>Tip događaja</label>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as AuditLogType | "ALL")}
      >
        <option value="ALL">Svi</option>
        <option value={AuditLogType.INFO}>INFO</option>
        <option value={AuditLogType.WARNING}>WARNING</option>
        <option value={AuditLogType.ERROR}>ERROR</option>
      </select>

      <label>Pretraga</label>
      <input
        type="text"
        value={searchTerm}
        placeholder="Pretraga po opisu"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <hr />

    <table border={1} cellPadding={6}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tip</th>
          <th>Opis</th>
          <th onClick={() => toggleSort("date")}>
            Datum {sortBy === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </th>
          <th>Akcije</th>
        </tr>
      </thead>

      <tbody>
        {filteredAndSortedLogs.length === 0 ? (
          <tr>
            <td colSpan={5}>Nema podataka</td>
          </tr>
        ) : (
          filteredAndSortedLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.type}</td>
              <td>{log.description}</td>
              <td>{formatDate(log.createdAt)}</td>
              <td>
                <button onClick={() => setSelectedLog(log)}>View</button>

                {onUpdate && (
                  <button onClick={() => handleEditClick(log)}>Edit</button>
                )}

                {onDelete && (
                  <button onClick={() => onDelete(log.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

   {selectedLog && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={() => setSelectedLog(null)}
  >
    <div
      style={{ background: "#000000", padding: 20, minWidth: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Detalji događaja</h3>
      <p>ID: {selectedLog.id}</p>
      <p>Tip: {selectedLog.type}</p>
      <p>Datum: {formatDate(selectedLog.createdAt)}</p>
      <p>Opis: {selectedLog.description}</p>

      <button onClick={() => setSelectedLog(null)}>Zatvori</button>
    </div>
  </div>
)}


    {editingLog && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={() => !isSubmitting && setEditingLog(null)}
  >
    <div
      style={{ background: "#000000", padding: 20, minWidth: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Izmena događaja</h3>

      <label>Tip</label>
      <select
        value={editFormData.type}
        onChange={(e) =>
          setEditFormData({
            ...editFormData,
            type: e.target.value as AuditLogType,
          })
        }
        disabled={isSubmitting}
      >
        <option value={AuditLogType.INFO}>INFO</option>
        <option value={AuditLogType.WARNING}>WARNING</option>
        <option value={AuditLogType.ERROR}>ERROR</option>
      </select>

      <label>Opis</label>
      <textarea
        value={editFormData.description}
        onChange={(e) =>
          setEditFormData({
            ...editFormData,
            description: e.target.value,
          })
        }
        disabled={isSubmitting}
      />

      <div>
        <button
          onClick={() => setEditingLog(null)}
          disabled={isSubmitting}
        >
          Otkaži
        </button>

        <button
          onClick={handleSaveEdit}
          disabled={isSubmitting || !editFormData.description?.trim()}
        >
          Sačuvaj
        </button>
      </div>
    </div>
  </div>
)}
    {onRefresh && <button onClick={onRefresh}>Osveži</button>}
    {onBack && <button onClick={onBack}>Nazad</button>}

  </div>
);

};