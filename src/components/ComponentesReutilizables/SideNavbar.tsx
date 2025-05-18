import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";

function SideNavbar(){
    return(
    <div className="position-fixed vh-100 d-flex flex-column p-3"
     style={{ width: "220px", backgroundColor: "#001f3f", color: "white" }}>

            <ul className="nav flex-column mt-3">
                <li className="nav-item">
                <Link to="/" className="nav-link text-white">
                    <FaHome className="me-2" /> Dashboard
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Compras
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Recibidos
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Devoluciones
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Stock
                </Link>
                <Link to="/proveedores" className="nav-link text-white">
                  <FaHome className="me-2" /> Provedores
                </Link>
                <Link to="/productos" className="nav-link text-white">
                <FaHome className="me-2" /> Productos
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Almacenes
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Clientes
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Componentes Resividos
                </Link>
                <Link to="/" className="nav-link text-white">
                  <FaHome className="me-2" /> Componentes de Adminsitracion
                </Link>

                </li>
            </ul>
        </div>
    )
}

export default SideNavbar;