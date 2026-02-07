import React, { useEffect, useState } from "react";
import { IAuthAPI } from "../../api/auth/IAuthAPI";
import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { useAuth } from "../../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  authAPI: IAuthAPI;
};

export const LoginForm: React.FC<LoginFormProps> = ({ authAPI }) => {
  const [formData, setFormData] = useState<LoginUserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.success && response.token) {
        login(response.token);
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔐 Prijavite se</h2>
        <p style={styles.subtitle}>Unesite svoje podatke za pristup</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
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
            placeholder="Unesite korisničko ime"
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
            placeholder="Unesite lozinku"
            required
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
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
              <span>Prijavljivanje...</span>
            </div>
          ) : (
            <div style={styles.buttonContent}>
              <span style={styles.buttonIcon}>🔓</span>
              Prijavi se
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 520,
    width: "100%",
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
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
    padding: "14px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
    transition: "all 0.3s ease",
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
  btnSubmit: {
    padding: "16px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 16,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(33, 150, 243, 0.4)",
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