import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../Api/axiosConfig";

interface Proveedor {
  id: number;
  nombre: string;
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
  id: string;
  numeroFactura: string;
  proveedorId: number;
  proveedorNombre: string;
  fechaCompra: string;
  metodoPago: string;
  observaciones: string;
  productos: DetalleCompra[];
}



const VerCompras: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editCompra, setEditCompra] = useState<Compra | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [textoProducto, setTextoProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);

  const [filtroProveedor, setFiltroProveedor] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordenesRes, proveedoresRes, productosRes] = await Promise.all([
          axiosInstance.get("/ordenes"),
          axiosInstance.get("/proveedores"),
          axiosInstance.get("/productos"),
        ]);

      const ordenesAdaptadas: Compra[] = ordenesRes.data.map((orden: any) => ({
        id: orden.id,
        numeroFactura: orden.numero_orden,
        proveedorId: orden.proveedor.id,
        proveedorNombre: orden.proveedor.nombre,
        fechaCompra: orden.fecha,
        metodoPago: "-", // No lo estás incluyendo en la respuesta aún
        observaciones: "-", // Tampoco está llegando en el response
        productos: (orden.detalle || []).map((item: any) => ({
          productoId: item.producto_id,
          cantidad: item.cantidad,
        })),
      }));





        setCompras(ordenesAdaptadas);
        setProveedores(proveedoresRes.data);
        setProductos(productosRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const comprasFiltradas = compras.filter((c) => {
    if (filtroProveedor && c.proveedorId !== filtroProveedor) return false;
    const fecha = new Date(c.fechaCompra);
    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;
    return true;
  });

  const abrirModalEdicion = (compra: Compra) => {
    setEditCompra(compra);
    setShowModal(true);
  };

  const eliminarCompra = async (id: string) => {
    if (!window.confirm("¿Deseas eliminar esta compra?")) return;
    try {
      await axiosInstance.delete(`/ordenes/${id}`);
      setCompras((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const calcularTotal = () => {
    if (!editCompra) return 0;
    return editCompra.productos.reduce((total, item) => {
      const prod = productos.find((p) => p.id === item.productoId);
      return total + (prod ? prod.precio_unitario * item.cantidad : 0);
    }, 0);
  };

  const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editCompra) return;
    const { name, value } = e.target;
    setEditCompra({ ...editCompra, [name]: value });
  };

  const actualizarFechaCompra = (date: Date | null) => {
    if (!editCompra || !date) return;
    setEditCompra({ ...editCompra, fechaCompra: date.toISOString().split("T")[0] });
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    if (!editCompra) return;
    const nuevosProductos = [...editCompra.productos];
    nuevosProductos[index].cantidad = cantidad;
    setEditCompra({ ...editCompra, productos: nuevosProductos });
  };

  const eliminarProducto = (productoId: number) => {
    if (!editCompra) return;
    const productosActualizados = editCompra.productos.filter(p => p.productoId !== productoId);
    setEditCompra({ ...editCompra, productos: productosActualizados });
  };

  const agregarProducto = () => {
    if (!editCompra || !productoSeleccionado) return;
    const yaExiste = editCompra.productos.some(p => p.productoId === productoSeleccionado);
    if (yaExiste) return alert("Este producto ya ha sido agregado.");
    setEditCompra({
      ...editCompra,
      productos: [...editCompra.productos, { productoId: productoSeleccionado, cantidad: 1 }],
    });
    setTextoProducto("");
    setProductoSeleccionado(0);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Compras</h4>

      <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Proveedor</label>
          <input
            type="text"
            list="proveedorList"
            className="form-control"
            placeholder="Filtrar por proveedor"
            onChange={(e) => {
              const nombre = e.target.value;
              const prov = proveedores.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
              setFiltroProveedor(prov ? prov.id : null);
            }}
          />
          <datalist id="proveedorList">
            {proveedores.map(p => (
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

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Número</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">No hay compras disponibles.</td>
            </tr>
          ) : (
            comprasFiltradas.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.numeroFactura}</td>
                <td>{compra.proveedorNombre}</td>

                <td>{compra.fechaCompra}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => abrirModalEdicion(compra)}>
                    <i className="bi bi-pencil-fill"></i> Editar
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => eliminarCompra(compra.id)}>
                    <i className="bi bi-trash-fill"></i> Eliminar
                  </button>
                  <button className="btn btn-info btn-sm text-white" onClick={() => alert("Generar PDF")}> 
                    <i className="bi bi-file-earmark-pdf"></i> PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && editCompra && (
        <Modal show={showModal} onClose={() => setShowModal(false)} title={`Editar Compra: ${editCompra.numeroFactura}`} size="xl">
          <div className="container-fluid">
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
                  value={proveedores.find(p => p.id === editCompra.proveedorId)?.nombre || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Compra</label>
                <DatePicker
                  selected={editCompra.fechaCompra ? new Date(editCompra.fechaCompra) : null}
                  onChange={actualizarFechaCompra}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
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

            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <input
                type="text"
                name="observaciones"
                className="form-control"
                value={editCompra.observaciones}
                onChange={actualizarCampo}
              />
            </div>

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
                    const prod = productos.find(
                      (p) => `${p.nombre} - ${p.codigo}`.toLowerCase() === valor.toLowerCase()
                    );
                    setProductoSeleccionado(prod ? prod.id : 0);
                  }}
                />
                <datalist id="productosList">
                  {productos.map(prod => (
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

            <table className="table table-striped align-middle">
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
                {editCompra.productos.map((detalle, index) => {
                  const producto = productos.find(p => p.id === detalle.productoId);
                  const subtotal = producto ? producto.precio_unitario * detalle.cantidad : 0;
                  return (
                    <tr key={index}>
                      <td>{producto?.nombre}</td>
                      <td>L. {producto?.precio_unitario}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          className="form-control form-control-sm"
                          value={detalle.cantidad}
                          onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                        />
                      </td>
                      <td>L. {subtotal}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(detalle.productoId)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text-end mt-4">
              <h5>Total Neto: L. {calcularTotal()}</h5>
              <button className="btn btn-success mt-2 px-4" onClick={() => alert("Guardar cambios")}>Guardar Cambios</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VerCompras;
