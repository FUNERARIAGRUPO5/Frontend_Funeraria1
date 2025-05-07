import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionAgente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  agenteEditado,
  manejarCambioInputEdicion,
  actualizarAgente,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Agente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Agente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={agenteEditado?.Nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono del Agente</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={agenteEditado?.Telefono || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el teléfono (máx. 20 caracteres)"
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
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarAgente}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionAgente;