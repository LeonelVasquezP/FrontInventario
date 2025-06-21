import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Proveedor {
  id: number;
  nombre: string;
  rtn: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
}

interface DetalleRecibo {
  productoId: number;
  cantidad: number;
}

interface Recibo {
  id?: number;
  numero: string;
  proveedorId: number;
  fecha: string;
  estado: string;
  observaciones: string;
  productos: DetalleRecibo[];
}

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: "Proveedor A", rtn: "0801199901234" },
  { id: 2, nombre: "Proveedor B", rtn: "0801200105678" },
];

const productosFake: Producto[] = [
  { id: 1, nombre: "Router", codigo: "PR-1001", precio: 1200 },
  { id: 2, nombre: "Switch", codigo: "PR-1002", precio: 3000 },
];

const recibosFake: Recibo[] = [
  {
    id: 1,
    numero: "REC-0001",
    proveedorId: 1,
    fecha: "2025-06-18",
    estado: "Recibido",
    observaciones: "Entrega parcial",
    productos: [
      { productoId: 1, cantidad: 1 },
      { productoId: 2, cantidad: 2 },
    ],
  },
];

const VerRecibos: React.FC = () => {
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [editRecibo, setEditRecibo] = useState<Recibo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  useEffect(() => {
    setRecibos(recibosFake);
  }, []);

  const abrirModal = (recibo: Recibo) => {
    setEditRecibo(recibo);
    setShowModal(true);
  };

  const eliminarRecibo = (id?: number) => {
    if (!id) return;
    if (!window.confirm("¿Eliminar este recibo?")) return;
    setRecibos(prev => prev.filter(r => r.id !== id));
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editRecibo) return;
    const { name, value } = e.target;
    setEditRecibo({ ...editRecibo, [name]: value });
  };

  const actualizarFecha = (date: Date | null) => {
    if (editRecibo && date) {
      setEditRecibo({ ...editRecibo, fecha: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || !editRecibo) return;
    const yaExiste = editRecibo.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Producto ya agregado");
    setEditRecibo({
      ...editRecibo,
      productos: [...editRecibo.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (!editRecibo) return;
    const nuevos = [...editRecibo.productos];
    nuevos[index].cantidad = cantidad;
    setEditRecibo({ ...editRecibo, productos: nuevos });
  };

  const eliminarProducto = (productoId: number) => {
    if (!editRecibo) return;
    const nuevos = editRecibo.productos.filter(p => p.productoId !== productoId);
    setEditRecibo({ ...editRecibo, productos: nuevos });
  };

  const calcularTotal = () => {
    return editRecibo?.productos.reduce((sum, p) => {
      const prod = productosFake.find(pr => pr.id === p.productoId);
      return sum + (prod ? prod.precio * p.cantidad : 0);
    }, 0) || 0;
  };

  const guardarCambios = () => {
    if (!editRecibo) return;
    setRecibos(prev => prev.map(r => (r.id === editRecibo.id ? editRecibo : r)));
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Recibos</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recibos.length === 0 ? (
            <tr><td colSpan={5} className="text-center">No hay recibos.</td></tr>
          ) : (
            recibos.map(r => (
              <tr key={r.id}>
                <td>{r.numero}</td>
                <td>{proveedoresFake.find(p => p.id === r.proveedorId)?.nombre}</td>
                <td>{r.fecha}</td>
                <td>{r.estado}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => abrirModal(r)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarRecibo(r.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

<Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Recibo" size="xl">
  {editRecibo && (
    <div className="container-fluid">
      {/* Información del recibo */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title fw-bold text-primary mb-3">
            <i className="bi bi-truck me-2"></i> Información General del Recibo
          </h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Número</label>
              <input type="text" className="form-control" value={editRecibo.numero} readOnly />
            </div>
            <div className="col-md-8 mb-3">
              <label className="form-label">Proveedor</label>
              <input
                type="text"
                className="form-control"
                value={proveedoresFake.find(p => p.id === editRecibo.proveedorId)?.nombre || ""}
                readOnly
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha</label>
              <DatePicker
                selected={editRecibo.fecha ? new Date(editRecibo.fecha) : null}
                onChange={actualizarFecha}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={editRecibo.estado}
                onChange={actualizarCampo}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Recibido">Recibido</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <label className="form-label">Observaciones</label>
          <input
            type="text"
            name="observaciones"
            className="form-control"
            value={editRecibo.observaciones}
            onChange={actualizarCampo}
          />
        </div>
      </div>

      {/* Productos recibidos */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title fw-bold text-success mb-3">
            <i className="bi bi-boxes me-2"></i> Productos Recibidos
          </h5>

          <div className="row g-2 mb-3 align-items-end">
            <div className="col-md-9">
              <input
                type="text"
                list="productosList"
                className="form-control"
                placeholder="Buscar producto..."
                value={textoProducto}
                onChange={(e) => {
                  const valor = e.target.value;
                  setTextoProducto(valor);
                  const prod = productosFake.find(p => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase());
                  setProductoSeleccionado(prod ? prod.id : 0);
                }}
              />
              <datalist id="productosList">
                {productosFake.map(p => (
                  <option key={p.id} value={`${p.nombre} - ${p.codigo}`} />
                ))}
              </datalist>
            </div>
            <div className="col-md-3 d-grid">
              <button className="btn btn-outline-primary" onClick={agregarProducto}>
                <i className="bi bi-plus-circle me-1"></i> Agregar Producto
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {editRecibo.productos.map((item, index) => {
                  const prod = productosFake.find(p => p.id === item.productoId);
                  const subtotal = prod ? prod.precio * item.cantidad : 0;
                  return (
                    <tr key={index}>
                      <td>{prod?.nombre}</td>
                      <td>L. {prod?.precio}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                        />
                      </td>
                      <td>L. {subtotal}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(item.productoId)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <h5 className="text-dark">Total: <strong>L. {calcularTotal()}</strong></h5>
            <button className="btn btn-success mt-3 px-4" onClick={guardarCambios}>
              <i className="bi bi-check-circle me-2"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</Modal>




    </div>
  );
};

export default VerRecibos;
