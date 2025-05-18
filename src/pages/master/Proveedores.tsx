import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
}

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState({ nombre: '', contacto: '' });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3001/api/proveedores/${editId}`
      : 'http://localhost:3001/api/proveedores';

    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar proveedor');
        return res.json();
      })
      .then(() => {
        cargarProveedores();
        setForm({ nombre: '', contacto: '' });
        setEditId(null);
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  };

  const handleEdit = (proveedor: Proveedor) => {
    setForm({ nombre: proveedor.nombre, contacto: proveedor.contacto });
    setEditId(proveedor.id || null);
    setError('');
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;

    fetch(`http://localhost:3001/api/proveedores/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar proveedor');
        return res.json();
      })
      .then(() => cargarProveedores())
      .catch(err => {
        alert(err.message);
      });
  };

  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Gestión de Proveedores</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="form-control mb-2"
        />
        <input
          name="contacto"
          value={form.contacto}
          onChange={handleChange}
          placeholder="Contacto"
          className="form-control mb-2"
        />
        <ActionButton
          label={editId !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => document.getElementById('submit-btn')?.click()}
        />
        <button id="submit-btn" type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(prov => (
            <tr key={prov.id}>
              <td>{prov.nombre}</td>
              <td>{prov.contacto}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(prov)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => prov.id && handleDelete(prov.id)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Proveedores;
