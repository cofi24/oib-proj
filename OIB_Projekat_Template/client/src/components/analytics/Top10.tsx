import React from "react";

type Row = {
  naziv: string;
  prodaja: number;
  prihod: number;
};

type Props = {
  title: string;
  data: Row[];
};

export const Top10: React.FC<Props> = ({ title, data }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>{title}</div>
        <div style={styles.badge}>{data?.length || 0} stavki</div>
      </div>

      {!data || data.length === 0 ? (
        <div style={styles.noData}>Nema podataka.</div>
      ) : (
        <div style={styles.list}>
          {data.map((x, i) => (
            <div
              key={i}
              style={{
                ...styles.item,
                ...(hoveredIndex === i ? styles.itemHover : {}),
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={{
                ...styles.rank,
                color: i < 3 ? '#10b981' : '#90caf9'
              }}>
                #{i + 1}
              </div>
              <div style={styles.content}>
                <div style={styles.itemName}>{x.naziv}</div>
                <div style={styles.itemStats}>
                  <span style={styles.quantity}>{x.prodaja} kom</span>
                  <span style={styles.separator}>•</span>
                  <span style={styles.revenue}>{x.prihod.toLocaleString("sr-RS")} RSD</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    maxHeight: "420px",
    overflow: "auto",
     scrollbarWidth: "thin",
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
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },
  badge: {
    fontSize: 12,
    color: "#90caf9",
    background: "rgba(33, 150, 243, 0.15)",
    padding: "4px 12px",
    borderRadius: 16,
    fontWeight: 600,
  },
  noData: {
    textAlign: "center",
    padding: 40,
    color: "#64b5f6",
    fontSize: 15,
    background: "#0a1929",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    background: "#0a1929",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 16,
    background: "#132f4c",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  itemHover: {
    background: "#1e4976",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
  },
  rank: {
    fontSize: 18,
    fontWeight: 700,
    minWidth: 40,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: 6,
  },
  itemStats: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
  },
  quantity: {
    fontWeight: 600,
    color: "#90caf9",
  },
  separator: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  revenue: {
    color: "#10b981",
    fontWeight: 700,
    fontFamily: "monospace",
  },
};