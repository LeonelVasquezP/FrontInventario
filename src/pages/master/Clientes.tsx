import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal'; 

interface Cliente {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

const clientesFake: Cliente[] = [
  { id: 1, nombre: 'Cliente A', direccion: 'Calle Falsa 123', telefono: '555-4321', correo: 'clientea@email.com' },
  { id: 2, nombre: 'Cliente B', direccion: 'Avenida Siempre Viva 742', telefono: '555-8765', correo: 'clienteb@email.com' },
  { id: 3, nombre: 'Cliente C', direccion: 'Boulevard Central 45', telefono: '555-2109', correo: 'clientec@email.com' },
];

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<Cliente>({ nombre: '', direccion: '', telefono: '', correo: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({ nombre: '', direccion: '', telefono: '', correo: '' });
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (cliente: Cliente) => {
    setForm(cliente);
    setEditId(cliente.id || null);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.correo.trim()) return;

    if (editId !== null) {
      setClientes(prev =>
        prev.map(c => (c.id === editId ? { ...form, id: editId } : c))
      );
    } else {
      const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id || 0)) + 1 : 1;
      setClientes([...clientes, { ...form, id: newId }]);
    }

    setForm({ nombre: '', direccion: '', telefono: '', correo: '' });
    setEditId(null);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1"><i className="bi bi-person-fill me-2"></i>Gestión de Clientes</h3>
        </div>
      </div>

      <div className="row g-4">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="col-md-4">
            <div className="card shadow-sm rounded-4 border-0 h-100">
  <div className="card-body p-4">
    <div className="d-flex align-items-center mb-3">
      <div
        className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3"
        style={{ width: 50, height: 50 }}
      >
        <i className="bi bi-person-fill fs-4"></i>
      </div>
      <h5 className="card-title mb-0">{cliente.nombre}</h5>
    </div>
    <p className="mb-1 text-muted"><i className="bi bi-geo-alt-fill me-2"></i>{cliente.direccion}</p>
    <p className="mb-1 text-muted"><i className="bi bi-telephone-fill me-2"></i>{cliente.telefono}</p>
    <p className="mb-0 text-muted"><i className="bi bi-envelope-fill me-2"></i>{cliente.correo}</p>
  </div>
  <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2 px-4 pb-3" >
    <button 
      className="btn btn-outline-primary btn-sm px-3"
      onClick={() => openEditModal(cliente)} style={{ margin: '10px' }}
    >
      <i className="bi bi-pencil me-1"></i> Editar
    </button>
    <button
      className="btn btn-outline-danger btn-sm px-3"
      onClick={() => handleDelete(cliente.id!)} style={{ margin: '10px' }}
    >
      <i className="bi bi-trash me-1"></i> Eliminar
    </button>
  </div>
</div>
          </div>
        ))}
        {clientes.length === 0 && (
          <div className="col-12 text-center text-muted">
            No hay clientes registrados.
          </div>
        )}
      </div>

      {/* Botón flotante agregar */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow"
        style={{ right: '30px', bottom: '30px', width: '56px', height: '56px', zIndex: 1050 }}
        onClick={openAddModal}
      >
        <i className="bi bi-plus-lg fs-4 text-white"></i>
      </button>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editId !== null ? 'Editar Cliente' : 'Agregar Cliente'}
      >
        <div className="form-floating mb-3">
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
          <label htmlFor="nombre">Nombre</label>
        </div>
        <div className="form-floating mb-3">
          <input
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="form-control"
            placeholder="Dirección"
          />
          <label htmlFor="direccion">Dirección</label>
        </div>
        <div className="form-floating mb-3">
          <input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Teléfono"
          />
          <label htmlFor="telefono">Teléfono</label>
        </div>
        <div className="form-floating mb-3">
          <input
            id="correo"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo electrónico"
            required
          />
          <label htmlFor="correo">Correo electrónico</label>
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

export default Clientes;
