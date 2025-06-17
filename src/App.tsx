import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TopNavbar from './components/ComponentesReutilizables/TopNavbar';
import SideNavbar from './components/ComponentesReutilizables/SideNavbar';
import Footer from './components/ComponentesReutilizables/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Productos from './pages/master/Productos';
import Proveedores from './pages/master/Proveedores';
import Compras from './pages/master/Compras';
import Stock from './pages/master/Stock';
import Clientes from './pages/master/Clientes';
import Recibidos from './pages/master/Recibidos';
import Pedidos from './pages/master/Pedidos';
import Devoluciones from './pages/master/Devoluciones';
import AlmacenComponent from './pages/master/Almacenes';
import Dashboard from './pages/master/Dashboard';
import Departamentos from './pages/master/Departamentos';
import Roles from './pages/master/Roles';
import Usuarios from './pages/master/Usuarios';
import Register from './pages/Registro';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/*" element={
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <TopNavbar />
            <div style={{ display: "flex", flex: 1 }}>
              <SideNavbar />
              <div style={{ marginLeft: '220px', marginTop: '56px', padding: '20px', flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/proveedores" element={<Proveedores />} />
                  <Route path="/compras" element={<Compras />} />
                   <Route path="/stock" element={<Stock />} />
                   <Route path="/clientes" element={<Clientes />} />
                   <Route path="/recibidos" element={<Recibidos />} />
                   <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/devoluciones" element={<Devoluciones />} />
                  <Route path="/almacenes" element={<AlmacenComponent />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/departamentos" element={<Departamentos />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
