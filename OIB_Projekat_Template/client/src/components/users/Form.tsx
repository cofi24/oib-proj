type Props = {
  username: string;
  setUsername: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isEditing: boolean;
  onCreate: () => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
};

export const Form: React.FC<Props> = ({
  username,
  setUsername,
  email,
  setEmail,
  role,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  setRole,
  isEditing,
  onCreate,
  onUpdate,
  onCancelEdit,
}) => {
  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h2 style={styles.formTitle}>
          {isEditing ? "✎ Izmena korisnika" : "➕ Novi korisnik"}
        </h2>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            placeholder="Unesite username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Lozinka</label>
          <input
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="primer@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Rola</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Ime</label>
          <input
            placeholder="Unesite ime"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Prezime</label>
          <input
            placeholder="Unesite prezime"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formActions}>
        {!isEditing ? (
          <button style={styles.btnPrimary} onClick={onCreate}>
            <span style={styles.btnIcon}>➕</span>
            Dodaj korisnika
          </button>
        ) : (
          <>
            <button style={styles.btnPrimary} onClick={onUpdate}>
              <span style={styles.btnIcon}>💾</span>
              Sačuvaj izmene
            </button>
            <button style={styles.btnSecondary} onClick={onCancelEdit}>
              <span style={styles.btnIcon}>✖</span>
              Otkaži
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  formContainer: {
    marginBottom: 32,
    background: "#132f4c",
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
  },
  formHeader: {
    padding: "20px 24px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
  },
  formTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  formGrid: {
    padding: 24,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s ease",
  },
  select: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  formActions: {
    padding: "20px 24px",
    background: "#0d2238",
    borderTop: "2px solid #1e4976",
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnIcon: {
    fontSize: 16,
  },
};