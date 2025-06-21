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

interface DetalleCompra {
  productoId: number;
  cantidad: number;
}

interface Compra {
  id?: number;
  numeroFactura: string;
  proveedorId: number;
  fechaCompra: string;
  metodoPago: string;
  observaciones: string;
  productos: DetalleCompra[];
}

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: "Distribuidora ABC", rtn: "0801199901234" },
  { id: 2, nombre: "Comercial XYZ", rtn: "0801200105678" },
];

const productosFake: Producto[] = [
  { id: 1, nombre: "Router", codigo: "PR-1001", precio: 1200 },
  { id: 2, nombre: "Switch", codigo: "PR-1002", precio: 3000 },
];

const comprasFake: Compra[] = [
  {
    id: 1,
    numeroFactura: "FAC-0001",
    proveedorId: 1,
    fechaCompra: "2025-06-01",
    metodoPago: "Efectivo",
    observaciones: "Compra inicial",
    productos: [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ],
  },
];

const VerCompras: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [editCompra, setEditCompra] = useState<Compra | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const [filtroProveedor, setFiltroProveedor] = useState<number | string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // Para edición producto
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  useEffect(() => {
    setCompras(comprasFake);
  }, []);

  const comprasFiltradas = compras.filter((c) => {
    if (filtroProveedor && c.proveedorId !== filtroProveedor) return false;

    const fechaCompra = new Date(c.fechaCompra);
    if (fechaInicio && fechaCompra < fechaInicio) return false;
    if (fechaFin && fechaCompra > fechaFin) return false;

    return true;
  });

  const eliminarCompra = (id?: number) => {
    if (!id) return;
    if (!window.confirm("¿Seguro que deseas eliminar esta compra?")) return;
    setCompras((prev) => prev.filter((compra) => compra.id !== id));
  };

  const abrirModalEdicion = (compra: Compra) => {
    setEditCompra(compra);
    setShowModal(true);
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editCompra) return;
    const { name, value } = e.target;
    setEditCompra({ ...editCompra, [name]: value });
  };

  const actualizarFechaCompra = (date: Date | null) => {
    if (editCompra && date) {
      setEditCompra({ ...editCompra, fechaCompra: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || !editCompra) return;
    const yaExiste = editCompra.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Este producto ya está agregado");
    const nuevos = [...editCompra.productos, { productoId: productoSeleccionado, cantidad: 1 }];
    setEditCompra({ ...editCompra, productos: nuevos });
    setProductoSeleccionado(0);
    setTextoProducto("");
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (!editCompra) return;
    const nuevos = [...editCompra.productos];
    nuevos[index].cantidad = cantidad;
    setEditCompra({ ...editCompra, productos: nuevos });
  };

  const eliminarProducto = (productoId: number) => {
    if (!editCompra) return;
    const nuevos = editCompra.productos.filter(p => p.productoId !== productoId);
    setEditCompra({ ...editCompra, productos: nuevos });
  };

  const calcularTotal = () => {
    return editCompra?.productos.reduce((sum, p) => {
      const prod = productosFake.find(pr => pr.id === p.productoId);
      return sum + (prod ? prod.precio * p.cantidad : 0);
    }, 0) || 0;
  };

  const guardarCambios = () => {
    if (!editCompra) return;
    setCompras(prev => prev.map(c => (c.id === editCompra.id ? editCompra : c)));
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Compras</h4>

      {/* Filtros */}
      <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Proveedor</label>
          <input
            type="text"
            list="proveedoresList"
            className="form-control"
            placeholder="Filtrar por proveedor"
            value={
              filtroProveedor
                ? proveedoresFake.find(p => p.id === filtroProveedor)?.nombre || ""
                : ""
            }
            onChange={e => {
              const nombre = e.target.value;
              const proveedor = proveedoresFake.find(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()));
              setFiltroProveedor(proveedor ? proveedor.id : null);
            }}
          />
          <datalist id="proveedoresList">
            {proveedoresFake.map(p => (
              <option key={p.id} value={p.nombre} />
            ))}
          </datalist>
        </div>

        <div className="col-md-3">
          <label className="form-label">Fecha inicio</label>
          <DatePicker
            selected={fechaInicio}
            onChange={setFechaInicio}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Fecha inicio"
            isClearable
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Fecha fin</label>
          <DatePicker
            selected={fechaFin}
            onChange={setFechaFin}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Fecha fin"
            isClearable
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setFiltroProveedor(null);
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de compras */}
      <table className="table">
        <thead>
          <tr>
            <th>Número Factura</th>
            <th>Proveedor</th>
            <th>Fecha Compra</th>
            <th>Método Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {comprasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No hay compras que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            comprasFiltradas.map((c) => (
              <tr key={c.id}>
                <td>{c.numeroFactura}</td>
                <td>{proveedoresFake.find((p) => p.id === c.proveedorId)?.nombre}</td>
                <td>{c.fechaCompra}</td>
                <td>{c.metodoPago}</td>
                <td>
                  <div>


                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => abrirModalEdicion(c)}
                      title="Editar compra"
                      style={{ minWidth: "70px", marginRight: "10px" }}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarCompra(c.id)}
                      title="Eliminar compra"
                      style={{ minWidth: "70px", marginRight: "10px" }}
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => alert(`Generar PDF para compra: ${c.numeroFactura}`)}
                      title="Generar PDF"
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

      {/* Modal edición compra */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Compra" size="xl">
        {editCompra && (
          <div className="container-fluid">
            {/* Número factura y proveedor */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Número de Factura</label>
                <input type="text" className="form-control" value={editCompra.numeroFactura} readOnly />
              </div>

              <div className="col-md-8">
                <label className="form-label">Proveedor</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    proveedoresFake.find(p => p.id === editCompra.proveedorId)?.nombre || ""
                  }
                  readOnly
                />
              </div>
            </div>

            {/* Fecha compra y método pago */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Compra</label>
                <DatePicker
                  selected={editCompra.fechaCompra ? new Date(editCompra.fechaCompra) : null}
                  onChange={actualizarFechaCompra}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione fecha"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Método de Pago</label>
                <select
                  name="metodoPago"
                  className="form-select"
                  value={editCompra.metodoPago}
                  onChange={actualizarCampo}
                >
                  <option value="">Seleccione</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>
            </div>

            {/* Observaciones */}
            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <input
                type="text"
                name="observaciones"
                className="form-control"
                value={editCompra.observaciones}
                onChange={actualizarCampo}
                placeholder="Notas u observaciones"
              />
            </div>

            <hr />

            {/* Productos de la compra */}
            <h5 className="mb-3">Productos de la Compra</h5>

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
                    const prod = productosFake.find(
                      (p) => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase()
                    );
                    setProductoSeleccionado(prod ? prod.id : 0);
                  }}
                />
                <datalist id="productosList">
                  {productosFake.map((prod) => (
                    <option key={prod.id} value={`${prod.nombre} - ${prod.codigo}`} />
                  ))}
                </datalist>
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn btn-primary" onClick={agregarProducto}>
                  Agregar Producto
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th style={{ width: "100px" }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th style={{ width: "80px" }}>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {editCompra.productos.map((detalle, index) => {
                    const producto = productosFake.find((p) => p.id === detalle.productoId);
                    const subtotal = producto ? producto.precio * detalle.cantidad : 0;

                    return (
                      <tr key={index}>
                        <td>{producto?.nombre}</td>
                        <td>L. {producto?.precio}</td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            className="form-control form-control-sm"
                            value={detalle.cantidad}
                            onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                            style={{ maxWidth: "70px" }}
                          />
                        </td>
                        <td>L. {subtotal}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarProducto(detalle.productoId)}
                            title="Eliminar producto"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-4">
              <h5>Total Neto: L. {calcularTotal()}</h5>
              <button className="btn btn-success mt-2 px-4" onClick={guardarCambios}>
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerCompras;
