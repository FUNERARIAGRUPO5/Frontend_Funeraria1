import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaServicios = ({ 
  Servicios = [], 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  generarPDFDetalleServicio,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  if (cargando) {
    return <div>Cargando los servicios...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!Array.isArray(Servicios) || Servicios.length === 0) {
    return <div>No hay servicios disponibles</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Servicio</th>
            <th>Nombre del Servicio</th>
            <th>Código de Modelo</th>
            <th>Monto</th>
            <th>ID Modelo</th>
            <th>ID Contrato</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Servicios.map((servicio) => (
            <tr key={servicio.IDServicio_At}>
              <td>{servicio.IDServicio_At}</td>
              <td>{servicio.Nombre}</td>
              <td>{servicio.Codigo_de_Modelo}</td>
              <td>C$ {servicio.monto.toFixed(2)}</td>
              <td>{servicio.IDModelo}</td>
              <td>{servicio.ID_Contrato}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleServicio(servicio)}
                  aria-label={`Generar PDF para servicio ${servicio.Nombre}`}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(servicio)}
                  aria-label={`Eliminar servicio ${servicio.Nombre}`}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(servicio)}
                  aria-label={`Editar servicio ${servicio.Nombre}`}
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

export default TablaServicios;