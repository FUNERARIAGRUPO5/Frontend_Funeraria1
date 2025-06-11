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
  // Validation for letters only (Nombre)
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

  // Validation for numbers only (Telefono)
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
      nuevoAgente.Nombre.trim() !== "" &&
      nuevoAgente.Telefono.trim() !== ""
    );
  };

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
              onKeyDown={validarLetras}
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
              value={nuevoAgente.Telefono}
              onChange={manejarCambioInput}
              onKeyDown={validarNumeros}
              placeholder="Ingresa el teléfono (8 dígitos)"
              maxLength={8}
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarAgente}
          disabled={!validacionFormulario()}
        >
          Guardar Agente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroAgente;