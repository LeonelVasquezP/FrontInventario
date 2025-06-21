import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchableSelect from "../../components/ComponentesReutilizables/SearchableSelect";

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  unidad: string;
  fechaIngreso: string;
  cantidad: number;
  precio: number;
}

const productosFake: Producto[] = [
  {
    id: 1,
    codigo: "A001",
    nombre: "Producto A",
    unidad: "Unidad",
    fechaIngreso: "2025-06-10",
    cantidad: 10,
    precio: 25.5,
  },
  {
    id: 2,
    codigo: "B002",
    nombre: "Producto B",
    unidad: "Caja",
    fechaIngreso: "2025-06-12",
    cantidad: 5,
    precio: 12.0,
  },
];

const VerProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroUnidad, setFiltroUnidad] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setProductos(productosFake);
  }, []);

  const productosFiltrados = productos.filter((p) => {
    if (filtroUnidad && p.unidad !== filtroUnidad) return false;
    const fecha = new Date(p.fechaIngreso);
    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;
    return true;
  });

  const eliminarProducto = (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const abrirModalEdicion = (producto: Producto) => {
    setEditProducto(producto);
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editProducto) return;
    const { name, value } = e.target;
    setEditProducto({ ...editProducto, [name]: name === "cantidad" || name === "precio" ? Number(value) : value });
  };

  const guardarCambios = () => {
    if (!editProducto) return;
    setProductos((prev) =>
      prev.map((p) => (p.id === editProducto.id ? editProducto : p))
    );
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Lista de Productos</h4>

      <div className="row mb-4 g-3 align-items-end">
        <div className="col-md-4">
          <SearchableSelect
            options={[
              { id: "Unidad", label: "Unidad" },
              { id: "Caja", label: "Caja" },
            ]}
            value={filtroUnidad}
            onChange={(val) => setFiltroUnidad(typeof val === "string" ? val : null)}
            placeholder="Filtrar por unidad"
            label="Unidad"
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
              setFiltroUnidad(null);
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              productosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.unidad}</td>
                  <td>{p.cantidad}</td>
                  <td>L. {p.precio.toFixed(2)}</td>
                  <td>
                    <div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => abrirModalEdicion(p)}
                        title="Editar producto"
                        style={{ minWidth: "70px", marginRight: "10px" }}
                      >
                        <i className="bi bi-pencil-fill me-1"></i>Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarProducto(p.id)}
                        title="Eliminar producto"
                        style={{ minWidth: "70px" }}
                      >
                        <i className="bi bi-trash-fill me-1"></i>Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Editar Producto" size="xl">
        {editProducto && (
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Código</label>
                <input
                  type="text"
                  name="codigo"
                  className="form-control"
                  value={editProducto.codigo}
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
                  value={editProducto.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Unidad</label>
                <input
                  name="unidad"
                  className="form-control"
                  value={editProducto.unidad}
                  onChange={handleChange}
                  placeholder="Unidad"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Cantidad</label>
                <input
                  name="cantidad"
                  type="number"
                  className="form-control"
                  value={editProducto.cantidad}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Precio</label>
                <input
                  name="precio"
                  type="number"
                  className="form-control"
                  value={editProducto.precio}
                  onChange={handleChange}
                />
              </div>
            </div>

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

export default VerProductos;
