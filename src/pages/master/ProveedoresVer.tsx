
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal"; // Asegúrate de tener este componente Modal
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchableSelect from "../../components/ComponentesReutilizables/SearchableSelect";

interface Proveedor {
  id: number;
  codigo: string;
  nombre: string;
  tipo: "Nacional" | "Internacional";
  estado: "Activo" | "Inactivo";
  fechaRegistro: string;
  rtn?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  contacto?: string;
  observaciones?: string;
  metodoPago?: "Transferencia" | "Efectivo" | "Crédito";
}

const proveedoresFake: Proveedor[] = [
  {
    id: 1,
    codigo: "P001",
    nombre: "Proveedor A",
    tipo: "Nacional",
    estado: "Activo",
    fechaRegistro: "2025-06-01",
    rtn: "08011985123960",
    direccion: "Calle Falsa 123",
    correo: "a@proveedores.com",
    telefono: "555-1234",
    contacto: "Juan Pérez",
    observaciones: "Entrega en horario de 8am a 5pm",
    metodoPago: "Transferencia",
  },
  {
    id: 2,
    codigo: "P002",
    nombre: "Proveedor B",
    tipo: "Internacional",
    estado: "Inactivo",
    fechaRegistro: "2025-05-15",
    rtn: "08011985234560",
    direccion: "Avenida Siempre Viva 742",
    correo: "b@proveedores.com",
    telefono: "555-5678",
    contacto: "María López",
    observaciones: "Solo pedidos mayores a $500",
    metodoPago: "Crédito",
  },
];

const ProveedoresVer: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [editProveedor, setEditProveedor] = useState<Proveedor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setProveedores(proveedoresFake);
  }, []);

  // Filtrado sencillo
  const proveedoresFiltrados = proveedores.filter((p) => {
    if (filtroTipo && p.tipo !== filtroTipo) return false;

    const fecha = new Date(p.fechaRegistro);
    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;

    return true;
  });

  const eliminarProveedor = (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este proveedor?")) return;
    setProveedores((prev) => prev.filter((p) => p.id !== id));
  };

  // Abre modal y carga el proveedor seleccionado
  const abrirModalEdicion = (proveedor: Proveedor) => {
    setEditProveedor(proveedor);
    setShowModal(true);
  };

  // Actualiza los campos en el modal
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editProveedor) return;
    const { name, value } = e.target;
    setEditProveedor({ ...editProveedor, [name]: value });
  };

  // Actualiza fecha de registro
  const handleFechaRegistroChange = (date: Date | null) => {
    if (!editProveedor) return;
    if (date) {
      setEditProveedor({ ...editProveedor, fechaRegistro: date.toISOString().split("T")[0] });
    } else {
      setEditProveedor({ ...editProveedor, fechaRegistro: "" });
    }
  };

  // Guarda cambios en el proveedor
  const guardarCambios = () => {
    if (!editProveedor) return;
    setProveedores((prev) =>
      prev.map((p) => (p.id === editProveedor.id ? editProveedor : p))
    );
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Proveedores</h4>

      {/* Filtros */}
      <div className="row mb-4 g-3 align-items-end">
        <div className="col-md-4">
          <SearchableSelect
            options={[
              { id: "Nacional", label: "Nacional" },
              { id: "Internacional", label: "Internacional" },
            ]}
            value={filtroTipo}
            onChange={(val) => setFiltroTipo(typeof val === "string" ? val : null)}
            placeholder="Filtrar por tipo"
            label="Tipo"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Fecha inicio</label>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
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
            onChange={(date) => setFechaFin(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Fecha fin"
            isClearable
          />
        </div>

        <div className="col-md-2 d-grid">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFiltroTipo(null);
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay proveedores que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              proveedoresFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.tipo}</td>
                  <td>{p.estado}</td>
                  <td>{p.fechaRegistro}</td>
                  <td>
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
                    onClick={() => eliminarProveedor(p.id)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

{/* Modal edición proveedor */}
<Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Proveedor" size="xl">
  {editProveedor && (
    <div className="container-fluid">
      {/* Primera fila: Código, Nombre, RTN */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Código</label>
          <input
            type="text"
            name="codigo"
            className="form-control"
            value={editProveedor.codigo}
            onChange={handleChange}
            placeholder="Código"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={editProveedor.nombre}
            onChange={handleChange}
            placeholder="Nombre del proveedor"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">RTN</label>
          <input
            type="text"
            name="rtn"
            className="form-control"
            value={editProveedor.rtn || ""}
            onChange={handleChange}
            placeholder="RTN"
          />
        </div>
      </div>

      {/* Segunda fila: Tipo, Estado, Fecha Registro */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Tipo</label>
          <select
            name="tipo"
            className="form-select"
            value={editProveedor.tipo}
            onChange={handleChange}
          >
            <option value="Nacional">Nacional</option>
            <option value="Internacional">Internacional</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            className="form-select"
            value={editProveedor.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha Registro</label>
          <DatePicker
            selected={editProveedor.fechaRegistro ? new Date(editProveedor.fechaRegistro) : null}
            onChange={(date) => {
              if (!date) return;
              const fechaISO = date.toISOString().split("T")[0];
              setEditProveedor({ ...editProveedor, fechaRegistro: fechaISO });
            }}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Seleccione fecha"
          />
        </div>
      </div>

      {/* Tercera fila: Dirección y Correo */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={editProveedor.direccion || ""}
            onChange={handleChange}
            placeholder="Dirección"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Correo</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            value={editProveedor.correo || ""}
            onChange={handleChange}
            placeholder="Correo electrónico"
          />
        </div>
      </div>

      {/* Cuarta fila: Teléfono y Contacto */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={editProveedor.telefono || ""}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contacto</label>
          <input
            type="text"
            name="contacto"
            className="form-control"
            value={editProveedor.contacto || ""}
            onChange={handleChange}
            placeholder="Persona contacto"
          />
        </div>
      </div>

      {/* Quinta fila: Método de Pago y Observaciones */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Método de Pago</label>
          <select
            name="metodoPago"
            className="form-select"
            value={editProveedor.metodoPago || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Crédito">Crédito</option>
          </select>
        </div>

        <div className="col-md-8">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            rows={3}
            value={editProveedor.observaciones || ""}
            onChange={handleChange}
            placeholder="Observaciones"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="text-end mt-4">
        <button className="btn btn-success px-4" onClick={guardarCambios}>
          Guardar Cambios
        </button>
      </div>
    </div>
  )}
  </Modal>

    </div>
  );
};

export default ProveedoresVer;
