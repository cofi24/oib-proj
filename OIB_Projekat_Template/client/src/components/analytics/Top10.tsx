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
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>{title}</div>
        <div style={{
          fontSize: '14px',
          color: '#666',
          backgroundColor: '#f5f5f5',
          padding: '4px 12px',
          borderRadius: '16px'
        }}>{data?.length || 0} stavki</div>
      </div>

      {!data || data.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#999',
          fontSize: '15px'
        }}>Nema podataka.</div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {data.map((x, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fafafa';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: i < 3 ? '#e63946' : '#666',
                minWidth: '40px',
                textAlign: 'center'
              }}>#{i + 1}</div>
              <div style={{
                flex: 1
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#2d2d2d',
                  marginBottom: '6px'
                }}>{x.naziv}</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <span style={{ fontWeight: '500' }}>{x.prodaja} kom</span>
                  <span style={{ color: '#ccc' }}>•</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>{(x.prihod)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};