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
              value={nuevoBeneficiario.Telefono}
              onChange={manejarCambioInput}
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
              value={nuevoBeneficiario.IDContratos}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del contrato (máx. 10 caracteres)"
              maxLength={10}
              required
            />
              <Form.Control
    type="file"
    name="imagen"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          manejarCambioInput({
            target: { name: 'imagen', value: reader.result.split(',')[1] } // Extrae solo la parte Base64
          });
        };
        reader.readAsDataURL(file);
      }
    }}
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
          onClick={() => {
            setMostrarModal(false);
          }}
        >
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarBeneficiario}>
          Guardar Beneficiario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroBeneficiario;
