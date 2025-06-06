import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Proveedor {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

// Datos simulados locales para mostrar
const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: 'Proveedor A', direccion: 'Calle Falsa 123', telefono: '555-1234', correo: 'a@proveedores.com' },
  { id: 2, nombre: 'Proveedor B', direccion: 'Avenida Siempre Viva 742', telefono: '555-5678', correo: 'b@proveedores.com' },
  { id: 3, nombre: 'Proveedor C', direccion: 'Boulevard Central 45', telefono: '555-9012', correo: 'c@proveedores.com' },
];

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Proveedor>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
  });
  const [editId, setEditId] = useState<number | null>(null);


  useEffect(() => {
    setTimeout(() => {
      setProveedores(proveedoresFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setProveedores(proveedores.map(p => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      const newId = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id || 0)) + 1 : 1;
      setProveedores([...proveedores, { ...form, id: newId }]);
    }
    setForm({ nombre: '', direccion: '', telefono: '', correo: '' });
    setEditId(null);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setForm(proveedor);
    setEditId(proveedor.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;

    setProveedores(proveedores.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Proveedores</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="form-control mb-2" />
        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="form-control mb-2" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="form-control mb-2" />
        <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" className="form-control mb-2" />
        <ActionButton
          label={editId !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(prov => (
            <tr key={prov.id}>
              <td>{prov.nombre}</td>
              <td>{prov.direccion}</td>
              <td>{prov.telefono}</td>
              <td>{prov.correo}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(prov)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(prov.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Proveedores;
