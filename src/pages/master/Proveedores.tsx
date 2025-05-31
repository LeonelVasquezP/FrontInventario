import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Proveedor {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Proveedor>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarProveedores = () => {
    fetch('http://localhost:3001/api/proveedores')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener proveedores');
        return res.json();
      })
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error desconocido');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editId
        ? `http://localhost:3001/api/proveedores/${editId}`
        : 'http://localhost:3001/api/proveedores';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al guardar proveedor');

      await res.json();
      setForm({ nombre: '', direccion: '', telefono: '', correo: '' });
      setEditId(null);
      cargarProveedores();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (proveedor: Proveedor) => {
    setForm(proveedor);
    setEditId(proveedor.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;

    fetch(`http://localhost:3001/api/proveedores/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar proveedor');
        setProveedores(proveedores.filter(p => p.id !== id));
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

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
