import path from 'path';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/compras', label: 'Compras', icon: 'bi-bag' },
  { path: '/pedidos', label: 'Pedidos', icon: 'bi-truck' },
  { path: '/recibidos', label: 'Recibidos', icon: 'bi-box-arrow-in-down' },
  { path: '/devoluciones', label: 'Devoluciones', icon: 'bi-arrow-counterclockwise' },
  { path: '/stock', label: 'Stock', icon: 'bi-box-seam' },
  { path: '/proveedores', label: 'Proveedores', icon: 'bi-people' },
  { path: '/productos', label: 'Productos', icon: 'bi-cart3' },
  { path: '/almacenes', label: 'Almacenes', icon: 'bi-building' },
  { path: '/clientes', label: 'Clientes', icon: 'bi-person' },
  { path: '/usuarios', label: 'Administración', icon: 'bi-gear' },
  {path: '/departamentos', label: 'Departamentos', icon: 'bi-briefcase' },
  {path: '/roles', label: 'Roles', icon: 'bi-shield-lock' },
  // {path: '/usuarios', label: 'Usuarios', icon: 'bi-person-circle' },
];

const SideNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {/* Estilo embebido para hover */}
      <style>
        {`
          .hover-bg:hover {
            background-color: #334155 !important;
            color: white !important;
          }
        `}
      </style>

      <aside
        className="position-fixed vh-100 d-flex flex-column shadow-sm"
        style={{ width: '220px', top: '56px', backgroundColor: '#1e293b' }}
      >
        <div className="px-3 pt-4 pb-2">
          <ul className="nav flex-column">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li className="nav-item mb-1" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link d-flex justify-content-between align-items-center rounded px-3 py-2 ${
                      isActive
                        ? 'bg-primary text-white fw-semibold'
                        : 'text-light hover-bg'
                    }`}
                    style={{
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{item.label}</span>
                    <i className={`bi ${item.icon}`} style={{ fontSize: '1rem' }}></i>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideNavbar;
