// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaContrato = ({ Contrato, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando los contratos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>IDContrato</th>
          <th>Estado</th>
          <th>Cantidad_Beneficiarios</th>
          <th>Cuotas</th>
          <th>Monto</th>
          <th>IDcliente</th>

        </tr>
      </thead>
      <tbody>
        {Contrato.map((Contrato) => (
          <tr key={Contrato.IDContrato}>
             <td>{Contrato.IDContrato}</td>
            <td>{Contrato.Estado}</td>
            <td>{Contrato.Cantidad_Beneficiarios}</td>
            <td>{Contrato.Cuotas}</td>
            <td>{Contrato.Monto}</td>
            <td>{Contrato.IDcliente}</td>
          
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaContrato;