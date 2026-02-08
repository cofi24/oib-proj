import React from "react";

type Props = {
  perfumeType: string;
  setPerfumeType: (v: string) => void;
  perfumeName: string;
  setPerfumeName: (v: string) => void;

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
  perfumeName,
  setPerfumeName,
  bottleCount,
  setBottleCount,
  bottleVolumeMl,
  setBottleVolumeMl,
  error,
  disabled,
  onStart,
}) => {
  const isValid = !disabled && perfumeType.trim() && bottleCount > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        🧴 Prerada u Parfeme
      </h3>
            <div style={styles.inputGroup}>
          <input
            value={perfumeName}
            onChange={e => setPerfumeName(e.target.value)}
            placeholder="Naziv parfema (npr. Lavender Dream)"
            autoComplete="off"
            style={styles.input}
          />
      </div>
      <div style={styles.inputGroup}>
        <input
          value={perfumeType}
          onChange={e => setPerfumeType(e.target.value)}
          placeholder="Tip biljke (npr. Lavanda)"
          autoComplete="off"
          style={styles.input}
        />
      </div>

      <div style={styles.controls}>
        <input
          type="number"
          min={1}
          value={bottleCount}
          onChange={e => setBottleCount(Number(e.target.value))}
          placeholder="Broj boca"
          style={styles.input}
        />

        <select
          value={bottleVolumeMl}
          onChange={e =>
            setBottleVolumeMl(Number(e.target.value) as 150 | 250)
          }
          style={styles.select}
        >
          <option value={150}>150 ml</option>
          <option value={250}>250 ml</option>
        </select>

        <button
          onClick={onStart}
          disabled={!isValid}
          style={{
            ...styles.button,
            background: isValid ? '#10b981' : '#475569',
            cursor: isValid ? 'pointer' : 'not-allowed',
            boxShadow: isValid ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          ✨ Započni
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, #132f4c 0%, #0d2238 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    marginBottom: 28,
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 28px 0',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#0a1929',
    color: '#ffffff',
  },
  controls: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: 12,
  },
  select: {
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    fontSize: 15,
    outline: 'none',
    cursor: 'pointer',
    background: '#0a1929',
    color: '#ffffff',
  },
  button: {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    color: '#ffffff',
    fontWeight: 700,
    transition: 'all 0.2s',
    fontSize: 15,
    whiteSpace: 'nowrap',
  },
  error: {
    marginTop: 16,
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    color: '#fecaca',
    fontSize: 14,
    fontWeight: 600,
  },
};