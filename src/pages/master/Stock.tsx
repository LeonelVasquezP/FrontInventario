import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Stock {
  id?: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
}

const Stock: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarStock = () => {
    fetch('http://localhost:3001/api/stock')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el stock');
        return res.json();
      })
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error desconocido');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarStock();
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
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
