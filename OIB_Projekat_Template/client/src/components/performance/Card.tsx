import React from "react";

type Props = {
  title: string;
  value: React.ReactNode;
  suffix?: string;
  hint?: string;
  icon?: string;
  color?: string;
};

export const Card: React.FC<Props> = ({ 
  title, 
  value, 
  suffix, 
  hint, 
  icon = "📊",
  color = "#2196f3"
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>{icon}</span>
        </div>
        <div style={styles.titleText}>{title}</div>
      </div>

      <div style={styles.valueContainer}>
        <div style={{ ...styles.value, color }}>{value}</div>
        {suffix && <div style={styles.suffix}>{suffix}</div>}
      </div>

      {hint && (
        <div style={styles.hint}>
          <span style={styles.hintIcon}>ℹ️</span>
          {hint}
        </div>
      )}

      {/* Dekorativni gradient */}
      <div
        style={{
          ...styles.gradient,
          background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
        }}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    background: "#132f4c",
    minHeight: 120,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "rgba(33, 150, 243, 0.15)",
    border: "1px solid rgba(33, 150, 243, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  titleText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1,
    fontFamily: "monospace",
    textShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
  },
  suffix: {
    fontSize: 14,
    color: "#90caf9",
    fontWeight: 600,
  },
  hint: {
    fontSize: 12,
    color: "#64b5f6",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    background: "rgba(100, 181, 246, 0.1)",
    borderRadius: 6,
    border: "1px solid rgba(100, 181, 246, 0.2)",
  },
  hintIcon: {
    fontSize: 14,
  },
  gradient: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "60%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
};