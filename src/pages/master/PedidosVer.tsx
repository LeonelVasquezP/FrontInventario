import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import "../../assets/EstadoBadge.css";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

interface Producto {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Pedido {
  id?: number;
  productoId: number;
  proveedorId: number;
  cantidad: number;
  fechaPedido?: string;
  estado: "Pendiente" | "Enviado" | "Recibido";
}

const productosFake: Producto[] = [
  { id: 1, nombre: "Producto A" },
  { id: 2, nombre: "Producto B" },
];

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: "Proveedor X" },
  { id: 2, nombre: "Proveedor Y" },
];

const pedidosFake: Pedido[] = [
  {
    id: 1,
    productoId: 1,
    proveedorId: 1,
    cantidad: 50,
    fechaPedido: "2025-06-01",
    estado: "Pendiente",
  },
  {
    id: 2,
    productoId: 2,
    proveedorId: 2,
    cantidad: 100,
    fechaPedido: "2025-06-02",
    estado: "Enviado",
  },
];

const PedidosVer: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Pedido>({
    productoId: productosFake[0]?.id || 0,
    proveedorId: proveedoresFake[0]?.id || 0,
    cantidad: 1,
    estado: "Pendiente",
  });
  const [filtroProveedor, setFiltroProveedor] = useState<number>(0);
  const [filtroFecha, setFiltroFecha] = useState<Date | null>(null);

  useEffect(() => {
    setPedidos(pedidosFake);
  }, []);

  const obtenerNombreProducto = (id: number) => productosFake.find(p => p.id === id)?.nombre || 'Desconocido';
  const obtenerNombreProveedor = (id: number) => proveedoresFake.find(p => p.id === id)?.nombre || 'Desconocido';

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroProveedor !== 0 && pedido.proveedorId !== filtroProveedor) return false;
    if (filtroFecha) {
      const pedidoDate = new Date(pedido.fechaPedido!);
      if (
        pedidoDate.getFullYear() !== filtroFecha.getFullYear() ||
        pedidoDate.getMonth() !== filtroFecha.getMonth() ||
        pedidoDate.getDate() !== filtroFecha.getDate()
      ) return false;
    }
    return true;
  });

  const handleDelete = (id: number) => {
    if (!window.confirm("¿Eliminar este pedido?")) return;
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (pedido: Pedido) => {
    setEditId(pedido.id || null);
    setForm({
      productoId: pedido.productoId || productosFake[0]?.id || 0,
      proveedorId: pedido.proveedorId || proveedoresFake[0]?.id || 0,
      cantidad: pedido.cantidad || 1,
      estado: pedido.estado || "Pendiente",
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'cantidad' ? Number(value) : value });
  };

  const handleSubmit = () => {
    if (editId !== null) {
      setPedidos(prev => prev.map(p => (p.id === editId ? { ...form, id: editId } : p)));
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-truck me-2"></i>Ver Pedidos
      </h3>

      {/* FILTROS */}
      <div className="row mb-4 g-3 align-items-end">
        <div className="col-md-6 col-lg-4">
          <label htmlFor="filtroProveedor" className="form-label">
            Filtrar por proveedor
          </label>
          <select
            id="filtroProveedor"
            className="form-select"
            value={filtroProveedor}
            onChange={(e) => setFiltroProveedor(Number(e.target.value))}
          >
            <option value={0}>Todos los proveedores</option>
            {proveedoresFake.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 col-lg-4">
          <label className="form-label">Filtrar por fecha de pedido</label>
          <DatePicker
            selected={filtroFecha}
            onChange={(date) => setFiltroFecha(date)}
            className="form-control"
            placeholderText="Selecciona una fecha"
            isClearable
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="col-md-12 col-lg-4 d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFiltroProveedor(0);
              setFiltroFecha(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* TABLA DE PEDIDOS */}
      <table className="table table-hover align-middle shadow-sm border rounded bg-white">
        <thead className="table-light">
          <tr>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Fecha Pedido</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>{obtenerNombreProducto(pedido.productoId)}</td>
              <td>{obtenerNombreProveedor(pedido.proveedorId)}</td>
              <td>{pedido.cantidad}</td>
              <td>{pedido.fechaPedido}</td>
              <td>
                <span
                  className={`badge-pill 
                    ${pedido.estado === "Pendiente" ? "estado-pendiente" : ""}
                    ${pedido.estado === "Enviado" ? "estado-enviado" : ""}
                    ${pedido.estado === "Recibido" ? "estado-recibido" : ""}
                  `}
                >
                  {pedido.estado}
                </span>
              </td>
              <td className="text-center">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    style={{ marginRight: "10px" }}
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={() => handleEdit(pedido)}
                  >
                    <i className="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={() => handleDelete(pedido.id!)}
                  >
                    <i className="bi bi-trash me-1"></i>Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {pedidosFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-3">
                No hay pedidos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de formulario con tamaño xl para más ancho y scroll */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Editar Pedido"
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="productoId" className="form-label fw-semibold">
                Producto
              </label>
              <select
                id="productoId"
                name="productoId"
                className="form-select"
                value={form.productoId}
                onChange={handleChange}
                required
              >
                <option value={0}>Selecciona un producto</option>
                {productosFake.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="proveedorId" className="form-label fw-semibold">
                Proveedor
              </label>
              <select
                id="proveedorId"
                name="proveedorId"
                className="form-select"
                value={form.proveedorId}
                onChange={handleChange}
                required
              >
                <option value={0}>Selecciona un proveedor</option>
                {proveedoresFake.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="cantidad" className="form-label fw-semibold">
                Cantidad
              </label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                className="form-control"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                min={1}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="estado" className="form-label fw-semibold">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                className="form-select"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Enviado">Enviado</option>
                <option value="Recibido">Recibido</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-success px-4">
              <i className="bi bi-pencil-square me-2"></i>Actualizar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PedidosVer;
