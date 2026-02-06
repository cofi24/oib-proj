import React, { useMemo } from "react";

type Props = {
  title: string;
  subtitle?: string;
  values: number[];
  valueSuffix?: string;
};

export const Chart: React.FC<Props> = ({ title, subtitle, values, valueSuffix }) => {
  const width = 560;
  const height = 240;
  const pad = 28;

  const { min, max, path, lastValue, areaPath } = useMemo(() => {
    const safe = (values?.length ? values : []).map((v) => (Number.isFinite(v) ? v : 0));
    const mn = Math.min(...safe);
    const mx = Math.max(...safe);
    const span = mx - mn || 1;

    const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(1, safe.length - 1);
    const y = (v: number) => height - pad - ((v - mn) * (height - pad * 2)) / span;

    const p = safe.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
    
    // Area path za gradient ispod linije
    const areaP = safe.length > 0
      ? `${p} L ${x(safe.length - 1)} ${height - pad} L ${pad} ${height - pad} Z`
      : "";

    return { min: mn, max: mx, path: p, areaPath: areaP, lastValue: safe[safe.length - 1] };
  }, [values]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>📈 {title}</h3>
          <div style={styles.subtitle}>
            {subtitle ?? (values?.length ? `Poslednja vrednost: ${lastValue.toFixed(2)}${valueSuffix ?? ""}` : "Nema podataka")}
          </div>
        </div>
        {values?.length > 0 && (
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Max</span>
              <span style={styles.statValueMax}>{max.toFixed(2)}{valueSuffix ?? ""}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Min</span>
              <span style={styles.statValueMin}>{min.toFixed(2)}{valueSuffix ?? ""}</span>
            </div>
          </div>
        )}
      </div>

      <div style={styles.chartArea}>
        {values?.length === 0 ? (
          <div style={styles.noData}>
            <span style={styles.noDataIcon}>📊</span>
            <p style={styles.noDataText}>Nema podataka za prikaz</p>
          </div>
        ) : (
          <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
            {/* Definicija gradienta */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2196f3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2196f3" stopOpacity="0.05" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontalne grid linije */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = pad + (i * (height - pad * 2)) / 4;
              return (
                <line
                  key={i}
                  x1={pad}
                  y1={y}
                  x2={width - pad}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Vertikalne grid linije */}
            {values.map((_, i) => {
              if (i % Math.max(1, Math.floor(values.length / 8)) === 0) {
                const xPos = pad + (i * (width - pad * 2)) / Math.max(1, values.length - 1);
                return (
                  <line
                    key={`v-${i}`}
                    x1={xPos}
                    y1={pad}
                    x2={xPos}
                    y2={height - pad}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              }
              return null;
            })}

            {/* Okvir */}
            <rect
              x={pad}
              y={pad}
              width={width - pad * 2}
              height={height - pad * 2}
              fill="transparent"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              rx="4"
            />

            {/* Gradient area ispod linije */}
            <path
              d={areaPath}
              fill="url(#areaGradient)"
            />

            {/* Glavna linija */}
            <path
              d={path}
              fill="none"
              stroke="#2196f3"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Tačke na grafu */}
            {values.map((v, i) => {
              const cx = pad + (i * (width - pad * 2)) / Math.max(1, values.length - 1);
              const cy = height - pad - ((v - min) * (height - pad * 2)) / (max - min || 1);
              
              return (
                <g key={i}>
                  {/* Outer circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill="#2196f3"
                    opacity="0.3"
                  />
                  {/* Inner circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="#2196f3"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Highlight poslednje tačke */}
            {values.length > 0 && (
              <circle
                cx={pad + ((values.length - 1) * (width - pad * 2)) / Math.max(1, values.length - 1)}
                cy={height - pad - ((lastValue - min) * (height - pad * 2)) / (max - min || 1)}
                r="8"
                fill="none"
                stroke="#64b5f6"
                strokeWidth="2"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  from="6"
                  to="12"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    overflow: "hidden",
    background: "#132f4c",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "2px solid #1e4976",
    background: "#0d2238",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 13,
    color: "#90caf9",
    marginTop: 4,
  },
  stats: {
    display: "flex",
    gap: 16,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: 600,
  },
  statValueMax: {
    fontSize: 16,
    fontWeight: 700,
    color: "#10b981",
    fontFamily: "monospace",
  },
  statValueMin: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ef4444",
    fontFamily: "monospace",
  },
  chartArea: {
    padding: 20,
    background: "#0a1929",
  },
  noData: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    gap: 12,
  },
  noDataIcon: {
    fontSize: 64,
    opacity: 0.4,
  },
  noDataText: {
    color: "#64b5f6",
    fontSize: 15,
    margin: 0,
  },
};