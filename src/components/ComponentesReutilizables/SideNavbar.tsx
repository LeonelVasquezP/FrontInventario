import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../../assets/Stylees.css";

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },

  {
    label: 'Compras',
    icon: 'bi-bag',
    submenu: [
      { path: '/CrearCompra', label: 'Crear Compra' },
      { path: '/VerCompras', label: 'Ver Compras' },
    ],
  },

  {
    label: 'Pedidos',
    icon: 'bi-truck',
    submenu: [
      { path: '/PedidosCrear', label: 'Crear Pedido' },
      { path: '/PedidosVer', label: 'Ver Pedidos' },
    ],
  },

  { path: '/recibidos', label: 'Recibidos', icon: 'bi-box-arrow-in-down' },
  { path: '/devoluciones', label: 'Devoluciones', icon: 'bi-arrow-counterclockwise' },
  { path: '/stock', label: 'Stock', icon: 'bi-box-seam' },

  {
    label: 'Proveedores',
    icon: 'bi-people',
    submenu: [
      { path: '/ProveedoresCrear', label: 'Crear Proveedor' },
      { path: '/ProveedoresVer', label: 'Ver Proveedores' },
    ],
  },

  { path: '/productos', label: 'Productos', icon: 'bi-cart3' },
  { path: '/almacenes', label: 'Almacenes', icon: 'bi-building' },
  { path: '/clientes', label: 'Clientes', icon: 'bi-person' },
  { path: '/usuarios', label: 'Administración', icon: 'bi-gear' },
  { path: '/departamentos', label: 'Departamentos', icon: 'bi-briefcase' },
  { path: '/roles', label: 'Roles', icon: 'bi-shield-lock' },
];

const SideNavbar: React.FC = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <aside
      className="position-fixed vh-100 d-flex flex-column shadow-sm"
      style={{ width: '220px', top: '56px', backgroundColor: '#1e293b' }}
    >
      <div className="px-3 pt-4 pb-2">
        <ul className="nav flex-column">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.submenu && item.submenu.some((sub) => location.pathname === sub.path));

            if (item.submenu) {
              const isOpen = openSubmenu === item.label;

              return (
                <li
                  className="nav-item mb-1 submenu-container"
                  key={item.label}
                  onMouseEnter={() => setOpenSubmenu(item.label)}
                  onMouseLeave={() => setOpenSubmenu(null)}
                >
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`nav-link d-flex justify-content-between align-items-center rounded px-3 py-2 w-100 text-start ${
                      isActive ? 'bg-primary text-white fw-semibold' : 'text-light'
                    }`}
                    style={{ background: 'none', border: 'none' }}
                  >
                    <span>{item.label}</span>
                    <i className={`bi ${item.icon}`} style={{ fontSize: '1rem' }}></i>
                  </button>

                  {isOpen && (
                    <ul className="nav flex-column submenu-flyout">
                      {item.submenu.map((sub) => (
                        <li key={sub.path}>
                          <Link
                            to={sub.path}
                            className={`nav-link px-3 py-1 rounded ${
                              location.pathname === sub.path
                                ? 'text-white fw-semibold bg-secondary'
                                : 'text-light'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li className="nav-item mb-1" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex justify-content-between align-items-center rounded px-3 py-2 ${
                    isActive ? 'bg-primary text-white fw-semibold' : 'text-light'
                  }`}
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
  );
};

export default SideNavbar;
