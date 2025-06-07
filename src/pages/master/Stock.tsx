import React, { useEffect, useState } from 'react';

interface Stock {
  id: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
}

// Datos simulados de stock
const stockFake: Stock[] = [
  { id: 1, producto_id: 1, nombre_producto: 'Producto A', cantidad: 100 },
  { id: 2, producto_id: 2, nombre_producto: 'Producto B', cantidad: 50 },
  { id: 3, producto_id: 3, nombre_producto: 'Producto C', cantidad: 20 },
];

const Stock: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simular carga datos
    setTimeout(() => {
      setStocks(stockFake);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) return <p>Cargando stock...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Inventario (Stock)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad en Stock</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre_producto}</td>
              <td>{item.cantidad}</td>
            </tr>
          ))}
          {stocks.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                No hay stock disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
