import { UserDTO } from "../../models/users/UserDTO";

type Props = {
  users: UserDTO[];
  onEdit: (u: UserDTO) => void;
  onDelete: (id: number) => void;
};

export const Table: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Ime</th>
            <th style={styles.th}>Prezime</th>
            <th style={styles.th}>Akcije</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} style={styles.noData}>
                <div style={styles.noDataMessage}>
                  <span style={styles.noDataIcon}>👤</span>
                  <p style={styles.noDataText}>Nema korisnika</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} style={styles.tableRow}>
                <td style={styles.td}>{u.id}</td>
                <td style={styles.td}>
                  <span style={styles.username}>{u.username}</span>
                </td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.roleBadge,
                      backgroundColor:
                        u.role === "ADMIN" ? "#3b82f6" : "#10b981",
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={styles.td}>{u.firstName || "-"}</td>
                <td style={styles.td}>{u.lastName || "-"}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.btnEdit}
                      onClick={() => onEdit(u)}
                      title="Izmeni"
                    >
                      ✎
                    </button>
                    <button
                      style={styles.btnDelete}
                      onClick={() => onDelete(u.id)}
                      title="Obriši"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tableContainer: {
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
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
    cursor: "pointer",
  },
  td: {
    padding: 16,
    fontSize: 14,
    color: "#e3f2fd",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  username: {
    fontWeight: 600,
    color: "#64b5f6",
  },
  roleBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
  actionButtons: {
    display: "flex",
    gap: 8,
  },
  btnEdit: {
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(59, 130, 246, 0.5)",
    borderRadius: 8,
    background: "rgba(59, 130, 246, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: 16,
    color: "#3b82f6",
  },
  btnDelete: {
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(239, 68, 68, 0.5)",
    borderRadius: 8,
    background: "rgba(239, 68, 68, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: 16,
    color: "#ef4444",
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
    fontSize: 16,
    margin: 0,
  },
};