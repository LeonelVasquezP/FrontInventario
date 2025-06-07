import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Devolucion {
  id?: number;
  productoId: number;
  clienteId: number;
  cantidad: number;
  fecha: string;
  motivo: string;
}

interface Producto {
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

const productosFake: Producto[] = [
  { id: 1, nombre: 'Producto A' },
  { id: 2, nombre: 'Producto B' },
  { id: 3, nombre: 'Producto C' },
];

const clientesFake: Cliente[] = [
  { id: 1, nombre: 'Cliente X' },
  { id: 2, nombre: 'Cliente Y' },
  { id: 3, nombre: 'Cliente Z' },
];

const devolucionesFake: Devolucion[] = [
  { id: 1, productoId: 1, clienteId: 2, cantidad: 1, fecha: '2025-06-01', motivo: 'Producto dañado' },
  { id: 2, productoId: 3, clienteId: 1, cantidad: 2, fecha: '2025-06-05', motivo: 'Error en pedido' },
];

const Devoluciones: React.FC = () => {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<Devolucion>({
    productoId: 0,
    clienteId: 0,
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setProductos(productosFake);
      setClientes(clientesFake);
      setDevoluciones(devolucionesFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'productoId' || name === 'clienteId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setDevoluciones(devoluciones.map(d => (d.id === editId ? { ...form, id: editId } : d)));
    } else {
      const newId = devoluciones.length > 0 ? Math.max(...devoluciones.map(d => d.id || 0)) + 1 : 1;
      setDevoluciones([...devoluciones, { ...form, id: newId }]);
    }
    setForm({ productoId: 0, clienteId: 0, cantidad: 0, fecha: new Date().toISOString().split('T')[0], motivo: '' });
    setEditId(null);
  };

  const handleEdit = (devolucion: Devolucion) => {
    setForm({
      productoId: devolucion.productoId,
      clienteId: devolucion.clienteId,
      cantidad: devolucion.cantidad,
      fecha: devolucion.fecha,
      motivo: devolucion.motivo,
    });
    setEditId(devolucion.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar esta devolución?')) return;
    setDevoluciones(devoluciones.filter(d => d.id !== id));
  };

  const nombreProducto = (id: number) => productos.find(p => p.id === id)?.nombre || 'Desconocido';
  const nombreCliente = (id: number) => clientes.find(c => c.id === id)?.nombre || 'Desconocido';

  return (
    <div>
      <h2>Gestión de Devoluciones</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select
          name="productoId"
          value={form.productoId}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value={0}>Selecciona un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value={0}>Selecciona un cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <input
          name="cantidad"
          type="number"
          min={1}
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="form-control mb-2"
          required
        />

        <input
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        <textarea
          name="motivo"
          value={form.motivo}
          onChange={handleChange}
          placeholder="Motivo de la devolución"
          className="form-control mb-2"
          rows={3}
          required
        />

        <ActionButton
          label={editId !== null ? 'Actualizar Devolución' : 'Registrar Devolución'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table table-hover align-middle shadow-sm border rounded bg-white">
  <thead className="table-light">
    <tr>
      <th>Producto</th>
      <th>Cliente</th>
      <th>Cantidad</th>
      <th>Fecha</th>
      <th>Motivo</th>
      <th className="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {devoluciones.map(d => (
      <tr key={d.id}>
        <td>{nombreProducto(d.productoId)}</td>
        <td>{nombreCliente(d.clienteId)}</td>
        <td>{d.cantidad}</td>
        <td>{d.fecha}</td>
        <td className="text-muted">{d.motivo}</td>
        <td className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <ActionButton label="Editar" onClick={() => handleEdit(d)} color="#0d6efd" />
            <ActionButton label="Eliminar" onClick={() => handleDelete(d.id!)} color="#dc3545" />
          </div>
        </td>
      </tr>
    ))}
    {devoluciones.length === 0 && (
      <tr>
        <td colSpan={6} className="text-center text-muted py-3">
          No hay devoluciones registradas
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Devoluciones;
