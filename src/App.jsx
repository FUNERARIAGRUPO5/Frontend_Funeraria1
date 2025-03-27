import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Cliente from "./views/Clientes"
import Encabezado from "./components/login/encabezado/Encabezado";// Barra de navegación superior
import Beneficiarios from "./views/Beneficiarios";
import Agentes from "./views/Agentes";
import Contrato from "./views/Contrato.jsx";
import './App.css'; 



const App = () => {
  return (
    <Router>
      <Encabezado/>
      <main className="margen-superior-main">
          <Routes>
 
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/Clientes" element={<Cliente/>} />
            <Route path="/Beneficiarios" element={<Beneficiarios/>} />
            <Route path="/Agentes" element={<Agentes/>} />
            <Route path="/Contrato" element={<Contrato/>} />

          </Routes>
      </main>
    </Router>
  );
};

export default App;