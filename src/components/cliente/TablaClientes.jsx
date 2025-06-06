import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaClientes = ({ 
  clientes = [], 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  generarPDFDetalleCliente,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  if (cargando) {
    return <div>Cargando clientes...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!Array.isArray(clientes) || clientes.length === 0) {
    return <div>No hay clientes disponibles</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDcliente</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Direccion</th>
            <th>Cedula</th>
            <th>Telefono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.IDcliente}>
              <td>{cliente.IDcliente}</td>
              <td>{cliente.Nombre}</td>
              <td>{cliente.Apellido}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.Cedula}</td>
              <td>{cliente.Telefono}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleCliente(cliente)}
                  aria-label={`Generar PDF para cliente ${cliente.Nombre}`}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(cliente)}
                  aria-label={`Eliminar cliente ${cliente.Nombre}`}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(cliente)}
                  aria-label={`Editar cliente ${cliente.Nombre}`}
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

export default TablaClientes;