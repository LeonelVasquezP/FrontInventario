import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';
import '../../assets/EstadoBadge.css';

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

const VerProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    setTimeout(() => setProductos(productosFake), 500);
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 className="mb-3">Listado de Productos</h2>

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

export default VerProductos;
