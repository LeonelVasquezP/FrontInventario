import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
}

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Producto>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const cargarProductos = () => {
  fetch('http://localhost:3001/api/productos')
    .then(res => {
      if (!res.ok) throw new Error('Error al obtener productos');
      return res.json();
    })
    .then(data => {
      setProductos(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message || 'Error desconocido');
      setLoading(false);
    });
};

const actualizarProducto = () => {
  if (editId === null) return;

  fetch(`http://localhost:3001/api/productos/${editId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar producto');
      return res.json();
    })
    .then(() => {
      cargarProductos(); // cargar la lista actualizada
      setEditId(null);
      setForm({ nombre: '', descripcion: '', cantidad: 0, precio: 0 });
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
    });
};


  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'cantidad' || e.target.name === 'precio' ? Number(e.target.value) : e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editId !== null) {
      // Editar producto
      const res = await fetch(`http://localhost:3001/api/productos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al actualizar producto');
      
      await res.json();
      setEditId(null);
    } else {
      // Agregar producto
      const res = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al agregar producto');

      await res.json();
    }

    setForm({ nombre: '', descripcion: '', cantidad: 0, precio: 0 });
    cargarProductos(); // Refresca lista después de confirmar respuesta

  } catch (error: any) {
    alert(error.message);
  }
};



  const handleEdit = (producto: Producto) => {
    setForm(producto);
    setEditId(producto.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    fetch(`http://localhost:3001/api/productos/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar producto');
        setProductos(productos.filter(p => p.id !== id));
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

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
              <td>{Number(prod.precio).toFixed(2)}</td> 
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
