// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaAgente = ({ Agente_co, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Agentes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>IDAgente_co</th>
          <th>Nombre</th>
          <th>Telefono</th>

        </tr>
      </thead>
      <tbody>
        {Agente_co.map((Agente_co) => (
          <tr key={Agente_co.IDAgente_co}>
             <td>{Agente_co.IDAgente_co}</td>
             <td>{Agente_co.Nombre}</td>
            <td>{Agente_co.Telefono}</td>
          
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaAgente;