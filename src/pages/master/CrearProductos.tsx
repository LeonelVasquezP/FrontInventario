import React, { useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';

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

interface CrearProductoProps {
  onAgregar?: (producto: Producto) => void;
  productoEditando?: Producto;
  onActualizar?: (producto: Producto) => void;
}

const CrearProductos: React.FC<CrearProductoProps> = ({ onAgregar, productoEditando, onActualizar }) => {
  const [form, setForm] = useState<Producto>(
    productoEditando || {
      nombre: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      codigo: '',
      unidad: '',
      ubicacion: '',
      fechaIngreso: '',
      proveedor: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productoEditando && onActualizar) {
      onActualizar(form);
    } else if (onAgregar) {
      onAgregar(form);
    }
    setForm({
      nombre: '', descripcion: '', cantidad: 0, precio: 0,
      codigo: '', unidad: '', ubicacion: '', fechaIngreso: '', proveedor: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row">
        <div className="col-md-4 mb-2">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="form-control" required />
        </div>
        <div className="col-md-4 mb-2">
          <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="form-control" required />
        </div>
        <div className="col-md-4 mb-2">
          <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código del producto" className="form-control" required />
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
        label={productoEditando ? 'Actualizar Producto' : 'Agregar Producto'}
        color={productoEditando ? '#ffc107' : '#28a745'}
        onClick={() => {}}
      />
      <button type="submit" style={{ display: 'none' }} />
    </form>
  );
};

export default CrearProductos;
