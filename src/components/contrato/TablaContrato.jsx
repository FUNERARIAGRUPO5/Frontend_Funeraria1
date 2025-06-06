import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaContrato = ({
  contratos,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  generarPDFDetalleContrato,
  abrirModalEliminacion,
  abrirModalEdicion
}) => {
  if (cargando) {
    return <div>Cargando los contratos...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDContrato</th>
            <th>Estado</th>
            <th>Cantidad_Beneficiarios</th>
            <th>Cuotas</th>
            <th>Monto</th>
            <th>Fecha_inicio</th>
            <th>Fecha_fin</th>
            <th>ID Cliente</th>
            <th>Nombre Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos.map((contrato) => (
            <tr key={contrato.IDContrato}>
              <td>{contrato.IDContrato}</td>
              <td>{contrato.Estado}</td>
              <td>{contrato.CantidadBeneficiarios}</td>
              <td>{contrato.Cuotas}</td>
              <td>C$ {contrato.Monto.toFixed(2)}</td>
              <td>{contrato.Fecha_inicio}</td>
              <td>{contrato.Fecha_fin}</td>
              <td>{contrato.IDCliente}</td>
              <td>{contrato.NombreCliente}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleContrato(contrato)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(contrato)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(contrato)}
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

export default TablaContrato;