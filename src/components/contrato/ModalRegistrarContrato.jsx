import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroContrato = ({
  mostrarModal,
  setMostrarModal,
  nuevoContrato,
  manejarCambioInput,
  agregarContrato,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de un nuevo Contrato</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado del contrato</Form.Label>
            <Form.Control
              type="text"
              name="Estado"
              value={nuevoContrato.Estado}
              onChange={manejarCambioInput}
              placeholder="Ingresa el estado del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formCantidadBeneficiarios">
            <Form.Label>Cantidad de beneficiarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="CantidadBeneficiarios" // Corrección aquí
              value={nuevoContrato.CantidadBeneficiarios} // Corrección aquí
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad de beneficiarios (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formCuotas">
            <Form.Label>Cuotas</Form.Label>
            <Form.Control
              type="text"
              name="Cuotas"
              value={nuevoContrato.Cuotas}
              onChange={manejarCambioInput}
              placeholder="Ingresa las cuotas del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto del contrato</Form.Label>
            <Form.Control
              type="number"
              name="Monto"
              value={nuevoContrato.Monto}
              onChange={manejarCambioInput}
              placeholder="Ingresa el monto (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFecha_inicio">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              name="Fecha_inicio"
              value={nuevoContrato.Fecha_inicio}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFecha_fin">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              name="Fecha_fin"
              value={nuevoContrato.Fecha_fin}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIDcliente">
            <Form.Label>ID del cliente</Form.Label>
            <Form.Control
              type="text"
              name="IDCliente" // Corrección aquí
              value={nuevoContrato.IDCliente} // Corrección aquí
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del cliente (máx. 20 caracteres)"
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
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarContrato}>
          Guardar Contrato
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroContrato;