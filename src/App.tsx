import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TopNavbar from './components/ComponentesReutilizables/TopNavbar';
import SideNavbar from './components/ComponentesReutilizables/SideNavbar';
import Footer from './components/ComponentesReutilizables/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Productos from './pages/master/Productos';
import Proveedores from './pages/master/Proveedores';

function App() {
  const [items, setItems] = useState([
    { title: "Progra Web", description: "Clase de los sábados" },
    { title: "Base de Datos", description: "Diseño y consultas SQL" },
    { title: "Redes", description: "Modelos OSI y TCP/IP" }
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <TopNavbar />
            <div style={{ display: "flex", flex: 1 }}>
              <SideNavbar />
              <div style={{ marginLeft: '220px', marginTop: '56px', padding: '20px', flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/home" element={<Home items={items} />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/proveedores" element={<Proveedores />} />
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
