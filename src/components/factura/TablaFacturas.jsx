import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaFacturas que recibe props
const TablaFacturas = ({
  Factura,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  generarPDFDetalleFactura,
  abrirModalEliminacion,
  abrirModalEdicion
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Facturas...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>IDFactura</th>
            <th>IDAgente_co</th>
            <th>NombreAgente</th>
            <th>IDContrato</th>
            <th>Cuotas pagadas</th>
            <th>Monto pagado</th>
            <th>NombreCliente</th>
            <th>Cuotas</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Factura.map((Factura) => (
            <tr key={Factura.IDFactura}>
              <td>{Factura.IDFactura}</td>
              <td>{Factura.IDAgente_co}</td>
              <td>{Factura.NombreAgente}</td>
              <td>{Factura.IDContrato}</td>
              <td>{Factura.Montopagado}</td>
              <td>{Factura.Cuotaspagadas}</td>
              
              <td>{Factura.NombreCliente}</td>
              <td>{Factura.Cuotas}</td>
              <td>{Factura.Monto}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => generarPDFDetalleFactura(Factura)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEliminacion(Factura)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(Factura)}
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
export default TablaFacturas;