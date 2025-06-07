// src/pages/master/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
}

// const rolesFake = ['Administrador', 'Vendedor', 'Almacén'];

const usuariosFake: Usuario[] = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', rol: 'Administrador', estado: 'Activo' },
  { id: 2, nombre: 'Ana Torres', correo: 'ana@example.com', rol: 'Vendedor', estado: 'Inactivo' },
];

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>({
    nombre: '',
    correo: '',
    rol: '',
    estado: 'Activo',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUsuarios(usuariosFake);
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setUsuarios(usuarios.map(u => (u.id === editId ? { ...form, id: editId } : u)));
    } else {
      const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id || 0)) + 1 : 1;
      setUsuarios([...usuarios, { ...form, id: newId }]);
    }
    setForm({ nombre: '', correo: '', rol: '', estado: 'Activo' });
    setEditId(null);
  };

  const handleEdit = (usuario: Usuario) => {
    setForm(usuario);
    setEditId(usuario.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <form onSubmit={handleSubmit} className="bg-white border shadow-sm p-3 rounded mb-3">
        <div className="row g-2">
          <div className="col-md-3">
            <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Nombre" />
          </div>
          <div className="col-md-3">
            <input type="email" name="correo" value={form.correo} onChange={handleChange} className="form-control" placeholder="Correo" />
          </div>
          <div className="col-md-3">
            {/* <select name="rol" value={form.rol} onChange={handleChange} className="form-select">
              <option value="">Selecciona un rol</option>
              {rolesFake.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select> */}
          </div>
          <div className="col-md-2">
            {/* <select name="estado" value={form.estado} onChange={handleChange} className="form-select">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select> */}
          </div>
          <div className="col-md-1 d-grid">
            <ActionButton
              label={editId ? 'Actualizar' : 'Agregar'}
              color={editId ? '#ffc107' : '#28a745'}
              onClick={() => {}}
            />
            <button type="submit" style={{ display: 'none' }} />
          </div>
        </div>
      </form>

      <table className="table table-hover align-middle shadow-sm border rounded bg-white">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <span className={`badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                  {usuario.estado}
                </span>
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <ActionButton label="Editar" color="#0d6efd" onClick={() => handleEdit(usuario)} />
                  <ActionButton label="Eliminar" color="#dc3545" onClick={() => handleDelete(usuario.id!)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
