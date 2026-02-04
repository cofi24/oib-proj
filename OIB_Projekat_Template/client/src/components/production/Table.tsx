import React from "react";


export const Table: React.FC<{ plants: ProductionPlant[] }> = ({
  plants,
}) => {
  return (
    <div className="card">
      <h3>Biljke</h3>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tip</th>
              <th>Ulje</th>
              <th>Status</th>
              <th>Vreme proizvodnje</th>
            </tr>
          </thead>
          <tbody>
            {plants.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.plantType}</td>
                <td
                  style={{
                    color: p.oilStrength > 4 ? "red" : "inherit",
                    fontWeight: p.oilStrength > 4 ? 700 : "normal",
                  }}
                >
                  {p.oilStrength}
                </td>
                <td>{plantStatusSR[p.status] ?? p.status}</td>
                <td>
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



type ProductionPlant = {
  id: number;
  plantType: string;
  oilStrength: number;
  status: string;
  createdAt: string | Date;
};

const plantStatusSR: Record<string, string> = {
  PLANTED: "POSAĐENA",
  HARVESTED: "UBRANA",
};

