import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalAgregarModelo = ({
  mostrarModal,
  setMostrarModal,
  nuevoModelo,
  manejarCambioInput,
  agregarModelo,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Modelo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoModelo.Nombre || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre del ataúd (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Nombre del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="Modelo"
              value={nuevoModelo.Modelo || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el modelo (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Modelo del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMedida">
            <Form.Label>Medida</Form.Label>
            <Form.Control
              type="text"
              name="Medida"
              value={nuevoModelo.Medida || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa la medida (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Medida del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="Color"
              value={nuevoModelo.Color || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el color (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Color del ataúd"
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
          aria-label="Cancelar agregar modelo"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarModelo}
          aria-label="Agregar nuevo modelo"
        >
          Agregar Modelo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAgregarModelo;