import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Almacen {
  id?: number;
  nombre: string;
  descripcion: string;
}

// Datos simulados
const almacenesFake: Almacen[] = [
  { id: 1, nombre: 'Bodega Central', descripcion: 'Almacén principal ' },
  { id: 2, nombre: 'Bodega #2', descripcion: 'Suyapa' },
  { id: 3, nombre: 'Bodega #3', descripcion: 'SSan Pedro Sula' },
];

const AlmacenComponent: React.FC = () => {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [form, setForm] = useState<Almacen>({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setAlmacenes(almacenesFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setAlmacenes(almacenes.map(a => (a.id === editId ? { ...form, id: editId } : a)));
    } else {
      const newId = almacenes.length > 0 ? Math.max(...almacenes.map(a => a.id || 0)) + 1 : 1;
      setAlmacenes([...almacenes, { ...form, id: newId }]);
    }
    setForm({ nombre: '', descripcion: '' });
    setEditId(null);
  };

  const handleEdit = (almacen: Almacen) => {
    setForm(almacen);
    setEditId(almacen.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este almacén?')) return;
    setAlmacenes(almacenes.filter(a => a.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Almacenes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del almacén"
          className="form-control mb-2"
          required
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="form-control mb-2"
          rows={3}
          required
        />
        <ActionButton
          label={editId !== null ? 'Actualizar Almacén' : 'Agregar Almacén'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {almacenes.map(a => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.descripcion}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(a)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(a.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlmacenComponent;
