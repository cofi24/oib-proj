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
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

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
  handleChange(e); // tvoja postojeća funkcija
  
  // Validacija i preview
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

    // Validation
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register(formData);

      if (response.success) {
        setSuccess(response.message || "Registration successful!");
        
        // Auto-login if token is provided
        if (response.token) {
          login(response.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="username" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="role" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          disabled={isLoading}
        >
          <option value={UserRole.SELLER}>Seller</option>
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.SALES_MANAGER}>Sales Manager</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (min 6 characters)"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
          Confirm Password
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
          placeholder="Re-enter your password"
          required
          disabled={isLoading}
        />
      </div>
          <div>
  <label
    htmlFor="firstName"
    style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}
  >
    First name
  </label>
  <input
    type="text"
    id="firstName"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    placeholder="Your first name"
    required
    disabled={isLoading}
  />
</div>

      <div>
        <label
          htmlFor="lastName"
          style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}
        >
          Last name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Your last name"
          required
          disabled={isLoading}
        />
      </div>

      <div style={styles.imageSection}>
    <label htmlFor="profileImage" style={styles.label}>
      Profile Image URL{" "}
      <span style={styles.optional}>(Optional)</span>
    </label>
    
    <input
      type="url"
      id="profileImage"
      name="profileImage"
      value={formData.profileImage}
      onChange={handleImageChange}
      placeholder="https://example.com/avatar.jpg"
      disabled={isLoading}
      style={styles.input}
    />
    
    {/* Preview slike */}
    {imagePreview && (
      <div style={styles.previewContainer}>
        <img
          src={imagePreview}
          alt="Preview"
          style={styles.previewImage}
          onError={() => setImagePreview(null)} // ukloni ako URL ne radi
        />
      </div>
    )}
  </div>

      {error && (
        <div
          className="card"
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(196, 43, 28, 0.15)",
            borderColor: "var(--win11-close-hover)",
          }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--win11-close-hover)">
              <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 110 10A5 5 0 018 3zm0 2a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3A.5.5 0 018 5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
            </svg>
            <span style={{ fontSize: "13px", color: "var(--win11-text-primary)" }}>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div
          className="card"
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(16, 124, 16, 0.15)",
            borderColor: "#107c10",
          }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#107c10">
              <path d="M8 2a6 6 0 110 12A6 6 0 018 2zm2.354 4.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L7 8.793l2.646-2.647a.5.5 0 01.708 0z"/>
            </svg>
            <span style={{ fontSize: "13px", color: "var(--win11-text-primary)" }}>{success}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-accent"
        disabled={isLoading}
        style={{ marginTop: "8px" }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div>
            <span>Creating account...</span>
          </div>
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
};
const styles: Record<string, React.CSSProperties> = {
  imageSection: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 700,
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
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    background: "#0a1929",
    color: "#ffffff",
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
};