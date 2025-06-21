import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../Api/axiosConfig";
import axios from "axios";

interface Proveedor {
  id: number;
  nombre: string;
  codigo_socio: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precio_unitario: number;
}

interface DetalleCompra {
  productoId: number;
  cantidad: number;
}

interface Compra {
  numeroFactura: string;
  proveedorId: number;
  fechaCompra: string;
  metodoPago: string;
  observaciones: string;
  productos: DetalleCompra[];
}

const CrearCompra: React.FC = () => {
  const [compra, setCompra] = useState<Compra>({
    numeroFactura: "",
    proveedorId: 0,
    fechaCompra: new Date().toISOString().split("T")[0],
    metodoPago: "",
    observaciones: "",
    productos: []
  });

  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProveedores, resProductos] = await Promise.all([
          axiosInstance.get("/proveedores"),
          axiosInstance.get("/productos")
        ]);
        setProveedores(resProveedores.data);
        setProductosDisponibles(resProductos.data);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        alert("No se pudieron cargar proveedores o productos.");
      }
    };
    fetchData();

    const ultimaFactura = "FAC-0012";
    const nuevoNumero = generarSiguienteNumero(ultimaFactura);
    setCompra(prev => ({ ...prev, numeroFactura: nuevoNumero }));
  }, []);

  const generarSiguienteNumero = (ultimo: string): string => {
    const num = parseInt(ultimo.split("-")[1]) + 1;
    return `FAC-${num.toString().padStart(4, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompra({ ...compra, [name]: value });
  };

  const handleFechaCompra = (date: Date | null) => {
    if (date) {
      setCompra({ ...compra, fechaCompra: date.toISOString().split("T")[0] });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    const yaExiste = compra.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Este producto ya ha sido agregado.");
    setCompra({
      ...compra,
      productos: [...compra.productos, { productoId: productoSeleccionado, cantidad: 1 }]
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevosProductos = [...compra.productos];
    nuevosProductos[index].cantidad = cantidad;
    setCompra({ ...compra, productos: nuevosProductos });
  };

  const eliminarProducto = (productoId: number) => {
    setCompra({ ...compra, productos: compra.productos.filter(p => p.productoId !== productoId) });
  };

  const calcularTotal = () => {
    return compra.productos.reduce((total, item) => {
      const prod = productosDisponibles.find(p => p.id === item.productoId);
      return total + (prod ? prod.precio_unitario * item.cantidad : 0);
    }, 0);
  };

  const seleccionarProveedor = (nombre: string) => {
    const proveedor = proveedores.find(p => p.nombre === nombre);
    if (proveedor) {
      setCompra({ ...compra, proveedorId: proveedor.id });
    }
    setBusquedaProveedor(nombre);
  };

  const guardarCompra = async () => {
    if (!compra.proveedorId || compra.productos.length === 0) {
      alert("Proveedor y productos son obligatorios.");
      return;
    }

    try {
      const payload = {
        numero_orden: compra.numeroFactura,
        fecha: compra.fechaCompra,
        proveedor_id: compra.proveedorId,
        estado: "pendiente",
        metodo_pago: compra.metodoPago,
        observaciones: compra.observaciones,
        detalle: compra.productos.map(p => ({
          producto_id: p.productoId,
          cantidad: p.cantidad
        }))
      };

      await axiosInstance.post("/ordenes", payload);

      alert("Compra registrada exitosamente.");

      setCompra({
        numeroFactura: generarSiguienteNumero(compra.numeroFactura),
        proveedorId: 0,
        fechaCompra: new Date().toISOString().split("T")[0],
        metodoPago: "",
        observaciones: "",
        productos: []
      });
      setBusquedaProveedor("");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error del servidor:", error.response?.data || error.message);
        alert("Error del servidor: " + (error.response?.data?.error || error.message));
      } else {
        console.error("❌ Error desconocido:", error);
        alert("Error inesperado al registrar la compra.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-cart-plus me-2"></i> Crear Compra
      </h3>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Número de Factura</label>
          <input type="text" name="numeroFactura" className="form-control" value={compra.numeroFactura} readOnly />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha de Compra</label>
          <DatePicker
            selected={new Date(compra.fechaCompra)}
            onChange={handleFechaCompra}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="col-md-6">
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
            {proveedores.map((p) => (
              <option key={p.id} value={p.nombre} />
            ))}
          </datalist>
        </div>

        <div className="col-md-6">
          <label className="form-label">Método de Pago</label>
          <select
            name="metodoPago"
            className="form-select"
            value={compra.metodoPago}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Crédito">Crédito</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Observaciones</label>
          <input
            type="text"
            name="observaciones"
            className="form-control"
            value={compra.observaciones}
            onChange={handleChange}
            placeholder="Notas u observaciones de la compra"
          />
        </div>
      </div>

      <hr className="my-4" />
      <h5 className="fw-semibold mb-3">Productos de la Compra</h5>

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
          {compra.productos.map((detalle, index) => {
            const producto = productosDisponibles.find(p => p.id === detalle.productoId);
            const subtotal = producto ? producto.precio_unitario * detalle.cantidad : 0;
            return (
              <tr key={index}>
                <td>{producto?.nombre}</td>
                <td>L. {producto?.precio_unitario}</td>
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
          {compra.productos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">No hay productos agregados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h5 className="text-end mt-4">Total: <strong>L. {calcularTotal()}</strong></h5>

      <div className="text-end mt-4">
        <button className="btn btn-success px-4" onClick={guardarCompra}>
          <i className="bi bi-check2-circle me-2"></i>Guardar Compra
        </button>
      </div>
    </div>
  );
};

export default CrearCompra;
