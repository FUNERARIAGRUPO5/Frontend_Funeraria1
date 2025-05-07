import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoCliente.Nombre}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Apellido"
              value={nuevoCliente.Apellido}
              onChange={manejarCambioInput}
              placeholder="Ingresa el Apellido (máx. 20 caracteres)"
              maxLength={100}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Direccion del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={nuevoCliente.Direccion}
              onChange={manejarCambioInput}
              placeholder="Ingresa la Direccion (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cedula del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Cedula"
              value={nuevoCliente.Cedula}
              onChange={manejarCambioInput}
              placeholder="Ingresa la Cedula (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Telefono del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoCliente.Telefono}
              onChange={manejarCambioInput}
              placeholder="Ingresa el Telefono (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setMostrarModal(false);
        }}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarCliente}>
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;