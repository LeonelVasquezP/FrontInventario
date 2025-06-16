import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';
import '../../assets/EstadoBadge.css';

// Si aún no lo hiciste, incluye los íconos en public/index.html:
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  codigo: string;
  unidad: string;
  ubicacion: string;
  fechaIngreso: string;
  proveedor: string;
}

const proveedores = ['Proveedor A', 'Proveedor B', 'Proveedor C'];

const productosFake: Producto[] = [
  {
    id: 1,
    nombre: 'Producto A',
    descripcion: 'Descripción A',
    cantidad: 10,
    precio: 25.5,
    codigo: 'A001',
    unidad: 'unidad',
    ubicacion: 'Estante 1',
    fechaIngreso: '2025-06-10',
    proveedor: 'Proveedor A'
  },
  {
    id: 2,
    nombre: 'Producto B',
    descripcion: 'Descripción B',
    cantidad: 5,
    precio: 12.0,
    codigo: 'B002',
    unidad: 'caja',
    ubicacion: 'Bodega',
    fechaIngreso: '2025-06-12',
    proveedor: 'Proveedor B'
  }
];

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Producto>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    codigo: '',
    unidad: '',
    ubicacion: '',
    fechaIngreso: '',
    proveedor: ''
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setProductos(productosFake), 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setProductos(prev => prev.map(p => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id || 0)) + 1 : 1;
      setProductos(prev => [...prev, { ...form, id: newId }]);
    }

    setForm({
      nombre: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      codigo: '',
      unidad: '',
      ubicacion: '',
      fechaIngreso: '',
      proveedor: ''
    });
    setEditId(null);
  };

  const handleEdit = (producto: Producto) => {
    setForm(producto);
    setEditId(producto.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 className="mb-3">Gestión de Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="form-control" />
          </div>
          <div className="col-md-4 mb-2">
            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="form-control" />
          </div>
          <div className="col-md-4 mb-2">
            <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código del producto" className="form-control" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-2">
            <input name="unidad" value={form.unidad} onChange={handleChange} placeholder="Unidad (ej. caja)" className="form-control" />
          </div>
          <div className="col-md-3 mb-2">
            <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="form-control" />
          </div>
          <div className="col-md-3 mb-2">
            <input name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-3 mb-2">
            <select name="proveedor" value={form.proveedor} onChange={handleChange} className="form-control">
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((prov, i) => (
                <option key={i} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mejora visual aquí */}
        <div className="row">
          <div className="col-md-6 mb-2">
            <label className="form-label fw-bold">
              <i className="bi bi-box-seam me-1 text-primary"></i> Cantidad
            </label>
            <input
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              className="form-control border border-primary"
            />
          </div>
          <div className="col-md-6 mb-2">
            <label className="form-label fw-bold">
              <i className="bi bi-cash-coin me-1 text-success"></i> Precio
            </label>
            <input
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              placeholder="Precio"
              className="form-control border border-success"
            />
          </div>
        </div>

        <ActionButton
          label={editId !== null ? 'Actualizar Producto' : 'Agregar Producto'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      {/* Tabla de productos */}
      <table className="table table-hover align-middle shadow-sm border rounded bg-white">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Código</th>
            <th>Unidad</th>
            <th>Ubicación</th>
            <th>Ingreso</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.codigo}</td>
              <td>{prod.unidad}</td>
              <td>{prod.ubicacion}</td>
              <td>{prod.fechaIngreso}</td>
              <td>{prod.proveedor}</td>
              <td>{prod.cantidad}</td>
              <td>${prod.precio.toFixed(2)}</td>
              <td>
                {prod.cantidad <= 5 ? (
                  <span className="estado-badge abastecer">
                    <span className="circle"></span> Abastecer
                  </span>
                ) : (
                  <span className="estado-badge ok">
                    <span className="circle"></span> OK
                  </span>
                )}
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <ActionButton label="Editar" onClick={() => handleEdit(prod)} color="#0d6efd" />
                  <ActionButton label="Eliminar" onClick={() => handleDelete(prod.id!)} color="#dc3545" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
