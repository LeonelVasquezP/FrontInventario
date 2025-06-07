import React, { useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Rol {
  id?: number;
  nombre: string;
  descripcion: string;
}

// Datos simulados iniciales
const rolesFake: Rol[] = [
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo al sistema' },
  { id: 2, nombre: 'Vendedor', descripcion: 'Acceso a ventas y reportes' },
  { id: 3, nombre: 'Almacén', descripcion: 'Gestión de inventario y recibidos' },
];

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>(rolesFake);
  const [form, setForm] = useState<Rol>({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert('El nombre del rol es obligatorio.');
      return;
    }

    if (editId !== null) {
      setRoles(roles.map(r => (r.id === editId ? { ...form, id: editId } : r)));
    } else {
      const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id || 0)) + 1 : 1;
      setRoles([...roles, { ...form, id: newId }]);
    }

    setForm({ nombre: '', descripcion: '' });
    setEditId(null);
  };

  const handleEdit = (rol: Rol) => {
    setForm(rol);
    setEditId(rol.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este rol?')) return;
    setRoles(roles.filter(r => r.id !== id));
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Roles</h2>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre del Rol</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Administrador"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={form.descripcion}
            onChange={handleChange}
            rows={2}
            placeholder="Descripción breve del rol"
          ></textarea>
        </div>

        <div className="d-flex justify-content-end">
          <ActionButton
            label={editId !== null ? 'Actualizar Rol' : 'Agregar Rol'}
            color={editId !== null ? '#ffc107' : '#28a745'}
            onClick={() => {}}
          />
        </div>
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table table-hover align-middle shadow-sm border rounded bg-white">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(rol => (
            <tr key={rol.id}>
              <td>{rol.nombre}</td>
              <td>{rol.descripcion}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <ActionButton label="Editar" onClick={() => handleEdit(rol)} color="#0d6efd" />
                  <ActionButton label="Eliminar" onClick={() => handleDelete(rol.id!)} color="#dc3545" />
                </div>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-muted">No hay roles registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
