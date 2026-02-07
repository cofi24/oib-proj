import React, { useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { RegistrationUserDTO } from "../../models/auth/RegistrationUserDTO";
import { UserRole } from "../../enums/UserRole";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type RegisterFormProps = {
  authAPI: IAuthAPI;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ authAPI }) => {
  const [formData, setFormData] = useState<RegistrationUserDTO>({
    username: "",
    email: "",
    password: "",
    role: UserRole.SELLER,
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    handleChange(e);

    if (url.trim()) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register(formData);

      if (response.success) {
        setSuccess(response.message || "Registracija uspešna!");

        if (response.token) {
          login(response.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        setError(response.message || "Registracija neuspešna. Pokušajte ponovo.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📝 Registracija</h2>
        <p style={styles.subtitle}>Napravite novi nalog</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Korisničko ime
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Izaberite korisničko ime"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vas.email@primer.com"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="firstName" style={styles.label}>
              Ime
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Vaše ime"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="lastName" style={styles.label}>
              Prezime
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Vaše prezime"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Lozinka
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimalno 6 karaktera"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Potvrdi lozinku
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Ponovo unesite lozinku"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="role" style={styles.label} >
              Rola
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={styles.select}
            >
              <option value={UserRole.SELLER}>Prodavac</option>
              <option value={UserRole.ADMIN}>Administrator</option>
              <option value={UserRole.SALES_MANAGER}>Menadžer prodaje</option>
            </select>
          </div>

          <div style={styles.inputGroupFull}>
            <label htmlFor="profileImage" style={styles.label}>
              Profilna slika URL <span style={styles.optional}>(opciono)</span>
            </label>
            <input
              type="url"
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleImageChange}
              placeholder="https://primer.com/slika.jpg"
              disabled={isLoading}
              style={styles.input}
            />

            {imagePreview && (
              <div style={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.previewImage}
                  onError={() => setImagePreview(null)}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successContainer}>
            <span style={styles.successIcon}>✓</span>
            <span style={styles.successText}>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.btnSubmit,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? (
            <div style={styles.loadingContent}>
              <div style={styles.spinner}></div>
              <span>Kreiranje naloga...</span>
            </div>
          ) : (
            <div style={styles.buttonContent}>
              <span style={styles.buttonIcon}>📝</span>
              Registruj se
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 700,
    width: "100%",
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
     maxHeight: "70vh", 
  overflowY: "auto",
  },
  header: {
    padding: "32px 32px 24px 32px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: "#90caf9",
  },
  form: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    
  },
  inputGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optional: {
    color: "#64b5f6",
    fontWeight: 400,
    textTransform: "none",
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
  previewContainer: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #2196f3",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  },
  errorContainer: {
    padding: 16,
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: 500,
  },
  successContainer: {
    padding: 16,
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  successIcon: {
    fontSize: 20,
    color: "#10b981",
  },
  successText: {
    color: "#6ee7b7",
    fontSize: 14,
    fontWeight: 500,
  },
  btnSubmit: {
    padding: "16px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 16,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
    marginTop: 8,
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonIcon: {
    fontSize: 20,
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};