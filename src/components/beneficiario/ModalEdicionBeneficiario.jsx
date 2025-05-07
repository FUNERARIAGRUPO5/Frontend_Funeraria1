import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionBeneficiario = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  beneficiarioEditado,
  manejarCambioInputEdicion,
  actualizarBeneficiario,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Beneficiario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Beneficiario</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={beneficiarioEditado?.Nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Apellido"
              value={beneficiarioEditado?.Apellido || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula del Beneficiario</Form.Label>
            <Form.Control
              type="text"
              name="Cedula"
              value={beneficiarioEditado?.Cedula || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cédula (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono del Beneficiario</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={beneficiarioEditado?.Telefono || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el teléfono (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDContratos">
            <Form.Label>ID del Contrato</Form.Label>
            <Form.Control
              type="text"
              name="IDContratos"
              value={beneficiarioEditado?.IDContratos || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el ID del contrato (máx. 10 caracteres)"
              maxLength={10}
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
        <Button variant="primary" onClick={actualizarBeneficiario}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionBeneficiario;