import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Proveedor {
  id: number;
  nombre: string;
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
  numeroRecibo: string;
  proveedorId: number;
  fecha: string;
  productos: DetalleRecibo[];
}

const proveedores: Proveedor[] = [
  { id: 1, nombre: "Proveedor A" },
  { id: 2, nombre: "Proveedor B" }
];

const productosDisponibles: Producto[] = [
  { id: 1, nombre: "Router", codigo: "PR-1001", precio: 1200 },
  { id: 2, nombre: "Switch", codigo: "PR-1002", precio: 3000 }
];

const CrearRecibos: React.FC = () => {
  const [recibo, setRecibo] = useState<Recibo>({
    numeroRecibo: "",
    proveedorId: 0,
    fecha: new Date().toISOString().split("T")[0],
    productos: []
  });

  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);
  const [busquedaProveedor, setBusquedaProveedor] = useState("");

  useEffect(() => {
    const fetchUltimoRecibo = async () => {
      const ultimo = "REC-0015";
      const nuevo = generarSiguienteNumero(ultimo);
      setRecibo((prev) => ({ ...prev, numeroRecibo: nuevo }));
    };
    fetchUltimoRecibo();
  }, []);

  const generarSiguienteNumero = (ultimo: string): string => {
    const num = parseInt(ultimo.split("-")[1]) + 1;
    return `REC-${num.toString().padStart(4, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecibo({ ...recibo, [name]: value });
  };

  const handleFecha = (date: Date | null) => {
    if (date) {
      setRecibo({ ...recibo, fecha: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    if (recibo.productos.some(p => p.productoId === productoSeleccionado)) {
      alert("Producto ya agregado.");
      return;
    }
    setRecibo({
      ...recibo,
      productos: [...recibo.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevos = [...recibo.productos];
    nuevos[index].cantidad = cantidad;
    setRecibo({ ...recibo, productos: nuevos });
  };

  const eliminarProducto = (id: number) => {
    setRecibo({ ...recibo, productos: recibo.productos.filter(p => p.productoId !== id) });
  };

  const calcularTotal = () => {
    return recibo.productos.reduce((total, item) => {
      const prod = productosDisponibles.find(p => p.id === item.productoId);
      return total + (prod ? prod.precio * item.cantidad : 0);
    }, 0);
  };

  const seleccionarProveedor = (nombre: string) => {
    const prov = proveedores.find(c => c.nombre === nombre);
    if (prov) {
      setRecibo({ ...recibo, proveedorId: prov.id });
    }
    setBusquedaProveedor(nombre);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-box-arrow-in-down me-2"></i> Crear Recibido
      </h3>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Número de Recibo</label>
          <input type="text" className="form-control" value={recibo.numeroRecibo} readOnly />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          <DatePicker
            selected={new Date(recibo.fecha)}
            onChange={handleFecha}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Proveedor</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar proveedor..."
            list="proveedoresList"
            value={busquedaProveedor}
            onChange={(e) => seleccionarProveedor(e.target.value)}
          />
          <datalist id="proveedoresList">
            {proveedores.map(p => (
              <option key={p.id} value={p.nombre} />
            ))}
          </datalist>
        </div>
      </div>

      <hr className="my-4" />
      <h5 className="fw-semibold mb-3">Productos Recibidos</h5>

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
          {recibo.productos.map((detalle, index) => {
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
          {recibo.productos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">No hay productos agregados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h5 className="text-end mt-4">Total: <strong>L. {calcularTotal()}</strong></h5>

      <div className="text-end mt-4">
        <button className="btn btn-success px-4">
          <i className="bi bi-check2-circle me-2"></i>Guardar Recibo
        </button>
      </div>
    </div>
  );
};

export default CrearRecibos;
