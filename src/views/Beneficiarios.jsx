// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';// Importa el componente de tabla
import { Container } from "react-bootstrap";
import TablaBeneficiarios from '../components/beneficiario/TabalBeneficiarios';

// Declaración del componente Clientes
const Beneficiarios = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaBeneficiarios, setListaBeneficiarios] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerBeneficiarios = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3001/api/Beneficiarios');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los Beneficiarios');
        }
        const datos = await respuesta.json();
        setListaBeneficiarios(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerBeneficiarios();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vezcd

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Beneficiarios</h4>

        {/* Pasa los estados como props al componente TablaClientes */}
        <TablaBeneficiarios 
          Beneficiarios={ListaBeneficiarios} 
          cargando={cargando} 
          error={errorCarga} 
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Beneficiarios;