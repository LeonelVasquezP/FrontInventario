import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Producto {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Recibido {
  id?: number;
  productoId: number;
  proveedorId: number;
  cantidad: number;
  fechaRecibido?: string;
}

// Datos simulados para productos y proveedores
const productosFake: Producto[] = [
  { id: 1, nombre: 'Producto A' },
  { id: 2, nombre: 'Producto B' },
];

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: 'Proveedor X' },
  { id: 2, nombre: 'Proveedor Y' },
];

// Datos simulados recibidos
const recibidosFake: Recibido[] = [
  { id: 1, productoId: 1, proveedorId: 1, cantidad: 20, fechaRecibido: '2025-06-03' },
  { id: 2, productoId: 2, proveedorId: 2, cantidad: 80, fechaRecibido: '2025-06-04' },
];

const Recibidos: React.FC = () => {
  const [recibidos, setRecibidos] = useState<Recibido[]>([]);
  const [form, setForm] = useState<Recibido>({
    productoId: 0,
    proveedorId: 0,
    cantidad: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simular carga datos
    setTimeout(() => {
      setRecibidos(recibidosFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'cantidad' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setRecibidos(recibidos.map(r => (r.id === editId ? { ...form, id: editId, fechaRecibido: r.fechaRecibido } : r)));
    } else {
      const newId = recibidos.length > 0 ? Math.max(...recibidos.map(r => r.id || 0)) + 1 : 1;
      setRecibidos([...recibidos, { ...form, id: newId, fechaRecibido: new Date().toISOString().split('T')[0] }]);
    }
    setForm({ productoId: 0, proveedorId: 0, cantidad: 0 });
    setEditId(null);
  };

  const handleEdit = (recibido: Recibido) => {
    setForm(recibido);
    setEditId(recibido.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de recibido?')) return;
    setRecibidos(recibidos.filter(r => r.id !== id));
  };

  const obtenerNombreProducto = (id: number) => productosFake.find(p => p.id === id)?.nombre || 'Desconocido';
  const obtenerNombreProveedor = (id: number) => proveedoresFake.find(p => p.id === id)?.nombre || 'Desconocido';

  return (
    <div>
      <h2>Gestión de Productos Recibidos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select name="productoId" value={form.productoId} onChange={handleChange} className="form-control mb-2" required>
          <option value={0}>Selecciona un producto</option>
          {productosFake.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
        </select>

        <select name="proveedorId" value={form.proveedorId} onChange={handleChange} className="form-control mb-2" required>
          <option value={0}>Selecciona un proveedor</option>
          {proveedoresFake.map(prov => (
            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
          ))}
        </select>

        <input
          name="cantidad"
          type="number"
          min={1}
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad recibida"
          className="form-control mb-2"
          required
        />

        <ActionButton
          label={editId !== null ? 'Actualizar Registro' : 'Agregar Registro'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Fecha Recibido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recibidos.map(rec => (
            <tr key={rec.id}>
              <td>{obtenerNombreProducto(rec.productoId)}</td>
              <td>{obtenerNombreProveedor(rec.proveedorId)}</td>
              <td>{rec.cantidad}</td>
              <td>{rec.fechaRecibido}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(rec)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(rec.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recibidos;
