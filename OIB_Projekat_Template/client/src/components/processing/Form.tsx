import React from "react";

type Props = {
  perfumeType: string;
  setPerfumeType: (v: string) => void;
  bottleCount: number;
  setBottleCount: (v: number) => void;
  bottleVolumeMl: 150 | 250;
  setBottleVolumeMl: (v: 150 | 250) => void;
  error: string | null;
  disabled: boolean;
  onStart: () => void;
};

export const Form: React.FC<Props> = ({
  perfumeType,
  setPerfumeType,
  bottleCount,
  setBottleCount,
  bottleVolumeMl,
  setBottleVolumeMl,
  error,
  disabled,
  onStart,
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
        🧴 Prerada u Parfeme
      </h3>

      <div style={{
        marginBottom: '20px'
      }}>
        <input
          value={perfumeType}
          onChange={e => setPerfumeType(e.target.value)}
          placeholder="Tip parfema (npr. Lavanda)"
          autoComplete="off"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '12px',
        marginBottom: error ? '16px' : '0'
      }}>
        <input
          type="number"
          min={1}
          value={bottleCount}
          onChange={e => setBottleCount(Number(e.target.value))}
          placeholder="Broj boca"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            outline: 'none'
          }}
        />

        <select
          value={bottleVolumeMl}
          onChange={e =>
            setBottleVolumeMl(Number(e.target.value) as 150 | 250)
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
          <option value={150}>150 ml</option>
          <option value={250}>250 ml</option>
        </select>

        <button
          onClick={onStart}
          disabled={disabled || !perfumeType.trim() || bottleCount <= 0}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: (!disabled && perfumeType.trim() && bottleCount > 0) ? '#10b981' : '#94a3b8',
            color: 'white',
            fontWeight: '600',
            cursor: (!disabled && perfumeType.trim() && bottleCount > 0) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          ✨ Započni
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#fee2e2',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};