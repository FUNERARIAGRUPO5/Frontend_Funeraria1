import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroAgente = ({
  mostrarModal,
  setMostrarModal,
  nuevoAgente,
  manejarCambioInput,
  agregarAgente,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Agente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Agente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoAgente.Nombre}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
                  

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Telefono del Agente</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoAgente.Telefono}
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
        <Button variant="primary" onClick={agregarAgente}>
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAgente;