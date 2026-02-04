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
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: 'white',
        marginBottom: '28px',
        fontSize: '24px',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        🌿 Upravljanje Plantažom
      </h3>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <input
          value={plantType}
          onChange={e => setPlantType(e.target.value)}
          placeholder="Tip biljke (npr. Lavanda)"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none'
          }}
        />
        <button
          onClick={onPlant}
          disabled={!plantType.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: plantType.trim() ? '#10b981' : '#94a3b8',
            color: 'white',
            fontWeight: '600',
            cursor: plantType.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            fontSize: '15px'
          }}
        >
          🌱 Zasadi
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <select
          value={adjustPlantId}
          onChange={e =>
            setAdjustPlantId(e.target.value ? Number(e.target.value) : "")
          }
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Izaberi biljku</option>
          {plants
            .filter(p => p.status === "PLANTED")
            .map(p => (
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
          onChange={e => setAdjustPercent(Number(e.target.value))}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none'
          }}
        />

        <button
          onClick={onAdjustOil}
          disabled={!adjustPlantId || adjustPercent < 0}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: adjustPlantId && adjustPercent >= 0 ? '#3b82f6' : '#94a3b8',
            color: 'white',
            fontWeight: '600',
            cursor: adjustPlantId && adjustPercent >= 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          💧 Promeni jačinu
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        gap: '12px'
      }}>
        <input
          value={harvestType}
          onChange={e => setHarvestType(e.target.value)}
          placeholder="Tip za berbu"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none'
          }}
        />

        <input
          type="number"
          min={1}
          value={harvestQty}
          onChange={e => setHarvestQty(Number(e.target.value))}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none'
          }}
        />

        <button
          onClick={onHarvest}
          disabled={!harvestType.trim() || harvestQty <= 0}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: harvestType.trim() && harvestQty > 0 ? '#f59e0b' : '#94a3b8',
            color: 'white',
            fontWeight: '600',
            cursor: harvestType.trim() && harvestQty > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          🌾 Uberi
        </button>
      </div>
    </div>
  );
};