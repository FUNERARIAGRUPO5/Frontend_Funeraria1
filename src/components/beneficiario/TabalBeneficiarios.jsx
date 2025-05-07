import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaBeneficiarios que recibe props
const TablaBeneficiarios = ({ 
  beneficiarios = [], 
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
    return <div>Cargando beneficiarios...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>; // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDBeneficiario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>IDContratos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(beneficiarios) && beneficiarios.length > 0 ? (
            beneficiarios.map((beneficiario) => (
              <tr key={beneficiario.IDBeneficiarios}>
                <td>{beneficiario.IDBeneficiarios}</td>
                <td>{beneficiario.Nombre}</td>
                <td>{beneficiario.Apellido}</td>
                <td>{beneficiario.Cedula}</td>
                <td>{beneficiario.Telefono}</td>
                <td>{beneficiario.IDContratos}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEliminacion(beneficiario)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => abrirModalEdicion(beneficiario)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay beneficiarios disponibles</td>
            </tr>
          )}
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
export default TablaBeneficiarios;