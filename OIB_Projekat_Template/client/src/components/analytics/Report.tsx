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
    border: "1px solid #26436f",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#585151",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    gap: 8,
  },
  input: {
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #2f5a9a",
    fontSize: 14,
  },
  select: {
    padding: "6px 15px",
    borderRadius: 4,
    border: "1px solid #491ea7",
    fontSize: 14,
  },
  empty: {
    padding: 20,
    textAlign: "center",
    color: "#6b7280",
  },
  item: {
    display: "flex",
    gap: 16,
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  meta: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    height: "fit-content",
  },
};
