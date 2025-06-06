import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/login/encabezado/Encabezado";
import Estadistica from "./views/Estadisticas";
import Clientes from "./views/Clientes";
import Beneficiarios from "./views/Beneficiarios";
import Agentes from "./views/Agentes";
import Contrato from "./views/Contrato.jsx";
import Modelos from "./views/Modelos.jsx";
import Servicios from "./views/Servicios.jsx";
import CatalogoModelo from "./components/busquedas/CatalogoModelo.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Facturas from "./views/Facturas.jsx";
import RutasProtegida from "./components/rutas/RutaProtegida.jsx";
import PiePagina from "./components/infopie/PiePagina.jsx";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Encabezado />
        <main className="margen-superior-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<RutasProtegida vista={<Inicio />} />} />
            <Route path="/clientes" element={<RutasProtegida vista={<Clientes />} />} />
            <Route path="/beneficiarios" element={<RutasProtegida vista={<Beneficiarios />} />} />
            <Route path="/agentes" element={<RutasProtegida vista={<Agentes />} />} />
            <Route path="/contrato" element={<RutasProtegida vista={<Contrato />} />} />
            <Route path="/modelos" element={<RutasProtegida vista={<Modelos />} />} />
            <Route path="/servicios" element={<RutasProtegida vista={<Servicios />} />} />
            <Route path="/catalogoModelo" element={<RutasProtegida vista={<CatalogoModelo />} />} />
            <Route path="/dashboard" element={<RutasProtegida vista={<Dashboard />} />} />
            <Route path="/estadisticas" element={<RutasProtegida vista={<Estadistica />} />} />
            <Route path="/facturas" element={<RutasProtegida vista={<Facturas />} />} />
          </Routes>
        </main>
        <PiePagina />
      </div>
    </Router>
  );
};

export default App;