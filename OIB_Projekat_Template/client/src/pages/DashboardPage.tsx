import React from "react";
import { useAuth } from "../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import { DashboardNavbar } from "../components/dashboard/navbar/Navbar";

type DashboardCard = {
  id: string;
  title: string;
  description: string;
  path: string;
  roles: string[];
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

 
  const dashboardCards: DashboardCard[] = [
    {
      id: "production",
      title: "Proizvodnja",
      description: "Upravljanje biljkama, sadnja, prilagođavanje jačine i berba.",
      path: "/production",
      roles: ["SELLER", "SALES_MANAGER"],
    },
    {
      id: "processing",
      title: "Prerada parfema",
      description: "Pokretanje prerade biljaka u parfeme i pregled batch-eva.",
      path: "/processing",
      roles: ["SELLER", "SALES_MANAGER"],
    },
    {
      id: "storage",
      title: "Skladištenje",
      description: "Upravljanje skladištima i slanje paketa.",
      path: "/storage",
      roles: ["SELLER", "SALES_MANAGER"],
    },
    {
      id: "sales",
      title: "Prodaja",
      description: "Pregled kataloga i izvršavanje prodaje.",
      path: "/sales",
      roles: ["SELLER", "SALES_MANAGER"],
    },
    {
      id: "analytics",
      title: "Analiza prodaje",
      description: "Pregled summary statistika, trend prodaje, top 10 parfema i izvoz izveštaja u PDF.",
      path: "/analytics",
      roles: ["ADMIN"],
    },
    {
      id: "performance",
      title: "Analiza performansi",
      description: "Pokretanje simulacija, pregled efikasnosti i izveštaja o performansama u PDF.",
      path: "/performance",
      roles: ["ADMIN"],
    },
    {
      id: "audit",
      title: "Admin panel",
      description: "Pregled sistemskih događaja i logova.",
      path: "/audit-logs",
      roles: ["ADMIN"],
    },
    {
      id: "users",
      title: "Korisnici",
      description: "Upravljanje korisnicima, uloge i osnovni podaci profila.",
      path: "/users",
      roles: ["ADMIN"],
    },
  ];

  const filteredCards = dashboardCards.filter((card) =>
    card.roles.includes(user?.role || "")
  );

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1e',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <DashboardNavbar />

      <div style={{ 
        padding: '48px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          marginBottom: '48px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#ffffff'
            }}>Dobrodošli, {user?.username}!</h1>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              {user?.role ?  user.role : "Korisnik"}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {filteredCards.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '80px 20px',
              backgroundColor: '#1a1a2e',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Nema dostupnih modula
              </div>
            </div>
          ) : (
            filteredCards.map((card) => (
              <div 
                key={card.id} 
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '12px',
                  padding: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#ffffff'
                  }}>{card.title}</div>
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>{card.description}</div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onClick={() => handleNavigate(card.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Otvori stranicu
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};