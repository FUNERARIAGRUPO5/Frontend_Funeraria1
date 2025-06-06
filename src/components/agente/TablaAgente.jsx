import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaAgente = ({ 
  agentes, 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  generarPDFDetalleAgente,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  if (cargando) {
    return <div>Cargando Agentes...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!Array.isArray(agentes) || agentes.length === 0) {
    return <div>No hay agentes para mostrar</div>;
  }

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
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleAgente(agente)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
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

export default TablaAgente;