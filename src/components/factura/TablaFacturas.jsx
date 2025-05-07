import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaFacturas que recibe props
const TablaFacturas = ({ Factura, cargando, error, totalElementos, elementosPorPagina, paginaActual, establecerPaginaActual }) => {
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
            <th>IDContrato</th>
            <th>Monto pagado</th>
            <th>Cuotas pagadas</th>
          </tr>
        </thead>
        <tbody>
          {Factura.map((Factura) => (
            <tr key={Factura.IDFactura}>
              <td>{Factura.IDFactura}</td>
              <td>{Factura.IDAgente_co}</td>
              <td>{Factura.IDContrato}</td>
              <td>{Factura.Monto_DEC}</td>
              <td>{Factura.Cuotas}</td>
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