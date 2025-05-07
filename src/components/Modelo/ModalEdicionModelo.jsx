import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionModelo = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  modeloEditado,
  manejarCambioInputEdicion,
  actualizarModelo,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Modelo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={modeloEditado?.Nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre del ataúd (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="Modelo"
              value={modeloEditado?.Modelo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el modelo (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMedida">
            <Form.Label>Medida</Form.Label>
            <Form.Control
              type="text"
              name="Medida"
              value={modeloEditado?.Medida || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la medida (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="Color"
              value={modeloEditado?.Color || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el color (máx. 20 caracteres)"
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
        <Button variant="primary" onClick={actualizarModelo}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionModelo;
