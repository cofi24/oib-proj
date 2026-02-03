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
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#3c3a3a",
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
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  select: {
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #d1d5db",
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
  line: {
    fontSize: 14,
    marginBottom: 4,
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
