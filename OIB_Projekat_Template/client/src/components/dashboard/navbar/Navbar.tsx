import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuthHook";

export const DashboardNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleSrpski: Record<string, string> = {
    ADMIN: "Administrator",
    SALES_MANAGER: "Menadžer prodaje",
    SELLER: "Prodavac",
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="navbar-brand-text">Parfemi ERP</span>
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="navbar-user-info">
                <div className="navbar-avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="navbar-user-details">
                  <div className="navbar-user-email">{user.username}</div>
                  <div className="navbar-user-role">
                    {roleSrpski[user.role] || user.role}
                  </div>
                </div>
              </div>

              <button className="navbar-logout-btn" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="navbar-logout-text">Odjavi se</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};