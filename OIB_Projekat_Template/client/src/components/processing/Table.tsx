import React from "react";
import { AmountDTO } from "../../models/processing/AmountDTO";




export const Table: React.FC<{
  amount: AmountDTO[];
}> = ({ amount }) => {
  return (
    <div className="card">
      <h3> Prerada</h3>

      {amount.length === 0 ? (
        <div className="empty-state">
          Nema  prerade.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Parfem</th>
                <th>Bočice</th>
                <th>Zapremina</th>
                <th>Biljke</th>
              </tr>
            </thead>
            <tbody>
              {amount.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.perfumeType}</td>
                  <td>{b.bottleCount}</td>
                  <td>{b.bottleVolumeMl} ml</td>
                  <td>{b.plantsNeeded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
