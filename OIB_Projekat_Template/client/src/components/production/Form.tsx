import React from "react";

type ProductionPlant = {
  id: number;
  plantType: string;
  oilStrength: number;
  status: string;
};

type Props = {
  plants: ProductionPlant[];
  plantType: string;
  setPlantType: (v: string) => void;
  harvestType: string;
  setHarvestType: (v: string) => void;
  harvestQty: number;
  setHarvestQty: (v: number) => void;
  adjustPlantId: number | "";
  setAdjustPlantId: (v: number | "") => void;
  adjustPercent: number;
  setAdjustPercent: (v: number) => void;
  onPlant: () => void;
  onHarvest: () => void;
  onAdjustOil: () => void;
};
export const Form: React.FC<Props> = ({
  plants,
  plantType,
  setPlantType,
  harvestType,
  setHarvestType,
  harvestQty,
  setHarvestQty,
  adjustPlantId,
  setAdjustPlantId,
  adjustPercent,
  setAdjustPercent,
  onPlant,
  onHarvest,
  onAdjustOil,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🌿 Upravljanje Plantažom</h3>
      </div>

      <div style={styles.formBody}>
        {/* Zasadi sekcija */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Zasadi novu biljku</label>
          <div style={styles.row}>
            <input
              value={plantType}
              onChange={(e) => setPlantType(e.target.value)}
              placeholder="Tip biljke (npr. Lavanda)"
              style={styles.input}
            />
            <button
              onClick={onPlant}
              disabled={!plantType.trim()}
              style={{
                ...styles.btnPlant,
                opacity: plantType.trim() ? 1 : 0.5,
                cursor: plantType.trim() ? "pointer" : "not-allowed",
              }}
            >
              <span style={styles.btnIcon}>🌱</span>
              Zasadi
            </button>
          </div>
        </div>

        {/* Promeni jačinu sekcija */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Podesi jačinu ulja</label>
          <div style={styles.row}>
            <select
              value={adjustPlantId}
              onChange={(e) =>
                setAdjustPlantId(e.target.value ? Number(e.target.value) : "")
              }
              style={styles.select}
            >
              <option value="">Izaberi biljku</option>
              {plants
                .filter((p) => p.status === "PLANTED")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} – {p.plantType}
                  </option>
                ))}
            </select>

            <input
              type="number"
              min={0}
              max={100}
              value={adjustPercent}
              onChange={(e) => setAdjustPercent(Number(e.target.value))}
              placeholder="Procenat"
              style={{ ...styles.input, maxWidth: 120 }}
            />

            <button
              onClick={onAdjustOil}
              disabled={!adjustPlantId || adjustPercent < 0}
              style={{
                ...styles.btnAdjust,
                opacity: adjustPlantId && adjustPercent >= 0 ? 1 : 0.5,
                cursor: adjustPlantId && adjustPercent >= 0 ? "pointer" : "not-allowed",
              }}
            >
              <span style={styles.btnIcon}>💧</span>
              Promeni
            </button>
          </div>
        </div>

        {/* Berba sekcija */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Uberi useve</label>
          <div style={styles.row}>
            <select
              value={harvestType}
              onChange={(e) => setHarvestType(e.target.value)}
              style={styles.select}
            >
              <option value="">Izaberi biljku za berbu</option>
              {plants
                .filter((p) => p.status === "PLANTED")
                .map((p) => (
                  <option key={p.id} value={p.plantType}>
                    #{p.id} – {p.plantType}
                  </option>
                ))}
            </select>

            <input
              type="number"
              min={1}
              value={harvestQty}
              onChange={(e) => setHarvestQty(Number(e.target.value))}
              placeholder="Količina"
              style={{ ...styles.input, maxWidth: 120 }}
            />

            <button
              onClick={onHarvest}
              disabled={!harvestType.trim() || harvestQty <= 0}
              style={{
                ...styles.btnHarvest,
                opacity: harvestType.trim() && harvestQty > 0 ? 1 : 0.5,
                cursor: harvestType.trim() && harvestQty > 0 ? "pointer" : "not-allowed",
              }}
            >
              <span style={styles.btnIcon}>🌾</span>
              Uberi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#132f4c",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
    marginBottom: 24,
  },
  header: {
    padding: "20px 24px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
  },
  formBody: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#90caf9",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: 200,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s ease",
  },
  select: {
    flex: 1,
    minWidth: 200,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnPlant: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
    whiteSpace: "nowrap",
  },
  btnAdjust: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
    whiteSpace: "nowrap",
  },
  btnHarvest: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
    whiteSpace: "nowrap",
  },
  btnIcon: {
    fontSize: 16,
  },
};