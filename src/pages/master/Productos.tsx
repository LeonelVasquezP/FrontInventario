import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
}

// Datos simulados locales para mostrar
const productosFake: Producto[] = [
  { id: 1, nombre: 'Producto A', descripcion: 'Descripción A', cantidad: 10, precio: 25.5 },
  { id: 2, nombre: 'Producto B', descripcion: 'Descripción B', cantidad: 5, precio: 12.0 },
  { id: 3, nombre: 'Producto C', descripcion: 'Descripción C', cantidad: 20, precio: 8.75 },
];

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Producto>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simula carga de productos desde backend
    setTimeout(() => {
      setProductos(productosFake);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.name === 'cantidad' || e.target.name === 'precio' 
        ? Number(e.target.value) 
        : e.target.value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      // Actualizar producto en arreglo local
      setProductos(productos.map(p => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      // Agregar nuevo producto con id ficticio
      const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id || 0)) + 1 : 1;
      setProductos([...productos, { ...form, id: newId }]);
    }
    setForm({ nombre: '', descripcion: '', cantidad: 0, precio: 0 });
    setEditId(null);
  };

  const handleEdit = (producto: Producto) => {
    setForm(producto);
    setEditId(producto.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="form-control mb-2" />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="form-control mb-2" />
        <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" className="form-control mb-2" />
        <input name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="Precio" className="form-control mb-2" />
        <ActionButton
          label={editId !== null ? 'Actualizar Producto' : 'Agregar Producto'}
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
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.cantidad}</td>
              <td>{prod.precio.toFixed(2)}</td>
              <td>
                <ActionButton label="✏️" onClick={() => handleEdit(prod)} color="#ffc107" />
                <ActionButton label="🗑️" onClick={() => handleDelete(prod.id!)} color="#dc3545" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
