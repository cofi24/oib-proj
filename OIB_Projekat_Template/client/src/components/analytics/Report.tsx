import React,{useMemo,useState} from "react";
import { ReportDTO } from "../../models/analytics/ReportDTO";


type Props = {
  reports: ReportDTO[];
  onExportPdf: (id: number) => void;
};

type SortKey =
  | "createdAtDesc"
  | "createdAtAsc"
  | "zaradaDesc"
  | "zaradaAsc";

export const ReportsPanel: React.FC<Props> = ({ reports, onExportPdf }) => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("createdAtDesc");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const list = reports.filter((r) => {
      if (!qq) return true;
      return (
        r.nazivIzvestaja.toLowerCase().includes(qq) ||
        r.opis.toLowerCase().includes(qq) ||
        r.period.toLowerCase().includes(qq) ||
        String(r.id).includes(qq)
      );
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "createdAtAsc":
          return a.createdAt.localeCompare(b.createdAt);
        case "zaradaDesc":
          return (b.ukupnaZarada ?? 0) - (a.ukupnaZarada ?? 0);
        case "zaradaAsc":
          return (a.ukupnaZarada ?? 0) - (b.ukupnaZarada ?? 0);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [reports, q, sort]);

  return (
    <div style={styles.panel}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>
          Izveštaji ({reports.length})
        </div>

        <div style={styles.controls}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraga (naziv, opis, period, ID)"
            style={styles.input}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={styles.select}
          >
            <option value="createdAtDesc">Najnovije</option>
            <option value="createdAtAsc">Najstarije</option>
            <option value="zaradaDesc">Zarada ↓</option>
            <option value="zaradaAsc">Zarada ↑</option>
          </select>
        </div>
      </div>

      {/* CONTENT */}
      <div>
        {filtered.length === 0 ? (
          <div style={styles.empty}>Nema rezultata.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} style={styles.item}>
              <div style={{ flex: 1 }}>
                <div style={styles.itemTitle}>
                  {r.nazivIzvestaja}
                </div>

                <div style={styles.meta}>
                  #{r.id} • {r.period} •{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </div>

                <div style={styles.description}>
                  {r.opis}
                </div>

                <div style={styles.summary}>
                  Prodaja:{" "}
                  <strong>{r.ukupnaProdaja}</strong>{" "}
                  • Zarada:{" "}
                  <strong>{r.ukupnaZarada}</strong>
                </div>
              </div>

              <button
                onClick={() => onExportPdf(r.id)}
                style={styles.button}
              >
                Izvezi PDF
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    
    background: "#132f4c",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    maxHeight: "620px",
    overflow: "auto",
    scrollbarWidth: "thin",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "2px solid #1e4976",
    background: "#0d2238",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },
  controls: {
    display: "flex",
    gap: 8,
  },
  input: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: 14,
    background: "#0a1929",
    color: "#ffffff",
    outline: "none",
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: 14,
    background: "#0a1929",
    color: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  empty: {
    padding: 40,
    textAlign: "center",
    color: "#64b5f6",
    fontSize: 15,
    background: "#0a1929",
  },
  item: {
    display: "flex",
    gap: 16,
    padding: 16,
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    alignItems: "flex-start",
    background: "#0a1929",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#90caf9",
    marginBottom: 6,
  },
  line: {
    fontSize: 14,
    color: "#e0e0e0",
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  button: {
    padding: "10px 16px",
    background: "#2196f3",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    height: "fit-content",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
    transition: "all 0.2s",
  },
};