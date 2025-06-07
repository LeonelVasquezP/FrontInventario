import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Recibido {
  id?: number;
  productoId: number;
  proveedorId: number;
  cantidad: number;
  fecha: string;
}

interface Producto {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

const productosFake: Producto[] = [
  { id: 1, nombre: 'Producto A' },
  { id: 2, nombre: 'Producto B' },
  { id: 3, nombre: 'Producto C' },
];

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: 'Proveedor A' },
  { id: 2, nombre: 'Proveedor B' },
  { id: 3, nombre: 'Proveedor C' },
];

const recibidosFake: Recibido[] = [
  { id: 1, productoId: 1, proveedorId: 1, cantidad: 10, fecha: '2025-06-01' },
  { id: 2, productoId: 2, proveedorId: 3, cantidad: 5, fecha: '2025-06-03' },
];

const Recibidos: React.FC = () => {
  const [recibidos, setRecibidos] = useState<Recibido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Recibido>({
    productoId: 0,
    proveedorId: 0,
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setProductos(productosFake);
      setProveedores(proveedoresFake);
      setRecibidos(recibidosFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'productoId' || name === 'proveedorId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setRecibidos(recibidos.map(r => (r.id === editId ? { ...form, id: editId } : r)));
    } else {
      const newId = recibidos.length > 0 ? Math.max(...recibidos.map(r => r.id || 0)) + 1 : 1;
      setRecibidos([...recibidos, { ...form, id: newId }]);
    }
    setForm({ productoId: 0, proveedorId: 0, cantidad: 0, fecha: new Date().toISOString().split('T')[0] });
    setEditId(null);
  };

  const handleEdit = (recibido: Recibido) => {
    setForm({
      productoId: recibido.productoId,
      proveedorId: recibido.proveedorId,
      cantidad: recibido.cantidad,
      fecha: recibido.fecha,
    });
    setEditId(recibido.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar este registro de recibido?')) return;
    setRecibidos(recibidos.filter(r => r.id !== id));
  };

  const obtenerNombreProducto = (id: number) => productos.find(p => p.id === id)?.nombre || 'Desconocido';
  const obtenerNombreProveedor = (id: number) => proveedores.find(p => p.id === id)?.nombre || 'Desconocido';

  return (
    <div>
      <h2>Gestión de Recibidos (Mock)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select
          name="productoId"
          value={form.productoId}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value={0}>Selecciona un producto</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
        </select>

        <select
          name="proveedorId"
          value={form.proveedorId}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value={0}>Selecciona un proveedor</option>
          {proveedores.map(prov => (
            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
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

        <ActionButton
          label={editId !== null ? 'Actualizar Recibido' : 'Registrar Recibido'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

<table className="table table-hover align-middle shadow-sm border rounded bg-white">
  <thead className="table-light">
    <tr>
      <th>Producto</th>
      <th>Proveedor</th>
      <th>Cantidad</th>
      <th>Fecha</th>
      <th className="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {recibidos.map(recibido => (
      <tr key={recibido.id}>
        <td>{obtenerNombreProducto(recibido.productoId)}</td>
        <td>{obtenerNombreProveedor(recibido.proveedorId)}</td>
        <td>{recibido.cantidad}</td>
        <td>{recibido.fecha}</td>
        <td className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <ActionButton label="Editar" onClick={() => handleEdit(recibido)} color="#0d6efd" />
            <ActionButton label="Eliminar" onClick={() => handleDelete(recibido.id!)} color="#dc3545" />
          </div>
        </td>
      </tr>
    ))}
    {recibidos.length === 0 && (
      <tr>
        <td colSpan={5} className="text-center text-muted">No hay registros de recibidos.</td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Recibidos;
