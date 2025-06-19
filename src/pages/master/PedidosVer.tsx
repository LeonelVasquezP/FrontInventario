import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/EstadoBadge.css";
import SearchableSelect from "../../components/ComponentesReutilizables/SearchableSelect";

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
}

interface DetalleProducto {
  productoId: number;
  cantidad: number;
}

interface Pedido {
  id?: number;
  codigo: string;
  clienteId: number;
  estadoPedido: string;
  fechaPedido: string;
  fechaEntrega: string;
  direccion: string;
  metodoPago: string;
  estadoPago: string;
  estadoFacturacion: string;
  totalNeto: number;
  productos: DetalleProducto[];
}

const clientesFake: Cliente[] = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María López" },
];

const productosFake: Producto[] = [
  { id: 1, nombre: "Teclado", codigo: "PRD-001", precio: 500 },
  { id: 2, nombre: "Mouse", codigo: "PRD-002", precio: 300 },
];

const pedidosFake: Pedido[] = [
  {
    id: 1,
    codigo: "PED-0001",
    clienteId: 1,
    estadoPedido: "Pendiente",
    fechaPedido: "2025-06-01",
    fechaEntrega: "2025-06-10",
    direccion: "Calle 123",
    metodoPago: "Efectivo",
    estadoPago: "Pendiente",
    estadoFacturacion: "Sin facturar",
    totalNeto: 0,
    productos: [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ],
  },
];

const PedidosVer: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editPedido, setEditPedido] = useState<Pedido | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const [filtroCliente, setFiltroCliente] = useState<number | string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // Estado para edición
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  useEffect(() => {
    setPedidos(pedidosFake);
  }, []);

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroCliente && p.clienteId !== filtroCliente) return false;

    const fechaPedido = new Date(p.fechaPedido);
    if (fechaInicio && fechaPedido < fechaInicio) return false;
    if (fechaFin && fechaPedido > fechaFin) return false;

    return true;
  });

  const eliminarPedido = (id?: number) => {
    if (!id) return;
    const confirmado = window.confirm("¿Seguro que quieres eliminar este pedido?");
    if (!confirmado) return;
    setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
  };

  const abrirModalEdicion = (pedido: Pedido) => {
    setEditPedido(pedido);
    setBusquedaCliente(clientesFake.find(c => c.id === pedido.clienteId)?.nombre || "");
    setShowModal(true);
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editPedido) return;
    const { name, value } = e.target;
    setEditPedido({ ...editPedido, [name]: value });
  };

  const actualizarFechaEntrega = (date: Date | null) => {
    if (editPedido && date) {
      setEditPedido({ ...editPedido, fechaEntrega: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || !editPedido) return;
    const yaExiste = editPedido.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Este producto ya está agregado");
    const nuevos = [...editPedido.productos, { productoId: productoSeleccionado, cantidad: 1 }];
    setEditPedido({ ...editPedido, productos: nuevos });
    setProductoSeleccionado(0);
    setTextoProducto("");
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (!editPedido) return;
    const nuevos = [...editPedido.productos];
    nuevos[index].cantidad = cantidad;
    setEditPedido({ ...editPedido, productos: nuevos });
  };

  const eliminarProducto = (productoId: number) => {
    if (!editPedido) return;
    const nuevos = editPedido.productos.filter(p => p.productoId !== productoId);
    setEditPedido({ ...editPedido, productos: nuevos });
  };

  const calcularTotal = () => {
    return editPedido?.productos.reduce((sum, p) => {
      const prod = productosFake.find(pr => pr.id === p.productoId);
      return sum + (prod ? prod.precio * p.cantidad : 0);
    }, 0) || 0;
  };

  const guardarCambios = () => {
    if (!editPedido) return;
    const actualizado = { ...editPedido, totalNeto: calcularTotal() };
    setPedidos(prev => prev.map(p => (p.id === actualizado.id ? actualizado : p)));
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Pedidos</h4>

      {/* Filtros */}
      <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-4">
          <SearchableSelect
            options={clientesFake.map(c => ({ id: c.id, label: c.nombre }))}
            value={filtroCliente}
            onChange={setFiltroCliente}
            placeholder="Filtrar por cliente"
            label="Cliente"
          />
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
              setFiltroCliente(null);
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Fecha Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No hay pedidos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            pedidosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{clientesFake.find((c) => c.id === p.clienteId)?.nombre}</td>
                <td>{p.estadoPedido}</td>
                <td>{p.fechaPedido}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">

<div>
  <button
    className="btn btn-sm btn-primary"
    onClick={() => abrirModalEdicion(p)}
    title="Editar pedido"
    style={{ minWidth: "70px", marginRight: "10px" }}
  >
    <i className="bi bi-pencil-fill me-1"></i>Editar
  </button>
  <button
    className="btn btn-sm btn-danger"
    onClick={() => eliminarPedido(p.id)}
    title="Eliminar pedido"
    style={{ minWidth: "70px", marginRight: "10px" }}
  >
    <i className="bi bi-trash-fill me-1"></i>Eliminar
  </button>
  <button
    className="btn btn-sm btn-info text-white"
    onClick={() => alert(`Generar PDF para pedido: ${p.codigo}`)}
    title="Generar PDF"
    style={{ minWidth: "70px" }}
  >
    <i className="bi bi-file-earmark-pdf-fill me-1"></i>PDF
  </button>
</div>



                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal edición pedido */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Pedido" size="xl">
        {editPedido && (
          <div className="container-fluid">
            {/* Primera fila: Código y Cliente */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Código</label>
                <input type="text" className="form-control" value={editPedido.codigo} readOnly />
              </div>

              <div className="col-md-8">
                <label className="form-label">Cliente</label>
                <input
                  type="text"
                  className="form-control"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  list="clientesList"
                  placeholder="Buscar cliente..."
                />
                <datalist id="clientesList">
                  {clientesFake
                    .filter(c => c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()))
                    .map(c => (
                      <option key={c.id} value={c.nombre} />
                    ))}
                </datalist>
              </div>
            </div>

            {/* Segunda fila: Dirección y Fecha de Entrega */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Dirección</label>
                <input
                  name="direccion"
                  className="form-control"
                  value={editPedido.direccion}
                  onChange={actualizarCampo}
                  placeholder="Ingrese dirección"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Entrega</label>
                <DatePicker
                  selected={editPedido.fechaEntrega ? new Date(editPedido.fechaEntrega) : null}
                  onChange={actualizarFechaEntrega}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione fecha"
                />
              </div>
            </div>

            {/* Tercera fila: Método de Pago, Estado Pago y Facturación */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Método de Pago</label>
                <select
                  name="metodoPago"
                  className="form-select"
                  value={editPedido.metodoPago}
                  onChange={actualizarCampo}
                >
                  <option value="">Seleccione</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Estado Pago</label>
                <select
                  name="estadoPago"
                  className="form-select"
                  value={editPedido.estadoPago}
                  onChange={actualizarCampo}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Facturación</label>
                <select
                  name="estadoFacturacion"
                  className="form-select"
                  value={editPedido.estadoFacturacion}
                  onChange={actualizarCampo}
                >
                  <option value="Sin facturar">Sin facturar</option>
                  <option value="Facturado">Facturado</option>
                </select>
              </div>
            </div>

            <hr />

            {/* Productos del Pedido */}
            <h5 className="mb-3">Productos del Pedido</h5>

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
                  {editPedido.productos.map((detalle, index) => {
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

export default PedidosVer;
