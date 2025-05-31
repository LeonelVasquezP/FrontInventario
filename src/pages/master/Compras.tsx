import React, { useEffect, useState } from 'react';

interface Proveedor {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface DetalleCompra {
  producto_id: number;
  nombreProducto: string;
  cantidad: number;
  precio_unitario: number;
}

const Compras: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [proveedorId, setProveedorId] = useState<number | ''>('');
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);

  // Carga proveedores y productos
  useEffect(() => {
    fetch('http://localhost:3001/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(data))
      .catch(console.error);

    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  // Añadir producto al detalle
  const agregarProducto = (productoId: number) => {
    const prod = productos.find(p => p.id === productoId);
    if (!prod) return;

    // Evitar añadir producto si ya está
    if (detalles.some(d => d.producto_id === productoId)) {
      alert('Producto ya agregado');
      return;
    }

    setDetalles([...detalles, {
      producto_id: prod.id,
      nombreProducto: prod.nombre,
      cantidad: 1,
      precio_unitario: prod.precio,
    }]);
  };

  // Actualizar cantidad o precio
  const actualizarDetalle = (index: number, campo: 'cantidad' | 'precio_unitario', valor: number) => {
    const nuevosDetalles = [...detalles];
    if (campo === 'cantidad') nuevosDetalles[index].cantidad = valor;
    else if (campo === 'precio_unitario') nuevosDetalles[index].precio_unitario = valor;
    setDetalles(nuevosDetalles);
  };

  // Eliminar producto del detalle
  const eliminarDetalle = (index: number) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  // Calcular total
  const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0);

  // Enviar compra
  const enviarCompra = async () => {
    if (!proveedorId) {
      alert('Selecciona un proveedor');
      return;
    }
    if (detalles.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proveedor_id: proveedorId, detalles }),
      });

      if (!res.ok) throw new Error('Error al registrar compra');

      alert('Compra registrada con éxito');
      setProveedorId('');
      setDetalles([]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Registrar Compra</h2>
      <div className="form-group">
        <label>Proveedor:</label>
        <select className="form-control" value={proveedorId} onChange={e => setProveedorId(Number(e.target.value))}>
          <option value="">Seleccione un proveedor</option>
          {proveedores.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Agregar Producto:</label>
        <select className="form-control" onChange={e => agregarProducto(Number(e.target.value))} defaultValue="">
          <option value="" disabled>Seleccione un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} - Precio base: {p.precio.toFixed(2)}</option>
          ))}
        </select>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, i) => (
            <tr key={d.producto_id}>
              <td>{d.nombreProducto}</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  value={d.cantidad}
                  onChange={e => actualizarDetalle(i, 'cantidad', Number(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  step="0.01"
                  value={d.precio_unitario}
                  onChange={e => actualizarDetalle(i, 'precio_unitario', Number(e.target.value))}
                />
              </td>
              <td>{(d.cantidad * d.precio_unitario).toFixed(2)}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarDetalle(i)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {detalles.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">No hay productos agregados</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right"><strong>Total:</strong></td>
            <td><strong>{total.toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <button className="btn btn-primary" onClick={enviarCompra}>Registrar Compra</button>
    </div>
  );
};

export default Compras;
