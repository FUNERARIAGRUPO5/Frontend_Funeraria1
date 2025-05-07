import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaAgente que recibe props
const TablaAgente = ({ 
  agentes, 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Agentes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>; // Muestra error si ocurre
  }

  // Verifica si agentes es un arreglo antes de usar map
  if (!Array.isArray(agentes) || agentes.length === 0) {
    return <div>No hay agentes para mostrar</div>; // Mensaje si no hay datos
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDAgente_co</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {agentes.map((agente) => (
            <tr key={agente.IDAgente_co}>
              <td>{agente.IDAgente_co}</td>
              <td>{agente.Nombre}</td>
              <td>{agente.Telefono}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(agente)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(agente)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// Exportación del componente
export default TablaAgente;