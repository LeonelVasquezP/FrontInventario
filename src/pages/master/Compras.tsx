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

interface Compra {
  id?: number;
  productoId: number;
  proveedorId: number;
  cantidad: number;
  fecha?: string;
}

const Compras: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Compra>({
    productoId: 0,
    proveedorId: 0,
    cantidad: 0
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      const [comprasRes, productosRes, proveedoresRes] = await Promise.all([
        fetch('http://localhost:3001/api/compras'),
        fetch('http://localhost:3001/api/productos'),
        fetch('http://localhost:3001/api/proveedores')
      ]);

      if (!comprasRes.ok || !productosRes.ok || !proveedoresRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [comprasData, productosData, proveedoresData] = await Promise.all([
        comprasRes.json(),
        productosRes.json(),
        proveedoresRes.json()
      ]);

      setCompras(comprasData);
      setProductos(productosData);
      setProveedores(proveedoresData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'cantidad' ? Number(e.target.value) : Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId !== null) {
        // Editar
        const res = await fetch(`http://localhost:3001/api/compras/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error al actualizar compra');
      } else {
        // Crear
        const res = await fetch('http://localhost:3001/api/compras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error al agregar compra');
      }

      setForm({ productoId: 0, proveedorId: 0, cantidad: 0 });
      setEditId(null);
      cargarDatos();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (compra: Compra) => {
    setForm({
      productoId: compra.productoId,
      proveedorId: compra.proveedorId,
      cantidad: compra.cantidad,
    });
    setEditId(compra.id || null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta compra?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/compras/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar compra');
      setCompras(compras.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const obtenerNombreProducto = (id: number) => productos.find(p => p.id === id)?.nombre || 'Desconocido';
  const obtenerNombreProveedor = (id: number) => proveedores.find(p => p.id === id)?.nombre || 'Desconocido';

  if (loading) return <p>Cargando compras...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Gestión de Compras</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select
          name="productoId"
          value={form.productoId}
          onChange={handleChange}
          className="form-control mb-2"
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
        >
          <option value={0}>Selecciona un proveedor</option>
          {proveedores.map(prov => (
            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
          ))}
        </select>

        <input
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="form-control mb-2"
        />

        <ActionButton
          label={editId !== null ? 'Actualizar Compra' : 'Registrar Compra'}
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map(compra => (
            <tr key={compra.id}>
              <td>{obtenerNombreProducto(compra.productoId)}</td>
              <td>{obtenerNombreProveedor(compra.proveedorId)}</td>
              <td>{compra.cantidad}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(compra)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(compra.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Compras;
