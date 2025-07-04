import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroBeneficiario = ({
  mostrarModal,
  setMostrarModal,
  nuevoBeneficiario,
  manejarCambioInput,
  agregarBeneficiario,
  errorCarga,
}) => {
  // Validation for letters only (Nombre and Apellido)
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

  // Validation for numbers only (Telefono, Cedula, and IDContratos)
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
      nuevoBeneficiario.Nombre.trim() !== "" &&
      nuevoBeneficiario.Apellido.trim() !== "" &&
      nuevoBeneficiario.Cedula.trim() !== "" &&
      nuevoBeneficiario.Telefono.trim() !== "" &&
      nuevoBeneficiario.IDContratos.trim() !== ""
    );
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Beneficiario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Beneficiario</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoBeneficiario.Nombre}
              onChange={manejarCambioInput}
              onKeyDown={validarLetras}
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
              value={nuevoBeneficiario.Apellido}
              onChange={manejarCambioInput}
              onKeyDown={validarLetras}
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
              value={nuevoBeneficiario.Cedula}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cédula (máx. 14 caracteres)"
              maxLength={14}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono del Beneficiario</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoBeneficiario.Telefono}
              onChange={manejarCambioInput}
              onKeyDown={validarNumeros}
              placeholder="Ingresa el teléfono (8 dígitos)"
              maxLength={8}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIDContratos">
            <Form.Label>ID del Contrato</Form.Label>
            <Form.Control
              type="text"
              name="IDContratos"
              value={nuevoBeneficiario.IDContratos}
              onChange={manejarCambioInput}
              onKeyDown={validarNumeros}
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
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarBeneficiario}
          disabled={!validacionFormulario()}
        >
          Guardar Beneficiario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroBeneficiario;