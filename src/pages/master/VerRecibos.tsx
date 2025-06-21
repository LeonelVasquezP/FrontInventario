import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchableSelect from "../../components/ComponentesReutilizables/SearchableSelect";

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

  // ✅ filtroProveedor ahora acepta string también
  const [filtroProveedor, setFiltroProveedor] = useState<number | string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  useEffect(() => {
    setRecibos(recibosFake);
  }, []);

  const recibosFiltrados = recibos.filter((r) => {
    const filtroNum = typeof filtroProveedor === "string" ? parseInt(filtroProveedor) : filtroProveedor;
    if (filtroNum && r.proveedorId !== filtroNum) return false;
    const fecha = new Date(r.fecha);
    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;
    return true;
  });

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

      {/* Filtros */}
      <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-4">
          <SearchableSelect
            options={proveedoresFake.map(p => ({ id: p.id, label: p.nombre }))}
            value={filtroProveedor}
            onChange={setFiltroProveedor}
            placeholder="Filtrar por proveedor"
            label="Proveedor"
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
              setFiltroProveedor(null);
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* ...la tabla, modal y demás UI siguen igual como ya los tenías... */}
    </div>
  );
};

export default VerRecibos;
