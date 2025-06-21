import React, { useState } from "react";
import ActionButton from "../../components/ComponentesReutilizables/ActionButton";

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

const proveedores = ["Proveedor A", "Proveedor B", "Proveedor C"];

const CrearProducto: React.FC = () => {
  const [form, setForm] = useState<Producto>({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
    codigo: "",
    unidad: "",
    ubicacion: "",
    fechaIngreso: "",
    proveedor: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "cantidad" || name === "precio" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto registrado:", form);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-box me-2"></i> Registrar Producto
      </h3>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4 mb-3">
          <label htmlFor="codigo" className="form-label">
            Código
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            className="form-control"
            value={form.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
          />
        </div>

        <div className="col-md-8 mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            className="form-control"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción breve"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="unidad" className="form-label">
            Unidad
          </label>
          <input
            type="text"
            id="unidad"
            name="unidad"
            className="form-control"
            value={form.unidad}
            onChange={handleChange}
            placeholder="Unidad (ej. caja)"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="ubicacion" className="form-label">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            className="form-control"
            value={form.ubicacion}
            onChange={handleChange}
            placeholder="Estante, bodega, etc."
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="fechaIngreso" className="form-label">
            Fecha de Ingreso
          </label>
          <input
            type="date"
            id="fechaIngreso"
            name="fechaIngreso"
            className="form-control"
            value={form.fechaIngreso}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="proveedor" className="form-label">
            Proveedor
          </label>
          <select
            id="proveedor"
            name="proveedor"
            className="form-select"
            value={form.proveedor}
            onChange={handleChange}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((prov, index) => (
              <option key={index} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-3">
          <label htmlFor="cantidad" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            className="form-control"
            value={form.cantidad}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className="col-md-3 mb-3">
          <label htmlFor="precio" className="form-label">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            value={form.precio}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-success px-4">
            <i className="bi bi-check-circle me-2"></i> Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProducto;
