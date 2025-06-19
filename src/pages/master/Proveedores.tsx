import React, { useEffect, useState } from 'react';
import ActionButton from '../../components/ComponentesReutilizables/ActionButton';
import '../../assets/EstadoBadge.css';

interface Proveedor {
  id?: number;
  codigo: string;
  nombre: string;
  rtn: string;
  direccion: string;
  correo: string;
  telefono: string;
  contacto: string;
  tipo: 'Nacional' | 'Internacional';
  estado: 'Activo' | 'Inactivo';
  fechaRegistro: string;
  observaciones: string;
  metodoPago: 'Transferencia' | 'Efectivo' | 'Crédito';
}

const proveedoresFake: Proveedor[] = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Proveedor A',
    rtn: '08011985123960',
    direccion: 'Calle Falsa 123',
    correo: 'a@proveedores.com',
    telefono: '555-1234',
    contacto: 'Juan Pérez',
    tipo: 'Nacional',
    estado: 'Activo',
    fechaRegistro: '2025-06-01',
    observaciones: 'Entrega en horario de 8am a 5pm',
    metodoPago: 'Transferencia',
  },
  {
    id: 2,
    codigo: 'P002',
    nombre: 'Proveedor B',
    rtn: '08011985234560',
    direccion: 'Avenida Siempre Viva 742',
    correo: 'b@proveedores.com',
    telefono: '555-5678',
    contacto: 'María López',
    tipo: 'Internacional',
    estado: 'Inactivo',
    fechaRegistro: '2025-05-15',
    observaciones: 'Solo pedidos mayores a $500',
    metodoPago: 'Crédito',
  },
];

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState<Proveedor>({
    codigo: '',
    nombre: '',
    rtn: '',
    direccion: '',
    correo: '',
    telefono: '',
    contacto: '',
    tipo: 'Nacional',
    estado: 'Activo',
    fechaRegistro: '',
    observaciones: '',
    metodoPago: 'Transferencia',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setProveedores(proveedoresFake), 500);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setProveedores((prev) =>
        prev.map((p) => (p.id === editId ? { ...form, id: editId } : p))
      );
    } else {
      const newId =
        proveedores.length > 0
          ? Math.max(...proveedores.map((p) => p.id || 0)) + 1
          : 1;
      setProveedores((prev) => [...prev, { ...form, id: newId }]);
    }

    setForm({
      codigo: '',
      nombre: '',
      rtn: '',
      direccion: '',
      correo: '',
      telefono: '',
      contacto: '',
      tipo: 'Nacional',
      estado: 'Activo',
      fechaRegistro: '',
      observaciones: '',
      metodoPago: 'Transferencia',
    });
    setEditId(null);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setForm(proveedor);
    setEditId(proveedor.id || null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
    setProveedores((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="main-content">
      <h2 className="mb-3">Gestión de Proveedores</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">

          <div className="col-md-3 mb-2">
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Código del proveedor"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del proveedor"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              name="rtn"
              value={form.rtn}
              onChange={handleChange}
              placeholder="RTN"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              placeholder="Nombre del contacto"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-3 mb-2">
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <select
              name="metodoPago"
              value={form.metodoPago}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <input
              type="date"
              name="fechaRegistro"
              value={form.fechaRegistro}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6 mb-2">
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Observaciones"
              className="form-control"
              rows={2}
            />
          </div>
        </div>

        <ActionButton
          label={editId !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
          color={editId !== null ? '#ffc107' : '#28a745'}
          onClick={() => {}}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table
          className="table table-hover align-middle shadow-sm border rounded bg-white"
          style={{ minWidth: '1200px' }}
        >
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>RTN</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Contacto</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Observaciones</th>
              <th>Método Pago</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.rtn}</td>
                <td>{p.direccion}</td>
                <td>{p.correo}</td>
                <td>{p.telefono}</td>
                <td>{p.contacto}</td>
                <td>{p.tipo}</td>
                <td>
                  {p.estado === 'Activo' ? (
                    <span className="estado-badge ok">
                      <span className="circle"></span> Activo
                    </span>
                  ) : (
                    <span className="estado-badge abastecer">
                      <span className="circle"></span> Inactivo
                    </span>
                  )}
                </td>
                <td>{p.fechaRegistro}</td>
                <td>{p.observaciones}</td>
                <td>{p.metodoPago}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <ActionButton
                      label="Editar"
                      onClick={() => handleEdit(p)}
                      color="#0d6efd"
                    />
                    <ActionButton
                      label="Eliminar"
                      onClick={() => p.id && handleDelete(p.id)}
                      color="#dc3545"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
