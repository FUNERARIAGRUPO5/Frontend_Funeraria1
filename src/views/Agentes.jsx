// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';// Importa el componente de tabla
import { Container } from "react-bootstrap";
import TablaAgente from '../components/agente/TablaAgente';

// Declaración del componente Clientes
const Agentes = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaAgente, setListaAgentes] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerAgentes = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3001/api/Agentes');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los Agentes');
        }
        const datos = await respuesta.json();
        setListaAgentes(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerAgentes();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Agente_co</h4>

        {/* Pasa los estados como props al componente TablaClientes */}
        <TablaAgente
          Agente_co={ListaAgente} 
          cargando={cargando} 
          error={errorCarga} 
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Agentes;