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
  <div
    style={{
      marginBottom: 32,
      padding: 24,
      backgroundColor: "#1a1a2e",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.1)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 16,
    }}
  >
    <input
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={inputStyle}
    />

    <input
      type="password"
      placeholder="Lozinka"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={inputStyle}
    />

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={inputStyle}
    />

    {/* ROLE – preporuka: select */}
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      style={inputStyle}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>

    <input
      placeholder="Ime"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      style={inputStyle}
    />

    <input
      placeholder="Prezime"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      style={inputStyle}
    />

    {/* ACTIONS */}
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        gap: 12,
        marginTop: 8,
      }}
    >
      {!isEditing ? (
        <button style={primaryBtn} onClick={onCreate}>
          ➕ Dodaj korisnika
        </button>
      ) : (
        <>
          <button style={primaryBtn} onClick={onUpdate}>
            💾 Sačuvaj izmene
          </button>
          <button style={secondaryBtn} onClick={onCancelEdit}>
            ✖ Otkaži
          </button>
        </>
      )}
    </div>
  </div>
);
};


const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  backgroundColor: "#0f0f1e",
  color: "#ffffff",
  fontSize: 14,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const secondaryBtn: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "transparent",
  color: "#ffffff",
  fontWeight: 500,
  cursor: "pointer",
};