import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionServicio = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  servicioEditado,
  manejarCambioInputEdicion,
  actualizarServicio,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Servicio Funerario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Servicio</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={servicioEditado?.Nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre del servicio (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCodigoModelo">
            <Form.Label>Código de Modelo</Form.Label>
            <Form.Control
              type="text"
              name="Codigo_de_Modelo"
              value={servicioEditado?.Codigo_de_Modelo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el código de modelo (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="monto"
              value={servicioEditado?.monto || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el monto"
              min="0"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDModelo">
            <Form.Label>ID Modelo</Form.Label>
            <Form.Control
              type="number"
              name="IDModelo"
              value={servicioEditado?.IDModelo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el ID del modelo"
              min="1"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDContrato">
            <Form.Label>ID Contrato</Form.Label>
            <Form.Control
              type="number"
              name="ID_Contrato"
              value={servicioEditado?.ID_Contrato || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el ID del contrato"
              min="1"
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
        <Button variant="primary" onClick={actualizarServicio}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionServicio;
