import React,{useMemo,useState} from "react";
import { ReceiptDTO } from "../../models/analytics/ReceiptDTO";

type Props = {
  receipts: ReceiptDTO[];
  onExportPdf?: (id: number) => void;
};

type SortKey =
  | "createdAtDesc"
  | "createdAtAsc"
  | "iznosDesc"
  | "iznosAsc";

const formatRSD = (v: number) =>
  Number.isFinite(v) ? v.toLocaleString("sr-RS") + " RSD" : "0 RSD";

export const Receipts: React.FC<Props> = ({ receipts, onExportPdf }) => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("createdAtDesc");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const list = receipts.filter((r) => {
      if (!qq) return true;
      return (
        r.brojRacuna.toLowerCase().includes(qq) ||
        r.tipProdaje.toLowerCase().includes(qq) ||
        r.nacinPlacanja.toLowerCase().includes(qq) ||
        String(r.id).includes(qq)
      );
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "createdAtAsc":
          return a.createdAt.localeCompare(b.createdAt);
        case "iznosDesc":
          return (b.iznosZaNaplatu ?? 0) - (a.iznosZaNaplatu ?? 0);
        case "iznosAsc":
          return (a.iznosZaNaplatu ?? 0) - (b.iznosZaNaplatu ?? 0);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [receipts, q, sort]);

  return (
    <div style={styles.panel}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>
          Računi ({receipts.length})
        </div>

        <div style={styles.controls}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraga (broj, tip, plaćanje, ID)"
            style={styles.input}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={styles.select}
          >
            <option value="createdAtDesc">Najnovije</option>
            <option value="createdAtAsc">Najstarije</option>
            <option value="iznosDesc">Iznos ↓</option>
            <option value="iznosAsc">Iznos ↑</option>
          </select>
        </div>
      </div>

      {/* LIST */}
      <div>
        {filtered.length === 0 ? (
          <div style={styles.empty}>Nema rezultata.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} style={styles.item}>
              <div style={{ flex: 1 }}>
                <div style={styles.itemTitle}>
                  Račun #{r.brojRacuna}
                </div>

                <div style={styles.meta}>
                  ID: {r.id} •{" "}
                  {new Date(r.createdAt).toLocaleString("sr-RS")}
                </div>

                <div style={styles.line}>
                  {r.tipProdaje} • {r.nacinPlacanja}
                </div>

                <div style={styles.summary}>
                  Stavki: <strong>{r.ukupnoStavki}</strong> •
                  Količina: <strong>{r.ukupnaKolicina}</strong> •
                  Iznos: <strong>{formatRSD(r.iznosZaNaplatu)}</strong>
                </div>
              </div>

              {onExportPdf && (
                <button
                  onClick={() => onExportPdf(r.id)}
                  style={styles.button}
                >
                  Izvezi PDF
                </button>
              )}
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