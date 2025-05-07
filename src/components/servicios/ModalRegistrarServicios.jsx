import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalAgregarServicio = ({
  mostrarModal,
  setMostrarModal,
  nuevoServicio,
  manejarCambioInput,
  agregarServicio,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Servicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formAtNombre">
            <Form.Label>Nombre del Servicio</Form.Label>
            <Form.Control
              type="text"
              name="At_Nombre"
              value={nuevoServicio.At_Nombre || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre del servicio (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Nombre del servicio"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCodigoModelo">
            <Form.Label>Código de Modelo</Form.Label>
            <Form.Control
              type="text"
              name="Codigo_de_Modelo"
              value={nuevoServicio.Codigo_de_Modelo || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el código de modelo (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Código de modelo"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="monto"
              value={nuevoServicio.monto || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el monto (mín. 0)"
              min={0}
              step="0.01"
              required
              aria-label="Monto del servicio"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDModelo">
            <Form.Label>ID Modelo</Form.Label>
            <Form.Control
              type="number"
              name="ID_Modelo"
              value={nuevoServicio.ID_Modelo || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del modelo (mín. 1)"
              min={1}
              required
              aria-label="ID del modelo"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDContrato">
            <Form.Label>ID Contrato</Form.Label>
            <Form.Control
              type="number"
              name="ID_Contrato"
              value={nuevoServicio.ID_Contrato || ""}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del contrato (mín. 1)"
              min={1}
              required
              aria-label="ID del contrato"
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
          aria-label="Cancelar agregar servicio"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarServicio}
          aria-label="Agregar nuevo servicio"
        >
          Agregar Servicio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAgregarServicio;