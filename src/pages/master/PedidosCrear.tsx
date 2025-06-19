import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/EstadoBadge.css";

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

// Datos simulados
const clientes: Cliente[] = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María López" },
  { id: 3, nombre: "Carlos Méndez" }
];

const productosDisponibles: Producto[] = [
  { id: 1, nombre: "Teclado", codigo: "PRD-001", precio: 500 },
  { id: 2, nombre: "Mouse", codigo: "PRD-002", precio: 300 },
  { id: 3, nombre: "Monitor", codigo: "PRD-003", precio: 1500 }
];

const CrearPedido: React.FC = () => {
  const [pedido, setPedido] = useState<Pedido>({
    codigo: "PED-0001",
    clienteId: 0,
    estadoPedido: "Pendiente",
    fechaPedido: new Date().toISOString().split("T")[0],
    fechaEntrega: "",
    direccion: "",
    metodoPago: "",
    estadoPago: "Pendiente",
    estadoFacturacion: "Sin facturar",
    totalNeto: 0,
    productos: []
  });

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleFechaEntrega = (date: Date | null) => {
    if (date) {
      setPedido({ ...pedido, fechaEntrega: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;

    const yaExiste = pedido.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) {
      alert("Este producto ya ha sido agregado.");
      return;
    }

    setPedido({
      ...pedido,
      productos: [...pedido.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setProductoSeleccionado(0);
    setTextoProducto("");
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevosProductos = [...pedido.productos];
    nuevosProductos[index].cantidad = cantidad;
    setPedido({ ...pedido, productos: nuevosProductos });
  };

  const eliminarProducto = (productoId: number) => {
    setPedido({
      ...pedido,
      productos: pedido.productos.filter(p => p.productoId !== productoId)
    });
  };

  const calcularTotal = () => {
    const total = pedido.productos.reduce((sum, p) => {
      const producto = productosDisponibles.find(prod => prod.id === p.productoId);
      return sum + (producto ? producto.precio * p.cantidad : 0);
    }, 0);
    return total;
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-bag-plus me-2"></i> Crear Pedido de Venta
      </h3>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Código del Pedido</label>
          <input type="text" className="form-control" value={pedido.codigo} readOnly />
        </div>

        <div className="col-md-6">
          <label className="form-label">Estado del Pedido</label>
          <select name="estadoPedido" className="form-select" value={pedido.estadoPedido} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Enviado">Enviado</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Cliente</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            list="clientesList"
          />
          <datalist id="clientesList">
            {clientes
              .filter((c) => c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()))
              .map((cliente) => (
                <option key={cliente.id} value={cliente.nombre} />
              ))}
          </datalist>
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha de Entrega</label>
          <DatePicker
            selected={pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null}
            onChange={handleFechaEntrega}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={pedido.direccion}
            onChange={handleChange}
            placeholder="Dirección del cliente"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Método de Pago</label>
          <select name="metodoPago" className="form-select" value={pedido.metodoPago} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Estado de Pago</label>
          <select name="estadoPago" className="form-select" value={pedido.estadoPago} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Facturación</label>
          <select name="estadoFacturacion" className="form-select" value={pedido.estadoFacturacion} onChange={handleChange}>
            <option value="Sin facturar">Sin facturar</option>
            <option value="Facturado">Facturado</option>
          </select>
        </div>
      </div>

      <hr className="my-4" />

      <h5 className="fw-semibold mb-3">Productos del Pedido</h5>

      {/* Combobox producto + botón agregar en la misma fila */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-9">
          <input
            type="text"
            list="productosList"
            className="form-control"
            placeholder="Buscar producto por nombre o código..."
            value={textoProducto}
            onChange={(e) => {
              const valor = e.target.value;
              setTextoProducto(valor);
              const prod = productosDisponibles.find(
                (p) => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase()
              );
              setProductoSeleccionado(prod ? prod.id : 0);
            }}
          />
          <datalist id="productosList">
            {productosDisponibles.map((prod) => (
              <option key={prod.id} value={`${prod.nombre} - ${prod.codigo}`} />
            ))}
          </datalist>
        </div>

        <div className="col-md-3 d-grid">
          <button
            className="btn btn-primary"
            type="button"
            onClick={agregarProducto}
            disabled={productoSeleccionado === 0}
          >
            <i className="bi bi-plus-circle me-1"></i> Agregar Producto
          </button>
        </div>
      </div>

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {pedido.productos.map((detalle, index) => {
            const producto = productosDisponibles.find(p => p.id === detalle.productoId);
            const subtotal = producto ? producto.precio * detalle.cantidad : 0;

            return (
              <tr key={index}>
                <td>{producto?.nombre}</td>
                <td>L. {producto?.precio}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    className="form-control"
                    value={detalle.cantidad}
                    onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                  />
                </td>
                <td>L. {subtotal}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(detalle.productoId)}>
                    <i className="bi bi-x"></i>
                  </button>
                </td>
              </tr>
            );
          })}
          {pedido.productos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">No hay productos agregados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h5 className="text-end mt-4">Total Neto: <strong>L. {calcularTotal()}</strong></h5>

      <div className="text-end mt-4">
        <button className="btn btn-success px-4">
          <i className="bi bi-check2-circle me-2"></i>Guardar Pedido
        </button>
      </div>
    </div>
  );
};

export default CrearPedido;
