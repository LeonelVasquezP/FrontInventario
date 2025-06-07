import React, { useState } from 'react';

const datosFicticios = [
  { id: 1, nombre: 'Finanzas', descripcion: 'Manejo de presupuestos y contabilidad', color: 'primary', icono: 'bi-cash-coin' },
  { id: 2, nombre: 'Recursos Humanos', descripcion: 'Gestión de personal y contrataciones', color: 'success', icono: 'bi-people-fill' },
  { id: 3, nombre: 'Tecnología', descripcion: 'Infraestructura y desarrollo de sistemas', color: 'info', icono: 'bi-cpu' },
  { id: 4, nombre: 'Marketing', descripcion: 'Publicidad y análisis de mercado', color: 'warning', icono: 'bi-bullseye' },
  { id: 5, nombre: 'Operaciones', descripcion: 'Logística y funcionamiento diario', color: 'danger', icono: 'bi-gear-fill' },
];

const Departamentos = () => {
  const [busqueda, setBusqueda] = useState('');

  const departamentosFiltrados = datosFicticios.filter(dep =>
    dep.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold"><i className="bi bi-diagram-3 me-2"></i>Departamentos</h4>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar departamento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {departamentosFiltrados.length > 0 ? (
          departamentosFiltrados.map(dep => (
            <div className="col-md-6 col-lg-4" key={dep.id}>
              <div className={`card border-start border-4 border-${dep.color} shadow-sm`}>
                <div className="card-body d-flex align-items-start">
                  <div className={`me-3 text-${dep.color}`}>
                    <i className={`bi ${dep.icono} fs-3`}></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1">{dep.nombre}</h5>
                    <p className="text-muted small mb-2">{dep.descripcion}</p>
                    <button className={`btn btn-outline-${dep.color} btn-sm me-2`}>
                      <i className="bi bi-pencil-square me-1"></i>Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No se encontraron departamentos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departamentos;
