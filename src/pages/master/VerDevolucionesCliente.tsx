import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Cliente {
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

interface DetalleDevolucion {
  productoId: number;
  cantidad: number;
}

interface Devolucion {
  id?: number;
  numero: string;
  clienteId: number;
  fecha: string;
  estado: string;
  observaciones: string;
  productos: DetalleDevolucion[];
}

const clientesFake: Cliente[] = [
  { id: 1, nombre: "Cliente A", rtn: "0801199901234" },
  { id: 2, nombre: "Cliente B", rtn: "0801200105678" },
];

const productosFake: Producto[] = [
  { id: 1, nombre: "Router", codigo: "PR-1001", precio: 1200 },
  { id: 2, nombre: "Switch", codigo: "PR-1002", precio: 3000 },
];

const devolucionesFake: Devolucion[] = [
  {
    id: 1,
    numero: "DEV-0001",
    clienteId: 1,
    fecha: "2025-06-18",
    estado: "Procesada",
    observaciones: "Producto defectuoso",
    productos: [
      { productoId: 1, cantidad: 1 },
      { productoId: 2, cantidad: 2 },
    ],
  },
];

const VerDevoluciones: React.FC = () => {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [editDevolucion, setEditDevolucion] = useState<Devolucion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  useEffect(() => {
    setDevoluciones(devolucionesFake);
  }, []);

  const abrirModalEdicion = (devolucion: Devolucion) => {
    setEditDevolucion(devolucion);
    setShowModal(true);
  };

  const eliminarDevolucion = (id?: number) => {
    if (!id) return;
    if (!window.confirm("¿Deseas eliminar esta devolución?")) return;
    setDevoluciones(prev => prev.filter(d => d.id !== id));
  };

  const generarPDF = (numero: string) => {
    alert(`Generar PDF para la devolución: ${numero}`);
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editDevolucion) return;
    const { name, value } = e.target;
    setEditDevolucion({ ...editDevolucion, [name]: value });
  };

  const actualizarFecha = (date: Date | null) => {
    if (editDevolucion && date) {
      setEditDevolucion({ ...editDevolucion, fecha: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || !editDevolucion) return;
    const yaExiste = editDevolucion.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Producto ya agregado");
    setEditDevolucion({
      ...editDevolucion,
      productos: [...editDevolucion.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (!editDevolucion) return;
    const nuevos = [...editDevolucion.productos];
    nuevos[index].cantidad = cantidad;
    setEditDevolucion({ ...editDevolucion, productos: nuevos });
  };

  const eliminarProducto = (productoId: number) => {
    if (!editDevolucion) return;
    const nuevos = editDevolucion.productos.filter(p => p.productoId !== productoId);
    setEditDevolucion({ ...editDevolucion, productos: nuevos });
  };

  const calcularTotal = () => {
    return editDevolucion?.productos.reduce((sum, p) => {
      const prod = productosFake.find(pr => pr.id === p.productoId);
      return sum + (prod ? prod.precio * p.cantidad : 0);
    }, 0) || 0;
  };

  const guardarCambios = () => {
    if (!editDevolucion) return;
    setDevoluciones(prev => prev.map(d => (d.id === editDevolucion.id ? editDevolucion : d)));
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Devoluciones</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {devoluciones.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">No hay devoluciones que coincidan.</td>
            </tr>
          ) : (
            devoluciones.map((d) => (
              <tr key={d.id}>
                <td>{d.numero}</td>
                <td>{clientesFake.find(c => c.id === d.clienteId)?.nombre}</td>
                <td>{d.fecha}</td>
                <td>{d.estado}</td>
                <td>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => abrirModalEdicion(d)}
                      title="Editar"
                      style={{ minWidth: "70px", marginRight: "10px" }}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarDevolucion(d.id)}
                      title="Eliminar"
                      style={{ minWidth: "70px", marginRight: "10px" }}
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => generarPDF(d.numero)}
                      title="PDF"
                      style={{ minWidth: "70px" }}
                    >
                      <i className="bi bi-file-earmark-pdf-fill me-1"></i>PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Devolución" size="xl">
        {editDevolucion && (
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Número</label>
                <input type="text" className="form-control" value={editDevolucion.numero} readOnly />
              </div>
              <div className="col-md-8">
                <label className="form-label">Cliente</label>
                <input type="text" className="form-control" value={clientesFake.find(c => c.id === editDevolucion.clienteId)?.nombre || ""} readOnly />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fecha</label>
                <DatePicker selected={editDevolucion.fecha ? new Date(editDevolucion.fecha) : null} onChange={actualizarFecha} className="form-control" dateFormat="yyyy-MM-dd" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select name="estado" className="form-select" value={editDevolucion.estado} onChange={actualizarCampo}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Procesada">Procesada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <input type="text" name="observaciones" className="form-control" value={editDevolucion.observaciones} onChange={actualizarCampo} />
            </div>

            <h5 className="mt-4">Productos devueltos</h5>
            <div className="row g-2 mb-3 align-items-end">
              <div className="col-md-9">
                <input type="text" list="productosList" className="form-control" placeholder="Buscar producto..." value={textoProducto} onChange={(e) => {
                  const valor = e.target.value;
                  setTextoProducto(valor);
                  const prod = productosFake.find(p => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase());
                  setProductoSeleccionado(prod ? prod.id : 0);
                }} />
                <datalist id="productosList">
                  {productosFake.map(p => (
                    <option key={p.id} value={`${p.nombre} - ${p.codigo}`} />
                  ))}
                </datalist>
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn btn-primary" onClick={agregarProducto}>Agregar Producto</button>
              </div>
            </div>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th> 
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {editDevolucion.productos.map((item, index) => {
                  const prod = productosFake.find(p => p.id === item.productoId);
                  const subtotal = prod ? prod.precio * item.cantidad : 0;
                  return (
                    <tr key={index}>
                      <td>{prod?.nombre}</td>
                      <td>L. {prod?.precio}</td>
                      <td><input type="number" min={1} className="form-control" value={item.cantidad} onChange={(e) => actualizarCantidad(index, Number(e.target.value))} /></td>
                      <td>L. {subtotal}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(item.productoId)}><i className="bi bi-x"></i></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text-end">
              <h5>Total: L. {calcularTotal()}</h5>
              <button className="btn btn-success px-4 mt-3" onClick={guardarCambios}><i className="bi bi-check-circle"></i> Guardar Cambios</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerDevoluciones;
