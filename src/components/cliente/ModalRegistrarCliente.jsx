import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
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

  // Validation for numbers only (Telefono and Cedula)
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
      nuevoCliente.Nombre.trim() !== "" &&
      nuevoCliente.Apellido.trim() !== "" &&
      nuevoCliente.Direccion.trim() !== "" &&
      nuevoCliente.Cedula.trim() !== "" &&
      nuevoCliente.Telefono.trim() !== ""
    );
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={nuevoCliente.Nombre}
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
              value={nuevoCliente.Apellido}
              onChange={manejarCambioInput}
              onKeyDown={validarLetras}
              placeholder="Ingresa el Apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={nuevoCliente.Direccion}
              onChange={manejarCambioInput}
              placeholder="Ingresa la Dirección (máx. 150 caracteres)"
              maxLength={150}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Cedula"
              value={nuevoCliente.Cedula}
              onChange={manejarCambioInput}
              placeholder="Ingresa la Cédula (máx. 14 caracteres)"
              maxLength={14}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoCliente.Telefono}
              onChange={manejarCambioInput}
              onKeyDown={validarNumeros}
              placeholder="Ingresa el Teléfono (8 dígitos)"
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
          onClick={agregarCliente}
          disabled={!validacionFormulario()}
        >
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;