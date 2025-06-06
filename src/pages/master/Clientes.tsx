import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Cliente {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

// Datos simulados locales para mostrar
const clientesFake: Cliente[] = [
  { id: 1, nombre: 'Cliente A', direccion: 'Calle Falsa 123', telefono: '555-4321', correo: 'clientea@email.com' },
  { id: 2, nombre: 'Cliente B', direccion: 'Avenida Siempre Viva 742', telefono: '555-8765', correo: 'clienteb@email.com' },
  { id: 3, nombre: 'Cliente C', direccion: 'Boulevard Central 45', telefono: '555-2109', correo: 'clientec@email.com' },
];

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<Cliente>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setClientes(clientes.map(c => (c.id === editId ? { ...form, id: editId } : c)));
    } else {
      const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id || 0)) + 1 : 1;
      setClientes([...clientes, { ...form, id: newId }]);
    }
    setForm({ nombre: '', direccion: '', telefono: '', correo: '' });
    setEditId(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setForm(cliente);
    setEditId(cliente.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;

    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Clientes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="form-control mb-2"
        />
        <input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          className="form-control mb-2"
        />
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="form-control mb-2"
        />
        <input
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="form-control mb-2"
        />
        <ActionButton
          label={editId !== null ? 'Actualizar Cliente' : 'Agregar Cliente'}
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
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.correo}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(cliente)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(cliente.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No hay clientes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
