import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaBeneficiarios = ({ 
  beneficiarios = [], 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual,
  generarPDFDetalleBeneficiario,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  if (cargando) {
    return <div>Cargando beneficiarios...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!Array.isArray(beneficiarios) || beneficiarios.length === 0) {
    return <div>No hay beneficiarios disponibles</div>;
  }

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
          {beneficiarios.map((beneficiario) => (
            <tr key={beneficiario.IDBeneficiarios}>
              <td>{beneficiario.IDBeneficiarios}</td>
              <td>{beneficiario.Nombre}</td>
              <td>{beneficiario.Apellido}</td>
              <td>{beneficiario.Cedula}</td>
              <td>{beneficiario.Telefono}</td>
              <td>{beneficiario.IDContratos}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleBeneficiario(beneficiario)}
                  aria-label={`Generar PDF para beneficiario ${beneficiario.Nombre}`}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(beneficiario)}
                  aria-label={`Eliminar beneficiario ${beneficiario.Nombre}`}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(beneficiario)}
                  aria-label={`Editar beneficiario ${beneficiario.Nombre}`}
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

export default TablaBeneficiarios;