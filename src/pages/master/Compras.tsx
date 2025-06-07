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

// Datos simulados
const productosFake: Producto[] = [
  { id: 1, nombre: 'Producto A' },
  { id: 2, nombre: 'Producto B' },
  { id: 3, nombre: 'Producto C' },
];

const proveedoresFake: Proveedor[] = [
  { id: 1, nombre: 'Proveedor X' },
  { id: 2, nombre: 'Proveedor Y' },
  { id: 3, nombre: 'Proveedor Z' },
];

const comprasFake: Compra[] = [
  { id: 1, productoId: 1, proveedorId: 2, cantidad: 10 },
  { id: 2, productoId: 3, proveedorId: 1, cantidad: 5 },
];

const Compras: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Compra>({
    productoId: 0,
    proveedorId: 0,
    cantidad: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simula carga datos desde backend
    setTimeout(() => {
      setProductos(productosFake);
      setProveedores(proveedoresFake);
      setCompras(comprasFake);
    }, 300);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === 'cantidad' || e.target.name === 'productoId' || e.target.name === 'proveedorId'
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.productoId === 0 || form.proveedorId === 0 || form.cantidad <= 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    if (editId !== null) {
      // Actualizar compra local
      setCompras(
        compras.map(c =>
          c.id === editId ? { ...form, id: editId } : c
        )
      );
    } else {
      // Agregar nueva compra con id generado
      const newId = compras.length > 0 ? Math.max(...compras.map(c => c.id || 0)) + 1 : 1;
      setCompras([...compras, { ...form, id: newId }]);
    }

    setForm({ productoId: 0, proveedorId: 0, cantidad: 0 });
    setEditId(null);
  };

  const handleEdit = (compra: Compra) => {
    setForm({
      productoId: compra.productoId,
      proveedorId: compra.proveedorId,
      cantidad: compra.cantidad,
    });
    setEditId(compra.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Eliminar esta compra?')) return;

    setCompras(compras.filter(c => c.id !== id));
  };

  const obtenerNombreProducto = (id: number) =>
    productos.find(p => p.id === id)?.nombre || 'Desconocido';

  const obtenerNombreProveedor = (id: number) =>
    proveedores.find(p => p.id === id)?.nombre || 'Desconocido';

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
            <option key={prod.id} value={prod.id}>
              {prod.nombre}
            </option>
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
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <input
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="form-control mb-2"
          min={1}
        />

        <ActionButton
          label={editId !== null ? 'Actualizar Compra' : 'Registrar Compra'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

<table className="table table-hover shadow-sm bg-white rounded">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th>Proveedor</th>
              <th>Cantidad</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.length > 0 ? (
              compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{obtenerNombreProducto(compra.productoId)}</td>
                  <td>{obtenerNombreProveedor(compra.proveedorId)}</td>
                  <td>{compra.cantidad}</td>
                  <td className="text-center">
                    <ActionButton label="Editar"  onClick={() => handleEdit(compra)} color="#0d6efd" />
                    <ActionButton label="Eliminar"  onClick={() => handleDelete(compra.id!)} color="#dc3545" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No hay compras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  );
};

export default Compras;
