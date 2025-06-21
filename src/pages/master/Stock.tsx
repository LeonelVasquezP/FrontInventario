import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';
import '../../assets/EstadoBadge.css';
import Modal from '../../components/Modal/Modal';

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
  const [editStock, setEditStock] = useState<Stock | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  useEffect(() => {
    setStocks(mockStocks);
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este stock?')) return;
    setStocks(stocks.filter(p => p.id !== id));
  };

  const abrirModalEdicion = (stock: Stock) => {
    setEditStock(stock);
    setShowModal(true);
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editStock) return;
    const { name, value } = e.target;
    setEditStock({
      ...editStock,
      [name]: ['cantidad', 'minimo'].includes(name) ? Number(value) : value,
    });
  };

  const guardarCambios = () => {
    if (!editStock) return;
    setStocks(prev => prev.map(s => (s.id === editStock.id ? editStock : s)));
    setShowModal(false);
  };

  const stocksFiltrados = stocks.filter(s => {
    const coincideBusqueda =
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'todos' ||
      (filtroEstado === 'ok' && s.cantidad >= s.minimo) ||
      (filtroEstado === 'bajo' && s.cantidad < s.minimo);

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="stocks-wrapper p-3">
      <h2 className="mb-4">Gestión de Stocks</h2>

      {/* Filtros */}
      <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="ok">OK</option>
            <option value="bajo">Abastecer</option>
          </select>
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setBusqueda('');
              setFiltroEstado('todos');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

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
            {stocksFiltrados.map(stock => (
              <tr key={stock.id}>
                <td>{stock.nombre}</td>
                <td>{stock.descripcion}</td>
                <td>{stock.cantidad}</td>
                <td>{stock.minimo}</td>
                <td>
                  {stock.cantidad < stock.minimo ? (
                    <span className="badge-pill estado-abastecer">🛑 Abastecer</span>
                  ) : (
                    <span className="badge-pill estado-ok">✅ OK</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => abrirModalEdicion(stock)}
                      title="Editar"
                      style={{ minWidth: "70px", marginRight: "10px" }}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(stock.id!)}
                      title="Eliminar"
                      style={{ minWidth: "70px" }}
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Stock">
        {editStock && (
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={editStock.nombre}
                  onChange={actualizarCampo}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={editStock.descripcion}
                  onChange={actualizarCampo}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  name="cantidad"
                  value={editStock.cantidad}
                  onChange={actualizarCampo}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mínimo</label>
                <input
                  type="number"
                  className="form-control"
                  name="minimo"
                  value={editStock.minimo}
                  onChange={actualizarCampo}
                />
              </div>
            </div>

            <div className="text-end">
              <button className="btn btn-success px-4" onClick={guardarCambios}>
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .stocks-wrapper h2 {
          font-weight: 600;
        }
        .table td, .table th {
          vertical-align: middle;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Stocks;
