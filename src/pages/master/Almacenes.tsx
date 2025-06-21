import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';

interface Almacen {
  id?: number;
  nombre: string;
  descripcion: string;
  administrador: string;
  cantidadProductos: number;
}

const almacenesFake: Almacen[] = [
  { id: 1, nombre: 'Bodega Central', descripcion: 'Almacén principal', administrador: 'Juan Pérez', cantidadProductos: 120 },
  { id: 2, nombre: 'Bodega Suyapa', descripcion: 'Suyapa', administrador: 'Luis Rodríguez', cantidadProductos: 85 },
  { id: 3, nombre: 'San Pedro Sula', descripcion: 'Sucursal norte', administrador: 'Ana Torres', cantidadProductos: 150 },
];

const AlmacenComponent: React.FC = () => {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [form, setForm] = useState<Almacen>({ nombre: '', descripcion: '', administrador: '', cantidadProductos: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAlmacenes(almacenesFake);
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'cantidadProductos' ? Number(e.target.value) : e.target.value });
  };

  const openAddModal = () => {
    setForm({ nombre: '', descripcion: '', administrador: '', cantidadProductos: 0 });
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (almacen: Almacen) => {
    setForm(almacen);
    setEditId(almacen.id || null);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.nombre.trim()) return;

    if (editId !== null) {
      setAlmacenes(prev =>
        prev.map(a => (a.id === editId ? { ...form, id: editId } : a))
      );
    } else {
      const newId = almacenes.length > 0 ? Math.max(...almacenes.map(a => a.id || 0)) + 1 : 1;
      setAlmacenes([...almacenes, { ...form, id: newId }]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este almacén?')) return;
    setAlmacenes(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1"><i className="bi bi-building me-2"></i>Gestión de Almacenes</h3>
          <p className="text-muted">Administra tus bodegas de manera organizada y visual.</p>
        </div>
      </div>

      <div className="row g-4">
        {almacenes.map((almacen) => (
          <div key={almacen.id} className="col-md-4 mb-4">
            <div className="card border-0 shadow rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <i className="bi bi-box-seam fs-4"></i>
                  </div>
                  <div className="ms-4">
                    <h5 className="mb-0">{almacen.nombre}</h5>
                  </div>
                </div>
                <p className="mb-2 text-muted"><i className="bi bi-person-fill me-2"></i>Administrador: {almacen.administrador}</p>
                <p className="mb-2 text-muted"><i className="bi bi-box-fill me-2"></i>Productos: {almacen.cantidadProductos}</p>
                <p className="text-muted"><i className="bi bi-card-text me-2"></i>{almacen.descripcion}</p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2 px-4 pb-3 mt-3">
                <button className="btn btn-primary btn-sm px-3" onClick={() => openEditModal(almacen)}>
                  <i className="bi bi-pencil me-1"></i>Editar
                </button>
                <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(almacen.id!)}>
                  <i className="bi bi-trash me-1"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {almacenes.length === 0 && (
          <div className="col-12 text-center text-muted">No hay almacenes registrados.</div>
        )}
      </div>

      <button
        className="btn btn-primary rounded-circle position-fixed shadow"
        style={{ right: '30px', bottom: '30px', width: '56px', height: '56px', zIndex: 1050 }}
        onClick={openAddModal}
      >
        <i className="bi bi-plus-lg fs-4 text-white"></i>
      </button>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editId !== null ? 'Editar Almacén' : 'Agregar Almacén'}
      >
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nombre del Almacén</label>
              <input
                name="nombre"
                className="form-control"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Bodega Central"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Administrador</label>
              <input
                name="administrador"
                className="form-control"
                value={form.administrador}
                onChange={handleChange}
                placeholder="Nombre del responsable"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Cantidad de Productos</label>
              <input
                type="number"
                name="cantidadProductos"
                className="form-control"
                value={form.cantidadProductos}
                onChange={handleChange}
                placeholder="Ej. 150"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción del almacén"
                rows={2}
              />
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-success" onClick={handleSubmit}>
              {editId !== null ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlmacenComponent;