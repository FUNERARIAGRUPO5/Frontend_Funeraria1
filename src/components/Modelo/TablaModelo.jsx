import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaModelo = ({ 
  modelos, 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  generarPDFDetalleModelo,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  if (cargando) {
    return <div>Cargando modelos...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDModelo</th>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Medida</th>
            <th>Color</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map((modelo) => (
            <tr key={modelo.IDModelo}>
              <td>{modelo.IDModelo}</td>
              <td>{modelo.Nombre}</td>
              <td>{modelo.Modelo}</td>
              <td>{modelo.Medida}</td>
              <td>{modelo.Color}</td>
              <td>
                {modelo.imagen ? (
                  <img
                    src={`data:image/png;base64,${modelo.imagen}`}
                    alt={modelo.Nombre}
                    style={{ maxWidth: '100px' }}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleModelo(modelo)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(modelo)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(modelo)}
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

export default TablaModelo;