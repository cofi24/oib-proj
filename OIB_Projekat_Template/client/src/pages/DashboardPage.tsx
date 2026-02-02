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

  const roleSrpski: Record<string, string> = {
    ADMIN: "Administrator",
    SALES_MANAGER: "Menadžer prodaje",
    SELLER: "Prodavac",
  };

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
      description: "Pokretanje simulacija , pregled efikasnosti i izveštaja o performansama u PDF.",
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
  ];

  const filteredCards = dashboardCards.filter((card) =>
    card.roles.includes(user?.role || "")
  );

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <DashboardNavbar  />

      <div style={{ padding: 30 }}>
        <div className="dashboard-header">
          <div >
            <h1>Dobrodošli, {user?.username}!</h1>
            <div className="dashboard-subtitle">
              {user?.role ? roleSrpski[user.role] ?? user.role : "Korisnik"}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {filteredCards.length === 0 ? (
            <div className="dashboard-empty">
              
              <div className="dashboard-empty-text">
                Nema  modula 
              </div>
            </div>
          ) : (
            filteredCards.map((card) => (
              <div key={card.id} className="dashboard-card">
                <div ></div>

                <div >
                  <div >{card.title}</div>
                  <div >{card.description}</div>
                </div>

                <button
                  
                  onClick={() => handleNavigate(card.path)}
                >
                  
                  Otvori stranicu
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};