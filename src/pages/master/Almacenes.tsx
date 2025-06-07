import Modal from '../../components/Modal/Modal'; 
import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Almacen {
  id?: number;
  nombre: string;
  descripcion: string;
}

const almacenesFake: Almacen[] = [
  { id: 1, nombre: 'Bodega Central', descripcion: 'Almacén principal' },
  { id: 2, nombre: 'Bodega #2', descripcion: 'Suyapa' },
  { id: 3, nombre: 'Bodega #3', descripcion: 'San Pedro Sula' },
];

const AlmacenComponent: React.FC = () => {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [form, setForm] = useState<Almacen>({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAlmacenes(almacenesFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({ nombre: '', descripcion: '' });
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

    setForm({ nombre: '', descripcion: '' });
    setEditId(null);
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
          <p className="text-muted">Ubicaciones de tu inventario organizadas de forma moderna.</p>
        </div>
      </div>

      <div className="row g-4">
        {almacenes.map((almacen) => (
          <div key={almacen.id} className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: 40, height: 40 }}
                  >
                    <i className="bi bi-building"></i>
                  </div>
                  <h5 className="card-title mb-0">{almacen.nombre}</h5>
                </div>
                <p className="card-text text-muted">{almacen.descripcion}</p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
              <ActionButton label="✏️" onClick={() => openEditModal(almacen)} color="#ffc107" />
              <ActionButton label="🗑️" onClick={() => handleDelete(almacen.id!)} color="#dc3545" />

              </div>
            </div>
          </div>
        ))}

        {almacenes.length === 0 && (
          <div className="col-12 text-center text-muted">
            No hay almacenes registrados.
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{ right: '30px', bottom: '30px', width: '56px', height: '56px', zIndex: 1050 }}
        onClick={openAddModal}
      >
        <i className="bi bi-plus-lg"></i>
      </button>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editId !== null ? 'Editar Almacén' : 'Agregar Almacén'}
      >
        <div className="form-floating mb-3">
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre del almacén"
            required
          />
          <label htmlFor="nombre">Nombre del almacén</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-control"
            placeholder="Descripción"
            style={{ height: '100px' }}
            required
          />
          <label htmlFor="descripcion">Descripción</label>
        </div>
        <div className="text-end">
          <button className="btn btn-success" onClick={handleSubmit}>
            {editId !== null ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AlmacenComponent;
