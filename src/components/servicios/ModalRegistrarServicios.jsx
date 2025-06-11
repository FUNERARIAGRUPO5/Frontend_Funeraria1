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
  // Validation for letters only (Nombre, Codigo_de_Modelo)
  const validarLetras = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 65 && charCode <= 90) && // Uppercase letters
      !(charCode >= 97 && charCode <= 122) && // Lowercase letters
      charCode !== 8 && // Backspace
      charCode !== 46 && // Delete
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Validation for numbers only (monto, IDModelo, ID_Contrato)
  const validarNumeros = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 48 && charCode <= 57) && // Numbers 0-9
      charCode !== 8 && // Backspace
      charCode !== 46 && // Delete
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Form validation to enable/disable submit button
  const validacionFormulario = () => {
    return (
      nuevoServicio.Nombre?.trim() !== "" &&
      nuevoServicio.Codigo_de_Modelo?.trim() !== "" &&
      nuevoServicio.monto?.toString().trim() !== "" &&
      nuevoServicio.IDModelo?.toString().trim() !== "" &&
      nuevoServicio.ID_Contrato?.toString().trim() !== ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarServicio();
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Servicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Servicio</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoServicio.Nombre || ""}
              onChange={manejarCambioInput}
              onKeyDown={validarLetras}
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
              onKeyDown={validarLetras}
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
              onKeyDown={validarNumeros}
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
              name="IDModelo"
              value={nuevoServicio.IDModelo || ""}
              onChange={manejarCambioInput}
              onKeyDown={validarNumeros}
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
              onKeyDown={validarNumeros}
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
          type="submit"
          onClick={handleSubmit}
          disabled={!validacionFormulario()}
          aria-label="Agregar nuevo servicio"
        >
          Guardar Servicio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAgregarServicio;