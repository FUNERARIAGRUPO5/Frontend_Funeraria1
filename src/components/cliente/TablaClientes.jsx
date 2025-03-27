// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({ clientes, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>IDcliente</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Direccion</th>
          <th>Cedula</th>
          <th>Telefono</th>

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
          
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaClientes;