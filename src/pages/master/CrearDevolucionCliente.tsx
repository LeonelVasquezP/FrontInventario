import React, { useEffect, useState } from "react";
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
  numeroDevolucion: string;
  clienteId: number;
  fecha: string;
  estado: string;
  observaciones: string;
  productos: DetalleDevolucion[];
}

const clientes: Cliente[] = [
  { id: 1, nombre: "Cliente A", rtn: "0801199901234" },
  { id: 2, nombre: "Cliente B", rtn: "0801200105678" }
];

const productosDisponibles: Producto[] = [
  { id: 1, nombre: "Router", codigo: "PR-1001", precio: 1200 },
  { id: 2, nombre: "Switch", codigo: "PR-1002", precio: 3000 }
];

const CrearDevolucion: React.FC = () => {
  const [devolucion, setDevolucion] = useState<Devolucion>({
    numeroDevolucion: "",
    clienteId: 0,
    fecha: new Date().toISOString().split("T")[0],
    estado: "Pendiente",
    observaciones: "",
    productos: []
  });

  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  useEffect(() => {
    const fetchUltimaDevolucion = async () => {
      const ultima = "DEV-0010";
      const nueva = generarSiguienteNumero(ultima);
      setDevolucion((prev) => ({ ...prev, numeroDevolucion: nueva }));
    };
    fetchUltimaDevolucion();
  }, []);

  const generarSiguienteNumero = (ultima: string): string => {
    const num = parseInt(ultima.split("-")[1]) + 1;
    return `DEV-${num.toString().padStart(4, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDevolucion({ ...devolucion, [name]: value });
  };

  const handleFecha = (date: Date | null) => {
    if (date) {
      setDevolucion({ ...devolucion, fecha: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    if (devolucion.productos.some(p => p.productoId === productoSeleccionado)) {
      alert("Producto ya agregado.");
      return;
    }
    setDevolucion({
      ...devolucion,
      productos: [...devolucion.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevos = [...devolucion.productos];
    nuevos[index].cantidad = cantidad;
    setDevolucion({ ...devolucion, productos: nuevos });
  };

  const eliminarProducto = (id: number) => {
    setDevolucion({ ...devolucion, productos: devolucion.productos.filter(p => p.productoId !== id) });
  };

  const calcularTotal = () => {
    return devolucion.productos.reduce((total, item) => {
      const prod = productosDisponibles.find(p => p.id === item.productoId);
      return total + (prod ? prod.precio * item.cantidad : 0);
    }, 0);
  };

  const seleccionarCliente = (nombre: string) => {
    const cliente = clientes.find(c => c.nombre === nombre);
    if (cliente) {
      setDevolucion({ ...devolucion, clienteId: cliente.id });
    }
    setBusquedaCliente(nombre);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-arrow-counterclockwise me-2"></i> Crear Devolución
      </h3>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Número de Devolución</label>
          <input type="text" className="form-control" value={devolucion.numeroDevolucion} readOnly />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          <DatePicker
            selected={new Date(devolucion.fecha)}
            onChange={handleFecha}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Cliente</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
            list="clientesList"
            value={busquedaCliente}
            onChange={(e) => seleccionarCliente(e.target.value)}
          />
          <datalist id="clientesList">
            {clientes.map(c => (
              <option key={c.id} value={c.nombre} />
            ))}
          </datalist>
        </div>

        <div className="col-md-6">
          <label className="form-label">Estado</label>
          <select name="estado" className="form-select" value={devolucion.estado} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Procesada">Procesada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Observaciones</label>
          <input
            type="text"
            name="observaciones"
            className="form-control"
            value={devolucion.observaciones}
            onChange={handleChange}
            placeholder="Motivo u observaciones de la devolución"
          />
        </div>
      </div>

      <hr className="my-4" />
      <h5 className="fw-semibold mb-3">Productos Devueltos</h5>

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
              const prod = productosDisponibles.find(
                (p) => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase()
              );
              setProductoSeleccionado(prod ? prod.id : 0);
            }}
          />
          <datalist id="productosList">
            {productosDisponibles.map(p => (
              <option key={p.id} value={`${p.nombre} - ${p.codigo}`} />
            ))}
          </datalist>
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-primary" onClick={agregarProducto} disabled={!productoSeleccionado}>
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
          {devolucion.productos.map((detalle, index) => {
            const producto = productosDisponibles.find(p => p.id === detalle.productoId);
            const subtotal = producto ? producto.precio * detalle.cantidad : 0;
            return (
              <tr key={index}>
                <td>{producto?.nombre}</td>
                <td>L. {producto?.precio}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    value={detalle.cantidad}
                    onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                  />
                </td>
                <td>L. {subtotal}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(detalle.productoId)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            );
          })}
          {devolucion.productos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">No hay productos agregados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h5 className="text-end mt-4">Total: <strong>L. {calcularTotal()}</strong></h5>

      <div className="text-end mt-4">
        <button className="btn btn-success px-4">
          <i className="bi bi-check2-circle me-2"></i>Guardar Devolución
        </button>
      </div>
    </div>
  );
};

export default CrearDevolucion;
