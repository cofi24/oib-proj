import React from "react";
import { TrendDTO } from "../../models/analytics/TrendDTO";

type TrendFlexible = TrendDTO & {
  prodato?: number;
  quantity?: number;
  zarada?: number;
  revenue?: number;
};

type Props = {
  title: string;
  data: TrendFlexible[];
  mode: "prodato" | "zarada";
};
export const Trend: React.FC<Props> = ({ title, data, mode }) => {
  const w = 520;
  const h = 180;
  const pad = 30;

  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>{title}</div>
        </div>
        <div style={styles.noData}>Nema podataka za izabrani period.</div>
      </div>
    );
  }

  const getValue = (d: TrendFlexible): number => {
    if (mode === "prodato") {
      const v = d.prodato ?? d.quantity;
      return typeof v === "number" && Number.isFinite(v) ? v : 0;
    } else {
      const v = d.zarada ?? d.revenue;
      return typeof v === "number" && Number.isFinite(v) ? v : 0;
    }
  };

  const values = data.map(getValue);
  const max = Math.max(1, ...values);

  const pts = data.map((d, i) => {
    const x =
      data.length === 1
        ? w / 2
        : pad + (i * (w - 2 * pad)) / (data.length - 1);

    const v = getValue(d);
    const y = h - pad - (v * (h - 2 * pad)) / max;

    return { x, y, label: d.label ?? "", v };
  });

  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>{title}</div>
      </div>

      <div style={styles.chartArea}>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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

          {/* Ose */}
          <line
            x1={pad}
            y1={h - pad}
            x2={w - pad}
            y2={h - pad}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />
          <line
            x1={pad}
            y1={pad}
            x2={pad}
            y2={h - pad}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />

          {/* Grid linije */}
          {[0, 1, 2, 3].map((i) => {
            const y = pad + (i * (h - pad * 2)) / 3;
            return (
              <line
                key={i}
                x1={pad}
                y1={y}
                x2={w - pad}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Linija trenda */}
          {pts.length > 1 && (
            <polyline
              fill="none"
              stroke="#2196f3"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={poly}
              filter="url(#glow)"
            />
          )}

          {/* Tačke i labele */}
          {pts.map((p, i) => (
            <g key={i}>
              {/* Outer circle */}
              <circle cx={p.x} cy={p.y} r="6" fill="#2196f3" opacity="0.3" />
              {/* Inner circle */}
              <circle cx={p.x} cy={p.y} r="4" fill="#2196f3" stroke="#ffffff" strokeWidth="2" />
              
              {/* Label ispod */}
              <text
                x={p.x}
                y={h - 6}
                fontSize="11"
                textAnchor="middle"
                fill="#90caf9"
                fontWeight="600"
              >
                {p.label}
              </text>
              
              {/* Vrednost iznad */}
              <text
                x={p.x}
                y={p.y - 12}
                fontSize="12"
                textAnchor="middle"
                fill="#ffffff"
                fontWeight="700"
                fontFamily="monospace"
              >
                {p.v.toLocaleString("sr-RS")}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },
  noData: {
    textAlign: "center",
    padding: 40,
    color: "#64b5f6",
    fontSize: 15,
    background: "#0a1929",
  },
  chartArea: {
    padding: 20,
    background: "#0a1929",
  },
};