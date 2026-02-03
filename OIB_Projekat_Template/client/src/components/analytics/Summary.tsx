import React from "react";
import { SummaryDTO } from "../../models/analytics/SummaryDTO";

type SummaryFlexible = SummaryDTO & {
  totalRevenue?: number;
  totalQuantity?: number;
  totalReceipts?: number;
  ukupnoParfema?: number;
};

type Props = {
  summary?: SummaryFlexible | null;
  top10Revenue?: number | null;
};

const formatRSD = (v?: number | null) =>
  typeof v === "number" ? v.toLocaleString("sr-RS") + " RSD" : "-";

const asNumber = (v?: number | null): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

export const Summary: React.FC<Props> = ({ summary, top10Revenue }) => {
  const totalRevenue =
    asNumber(summary?.ukupnaZarada) ?? asNumber(summary?.totalRevenue);
  const totalReceipts = asNumber(summary?.totalReceipts);
  const totalQuantity =
    asNumber(summary?.ukupnoParfema) ?? asNumber(summary?.totalQuantity);

  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <div style={styles.label}>Broj računa</div>
        <div style={styles.value}>{totalReceipts ?? "-"}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Ukupno prodato</div>
        <div style={styles.value}>
          {totalQuantity ?? "-"} parfema
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Ukupna zarada</div>
        <div style={styles.value}>{formatRSD(totalRevenue)}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Top 10 prihod</div>
        <div style={styles.value}>{formatRSD(top10Revenue)}</div>
        <div style={styles.subtitle}>ukupan prihod top 10</div>
      </div>
    </div>
  );
};const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    border: "1px solid #000000",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#13134d",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 20,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
};
