import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Stock {
  id?: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  minimo: number;
}

const mockStocks: Stock[] = [
  { id: 1, nombre: 'Producto A', descripcion: 'Desc A', cantidad: 12, minimo: 10 },
  { id: 2, nombre: 'Producto B', descripcion: 'Desc B', cantidad: 4, minimo: 8 },
  { id: 3, nombre: 'Producto C', descripcion: 'Desc C', cantidad: 20, minimo: 15 },
];

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [form, setForm] = useState<Stock>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    minimo: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setStocks(mockStocks), 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: ['cantidad', 'minimo'].includes(e.target.name)
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setStocks(stocks.map(p => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      const newId = stocks.length > 0 ? Math.max(...stocks.map(p => p.id || 0)) + 1 : 1;
      setStocks([...stocks, { ...form, id: newId }]);
    }
    setForm({ nombre: '', descripcion: '', cantidad: 0, minimo: 0 });
    setEditId(null);
  };

  const handleEdit = (prod: Stock) => {
    setForm(prod);
    setEditId(prod.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este stock?')) return;
    setStocks(stocks.filter(p => p.id !== id));
  };

  return (
    <div className="stocks-wrapper p-3">
      <h2 className="mb-4">Gestión de Stocks</h2>

      <form onSubmit={handleSubmit} className="stock-form card p-4 mb-4 shadow-sm">
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              name="minimo"
              type="number"
              value={form.minimo}
              onChange={handleChange}
              placeholder="Stock Mínimo"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 d-grid mb-3">
            <ActionButton
              label={editId !== null ? 'Actualizar' : 'Agregar'}
              color={editId !== null ? '#ffc107' : '#28a745'}
              onClick={() => {}}
            />
          </div>
        </div>
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <div className="table-responsive">
<table className="table table-hover align-middle shadow-sm border rounded bg-white">
  <thead className="table-light">
    <tr>
      <th>Nombre</th>
      <th>Descripción</th>
      <th>Cantidad</th>
      <th>Mínimo</th>
      <th>Estado</th>
      <th className="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {stocks.map(stock => (
      <tr key={stock.id}>
        <td>{stock.nombre}</td>
        <td>{stock.descripcion}</td>
        <td>{stock.cantidad}</td>
        <td>{stock.minimo}</td>
        <td>
          {stock.cantidad < stock.minimo ? (
            <span className="badge bg-danger">🛑 Abastecer</span>
          ) : (
            <span className="badge bg-success">✅ OK</span>
          )}
        </td>
        <td className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <ActionButton
              label="Editar"
              onClick={() => handleEdit(stock)}
              color="#0d6efd"
            />
            <ActionButton
              label="Eliminar"
              onClick={() => handleDelete(stock.id!)}
              color="#dc3545"
            />
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <style>{`
        .stocks-wrapper h2 {
          font-weight: 600;
        }
        .table td, .table th {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default Stocks;
