import React, { useState, useMemo } from "react";
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

  const toggleSort = (column: "date") => {
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
      console.error("Error updating log:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: AuditLogType) => {
    switch (type) {
      case AuditLogType.INFO:
        return "#3498db";
      case AuditLogType.WARNING:
        return "#f39c12";
      case AuditLogType.ERROR:
        return "#e74c3c";
      default:
        return "#3498db";
    }
  };

  if (isLoading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>Učitavanje događaja...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.pageTitle}>Evidencija događaja</h1>
          <div style={styles.statsBadge}>Ukupno: {logs.length}</div>
        </div>
        <div style={styles.headerActions}>
          {onRefresh && (
            <button style={styles.btnSecondary} onClick={onRefresh}>
              <span style={styles.btnIcon}>↻</span>
              Osveži
            </button>
          )}
          {onBack && (
            <button style={styles.btnSecondary} onClick={onBack}>
              <span style={styles.btnIcon}>←</span>
              Nazad
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersSection}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Tip događaja</label>
          <select
            style={styles.filterSelect}
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as AuditLogType | "ALL")
            }
          >
            <option value="ALL">Svi</option>
            <option value={AuditLogType.INFO}>INFO</option>
            <option value={AuditLogType.WARNING}>WARNING</option>
            <option value={AuditLogType.ERROR}>ERROR</option>
          </select>
        </div>

        <div style={styles.filterGroupGrow}>
          <label style={styles.filterLabel}>Pretraga</label>
          <input
            type="text"
            style={styles.filterInput}
            value={searchTerm}
            placeholder="Pretraga po opisu..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.dataTable}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Tip</th>
              <th style={styles.th}>Opis</th>
              <th
                style={{ ...styles.th, ...styles.thSortable }}
                onClick={() => toggleSort("date")}
              >
                Datum{" "}
                {sortBy === "date" && (
                  <span style={styles.sortIcon}>
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th style={styles.th}>Akcije</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.noData}>
                  <div style={styles.noDataMessage}>
                    <span style={styles.noDataIcon}>📭</span>
                    <p style={styles.noDataText}>Nema podataka</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedLogs.map((log) => (
                <tr key={log.id} style={styles.tableRow}>
                  <td style={styles.td}>{log.id}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: getTypeColor(log.type),
                      }}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td style={styles.td}>{log.description}</td>
                  <td style={styles.td}>{formatDate(log.createdAt)}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.btnAction}
                        onClick={() => setSelectedLog(log)}
                        title="Prikaži"
                      >
                        👁
                      </button>

                      {onUpdate && (
                        <button
                          style={styles.btnAction}
                          onClick={() => handleEditClick(log)}
                          title="Izmeni"
                        >
                          ✎
                        </button>
                      )}

                      {onDelete && (
                        <button
                          style={styles.btnAction}
                          onClick={() => onDelete(log.id)}
                          title="Obriši"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedLog && (
        <div style={styles.modalOverlay} onClick={() => setSelectedLog(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detalji događaja</h3>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>ID:</span>
                <span style={styles.detailValue}>{selectedLog.id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Tip:</span>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getTypeColor(selectedLog.type),
                  }}
                >
                  {selectedLog.type}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Datum:</span>
                <span style={styles.detailValue}>
                  {formatDate(selectedLog.createdAt)}
                </span>
              </div>
              <div style={styles.detailRowFull}>
                <span style={styles.detailLabel}>Opis:</span>
                <p style={styles.detailDescription}>
                  {selectedLog.description}
                </p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.btnSecondary}
                onClick={() => setSelectedLog(null)}
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLog && (
        <div
          style={styles.modalOverlay}
          onClick={() => !isSubmitting && setEditingLog(null)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Izmena događaja</h3>
              <button
                style={styles.modalClose}
                onClick={() => !isSubmitting && setEditingLog(null)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Tip</label>
                <select
                  style={styles.formSelect}
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
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Opis</label>
                <textarea
                  style={styles.formTextarea}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.btnSecondaryModal}
                onClick={() => setEditingLog(null)}
                disabled={isSubmitting}
              >
                Otkaži
              </button>

              <button
                style={styles.btnPrimary}
                onClick={handleSaveEdit}
                disabled={isSubmitting || !editFormData.description?.trim()}
              >
                {isSubmitting ? "Čuvanje..." : "Sačuvaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles - Tamna plava tema
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    background: "#0a1929",
    minHeight: "100vh",
    
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffffff",
    margin: 0,
  },
  statsBadge: {
    background: "#1e3a5f",
    color: "#64b5f6",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    border: "1px solid #2962ff",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    marginLeft: "auto",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#ffffff",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  },
  btnSecondary: {
   position: "absolute",
          top: 50,
          right: 25,
          padding: "8px 14px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  btnSecondaryModal: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    background: "#37474f",
    color: "#ffffff",
    border: "1px solid #546e7a",
    transition: "all 0.3s ease",
  },
  btnIcon: {
    fontSize: "18px",
  },
  filtersSection: {
    background: "#132f4c",
    border: "1px solid #1e4976",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "200px",
  },
  filterGroupGrow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minWidth: "200px",
  },
  filterLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  filterSelect: {
    padding: "10px 14px",
    border: "1px solid #1e4976",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#1e3a5f",
    color: "#ffffff",
    cursor: "pointer",
  },
  filterInput: {
    padding: "10px 14px",
    border: "1px solid #1e4976",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#1e3a5f",
    color: "#ffffff",
  },
  tableContainer: {
    background: "#132f4c",
    border: "1px solid #1e4976",
    borderRadius: "12px",
   
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    maxHeight: "1020px",
    overflow: "auto",
     scrollbarWidth: "thin",
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #2962ff",
    background: "#0d2238",
  },
  thSortable: {
    cursor: "pointer",
    userSelect: "none",
  },
  sortIcon: {
    marginLeft: "6px",
    color: "#42a5f5",
    fontSize: "16px",
  },
  tableRow: {
    transition: "all 0.2s ease",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#e3f2fd",
    borderBottom: "1px solid #1e4976",
  },
  badge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  btnAction: {
    width: "36px",
    height: "36px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #1e4976",
    borderRadius: "8px",
    background: "#1e3a5f",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  noData: {
    textAlign: "center",
    padding: "48px",
  },
  noDataMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  noDataIcon: {
    fontSize: "64px",
    opacity: 0.4,
  },
  noDataText: {
    color: "#64b5f6",
    fontSize: "16px",
    margin: 0,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
    backdropFilter: "blur(4px)",
  },
  modalContent: {
    background: "#132f4c",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid #1e4976",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "2px solid #1e4976",
    background: "#0d2238",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
  },
  modalClose: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e3a5f",
    border: "1px solid #2962ff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#90caf9",
    transition: "all 0.3s ease",
  },
  modalBody: {
    padding: "24px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "24px",
    borderTop: "2px solid #1e4976",
    background: "#0d2238",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 0",
    borderBottom: "1px solid #1e4976",
  },
  detailRowFull: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 0",
  },
  detailLabel: {
    fontWeight: 700,
    color: "#90caf9",
    minWidth: "80px",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    color: "#e3f2fd",
    fontSize: "15px",
  },
  detailDescription: {
    margin: "8px 0 0 0",
    color: "#e3f2fd",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  formSelect: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #1e4976",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#1e3a5f",
    color: "#ffffff",
    cursor: "pointer",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #1e4976",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "120px",
    background: "#1e3a5f",
    color: "#ffffff",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "500px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #1e4976",
    borderTopColor: "#2196f3",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    color: "#90caf9",
    fontSize: "16px",
    fontWeight: 600,
  },
};