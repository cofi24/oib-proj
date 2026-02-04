import React from "react";
import type { ProductResponse } from "../../types/ProductRespones";

type Props = {
  products: ProductResponse[];
  loading: boolean;
  onRefresh: () => void;
};

export const Catalog: React.FC<Props> = ({
  products,
  loading,
  onRefresh,
}) => {
  return (
    <div style={{
      background: "#0f172a",
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      color: "white"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <h3>📦 Katalog proizvoda</h3>
        <button onClick={onRefresh} disabled={loading}>
          🔄 Osveži
        </button>
      </div>

      {loading && <p>Učitavanje...</p>}

      {!loading && products.length === 0 && (
        <p>Nema proizvoda</p>
      )}

      {!loading && products.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Brend</th>
              <th>Cena</th>
              <th>Količina</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.price} RSD</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
