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
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '20px'
        }}>{title}</div>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#999',
          fontSize: '15px'
        }}>Nema podataka za izabrani period.</div>
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
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px'
      }}>{title}</div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke="#e0e0e0"
          strokeWidth="1.5"
        />
        <line
          x1={pad}
          y1={pad}
          x2={pad}
          y2={h - pad}
          stroke="#e0e0e0"
          strokeWidth="1.5"
        />

        {pts.length > 1 && (
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={poly}
          />
        )}

        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            <text
              x={p.x}
              y={h - 6}
              fontSize="11"
              textAnchor="middle"
              fill="#666"
              fontWeight="500"
            >
              {p.label}
            </text>
            <text
              x={p.x}
              y={p.y - 12}
              fontSize="12"
              textAnchor="middle"
              fill="#1a1a1a"
              fontWeight="600"
            >
              {p.v.toLocaleString("sr-RS")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};