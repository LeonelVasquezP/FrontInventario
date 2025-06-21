import React, { useState } from "react";

interface Proveedor {
  codigo: string;
  nombre: string;
  rtn: string;
  direccion: string;
  correo: string;
  telefono: string;
  contacto: string;
  tipo: "Nacional" | "Internacional";
  estado: "Activo" | "Inactivo";
  fechaRegistro: string;
  observaciones: string;
  metodoPago: "Transferencia" | "Efectivo" | "Crédito";
}

const ProveedoresCrear: React.FC = () => {
  const [form, setForm] = useState<Proveedor>({
    codigo: "",
    nombre: "",
    rtn: "",
    direccion: "",
    correo: "",
    telefono: "",
    contacto: "",
    tipo: "Nacional",
    estado: "Activo",
    fechaRegistro: "",
    observaciones: "",
    metodoPago: "Transferencia",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Proveedor registrado:", form);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-person-plus me-2"></i> Registrar Proveedor
      </h3>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4 mb-4">
          <label htmlFor="codigo" className="form-label">
            Código del Proveedor
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

        <div className="col-md-8 mb-4">
          <label htmlFor="nombre" className="form-label">
            Nombre del Proveedor
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="rtn" className="form-label">
            RTN
          </label>
          <input
            type="text"
            id="rtn"
            name="rtn"
            className="form-control"
            value={form.rtn}
            onChange={handleChange}
            placeholder="RTN"
          />
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            className="form-control"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Número telefónico"
          />
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="correo" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            className="form-control"
            value={form.correo}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="col-12 mb-4">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="form-control"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección completa"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label htmlFor="contacto" className="form-label">
            Nombre del Contacto
          </label>
          <input
            type="text"
            id="contacto"
            name="contacto"
            className="form-control"
            value={form.contacto}
            onChange={handleChange}
            placeholder="Nombre del contacto"
          />
        </div>

        <div className="col-md-6 mb-4">
          <label htmlFor="tipo" className="form-label">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            className="form-select"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="Nacional">Nacional</option>
            <option value="Internacional">Internacional</option>
          </select>
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="estado" className="form-label">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            className="form-select"
            value={form.estado}
            onChange={handleChange}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="metodoPago" className="form-label">
            Método de Pago
          </label>
          <select
            id="metodoPago"
            name="metodoPago"
            className="form-select"
            value={form.metodoPago}
            onChange={handleChange}
            required
          >
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Crédito">Crédito</option>
          </select>
        </div>

        <div className="col-md-4 mb-4">
          <label htmlFor="fechaRegistro" className="form-label">
            Fecha de Registro
          </label>
          <input
            type="date"
            id="fechaRegistro"
            name="fechaRegistro"
            className="form-control"
            value={form.fechaRegistro}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 mb-4">
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            className="form-control"
            rows={3}
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones adicionales"
          />
        </div>

        <div className="col-12 text-end mt-4">
          <button type="submit" className="btn btn-success px-4">
            <i className="bi bi-check2-circle me-2"></i> Guardar Proveedor
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProveedoresCrear;