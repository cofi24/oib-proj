import React, { useState } from "react";
import { IAuthAPI } from "../api/auth/IAuthAPI";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

type AuthPageProps = {
  authAPI: IAuthAPI;
};

export const AuthPage: React.FC<AuthPageProps> = ({ authAPI }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div style={styles.background}>
      {/* Background image with overlay */}
      <div style={styles.imageBackground}></div>
      <div style={styles.overlay}></div>

      <div style={styles.container}>
        <div style={styles.window}>
          <div style={styles.titlebar}>
            <div style={styles.titlebarIcon}>
              <img style={{ marginTop: -5 }} src='/icon.png' width="20" height="20" />
            </div>
            <span style={styles.titlebarTitle}>Authentication</span>
          </div>

          <div style={styles.windowContent}>
            {/* Tabs */}
            <div style={styles.tabs}>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === "login" ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === "register" ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {/* Content */}
            <div style={styles.content}>
              {activeTab === "login" ? (
                <LoginForm authAPI={authAPI} />
              ) : (
                <RegisterForm authAPI={authAPI} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  imageBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('flower.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "blur(3px)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(10, 25, 41, 0.85) 0%, rgba(19, 47, 76, 0.8) 50%, rgba(30, 73, 118, 0.75) 100%)",
  },
  container: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  window: {
    width: "500px",
    maxWidth: "90%",
    background: "rgba(19, 47, 76, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 100px rgba(33, 150, 243, 0.2)",
    overflow: "hidden",
  },
  titlebar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 20px",
    background: "linear-gradient(135deg, rgba(13, 34, 56, 0.95) 0%, rgba(19, 47, 76, 0.95) 100%)",
    borderBottom: "2px solid rgba(33, 150, 243, 0.3)",
  },
  titlebarIcon: {
    display: "flex",
    alignItems: "center",
  },
  titlebarTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
  },
  windowContent: {
    padding: 0,
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: 600,
    background: "transparent",
    border: "none",
    color: "#90caf9",
    cursor: "pointer",
    transition: "all 0.2s",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "#ffffff",
    borderBottom: "2px solid #2196f3",
    background: "rgba(33, 150, 243, 0.15)",
  },
  content: {
    padding: 24,
  },
};