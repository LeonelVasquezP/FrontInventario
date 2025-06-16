import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';
import '../../assets/EstadoBadge.css';

interface Producto {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Pedido {
  id?: number;
  productoId: number;
  proveedorId: number;
  cantidad: number;
  fechaPedido?: string;
  estado: 'Pendiente' | 'Enviado' | 'Recibido';
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

// Datos simulados pedidos
const pedidosFake: Pedido[] = [
  { id: 1, productoId: 1, proveedorId: 1, cantidad: 50, fechaPedido: '2025-06-01', estado: 'Pendiente' },
  { id: 2, productoId: 2, proveedorId: 2, cantidad: 100, fechaPedido: '2025-06-02', estado: 'Enviado' },
];

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [form, setForm] = useState<Pedido>({
    productoId: 0,
    proveedorId: 0,
    cantidad: 0,
    estado: 'Pendiente',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simular carga datos
    setTimeout(() => {
      setPedidos(pedidosFake);
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
      setPedidos(pedidos.map(p => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      const newId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id || 0)) + 1 : 1;
      setPedidos([...pedidos, { ...form, id: newId, fechaPedido: new Date().toISOString().split('T')[0] }]);
    }
    setForm({ productoId: 0, proveedorId: 0, cantidad: 0, estado: 'Pendiente' });
    setEditId(null);
  };

  const handleEdit = (pedido: Pedido) => {
    setForm(pedido);
    setEditId(pedido.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const obtenerNombreProducto = (id: number) => productosFake.find(p => p.id === id)?.nombre || 'Desconocido';
  const obtenerNombreProveedor = (id: number) => proveedoresFake.find(p => p.id === id)?.nombre || 'Desconocido';

  return (
    <div>
      <h2>Gestión de Pedidos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select name="productoId" value={form.productoId} onChange={handleChange} className="form-control mb-2">
          <option value={0}>Selecciona un producto</option>
          {productosFake.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
        </select>

        <select name="proveedorId" value={form.proveedorId} onChange={handleChange} className="form-control mb-2">
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
          placeholder="Cantidad"
          className="form-control mb-2"
          required
        />

        <select name="estado" value={form.estado} onChange={handleChange} className="form-control mb-2">
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
          <option value="Recibido">Recibido</option>
        </select>

        <ActionButton
          label={editId !== null ? 'Actualizar Pedido' : 'Agregar Pedido'}
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
      <th>Fecha Pedido</th>
      <th>Estado</th>
      <th className="text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.map(pedido => (
      <tr key={pedido.id}>
        <td>{obtenerNombreProducto(pedido.productoId)}</td>
        <td>{obtenerNombreProveedor(pedido.proveedorId)}</td>
        <td>{pedido.cantidad}</td>
        <td>{pedido.fechaPedido}</td>
        <td>
        <span className={`badge-pill 
          ${pedido.estado === 'Pendiente' ? 'estado-pendiente' : ''}
          ${pedido.estado === 'Enviado' ? 'estado-enviado' : ''}
          ${pedido.estado === 'Recibido' ? 'estado-recibido' : ''}
        `}>
          {pedido.estado}
        </span>
      </td>

        <td className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <ActionButton
              label="Editar"
              onClick={() => handleEdit(pedido)}
              color="#0d6efd"
            />
            <ActionButton
              label="Eliminar"
              onClick={() => handleDelete(pedido.id!)}
              color="#dc3545"
            />
          </div>
        </td>
      </tr>
    ))}
    {pedidos.length === 0 && (
      <tr>
        <td colSpan={6} className="text-center text-muted py-3">
          No hay pedidos registrados
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Pedidos;
