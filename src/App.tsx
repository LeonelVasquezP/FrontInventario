import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TopNavbar from './components/ComponentesReutilizables/TopNavbar';
import SideNavbar from './components/ComponentesReutilizables/SideNavbar';
import Footer from './components/ComponentesReutilizables/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import CrearProductos from './pages/master/CrearProductos';
import VerProductos from './pages/master/VerProductos';
import ProveedoresCrear from './pages/master/ProveedoresCrear';
import ProveedoresVer from './pages/master/ProveedoresVer';
import CrearCompra from './pages/master/CrearCompra';
import VerCompras from './pages/master/VerCompras';
import Stock from './pages/master/Stock';
import Clientes from './pages/master/Clientes';
import CrearRecibos from './pages/master/CrearRecibos';
import VerRecibos from './pages/master/VerRecibos';
import CrearDevolucionCliente from './pages/master/CrearDevolucionCliente';
import VerDevolucionesCliente from './pages/master/VerDevolucionesCliente';
import AlmacenComponent from './pages/master/Almacenes';
import Dashboard from './pages/master/Dashboard';
import Departamentos from './pages/master/Departamentos';
import Roles from './pages/master/Roles';
import Usuarios from './pages/master/Usuarios';
import Register from './pages/Registro';
import PedidosCrear from './pages/master/PedidosCrear';
import PedidosVer from './pages/master/PedidosVer';

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
                  
                  <Route path="/VerProductos" element={<VerProductos />} />
                  <Route path="/CrearProductos" element={<CrearProductos />} />
                  <Route path="/CrearCompra" element={<CrearCompra />} />
                  <Route path="/VerCompras" element={<VerCompras />} />
                   <Route path="/stock" element={<Stock />} />
                   <Route path="/clientes" element={<Clientes />} />
                   <Route path="/CrearRecibos" element={<CrearRecibos />} />
                   <Route path="/VerRecibos" element={<VerRecibos />} />
                   <Route path="/PedidosCrear" element={<PedidosCrear />} />
                   <Route path="/PedidosVer" element={<PedidosVer />} />
                    <Route path="/ProveedoresCrear" element={<ProveedoresCrear />} />
                   <Route path="/ProveedoresVer" element={<ProveedoresVer />} />
                  <Route path="/CrearDevolucionCliente" element={<CrearDevolucionCliente />} />
                  <Route path="/VerDevolucionesCliente" element={<VerDevolucionesCliente />} />
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