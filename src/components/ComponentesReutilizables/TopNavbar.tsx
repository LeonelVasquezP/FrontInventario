import React from 'react';

const TopNavbar: React.FC = () => {
  return (
    <>
      {/* Estilos rápidos opcionales para el botón */}
      <style>
        {`
          .navbar-brand {
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .user-btn:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }
        `}
      </style>

      <nav className="navbar navbar-dark bg-primary fixed-top shadow-sm px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 fs-5 text-white">
            <i className="bi bi-grid-fill me-2"></i>
            SistAdmin
          </span>

          <div className="dropdown">
            <button
              className="btn btn-outline-light btn-sm dropdown-toggle user-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle me-1"></i> Usuario
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Perfil</a></li>
              <li><a className="dropdown-item" href="#">Cerrar sesión</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavbar;
