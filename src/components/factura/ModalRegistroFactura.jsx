import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroFactura = ({
  mostrarModal,
  setMostrarModal,
  nuevaFactura,
  manejarCambioInput,
  agregarFactura,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registro de una nueva Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formIDAgente_co">
            <Form.Label>ID del agente comercial</Form.Label>
            <Form.Control
              type="text"
              name="IDAgente_co"
              value={nuevaFactura.IDAgente_co}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del agente comercial (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formIDContrato">
            <Form.Label>ID del contrato</Form.Label>
            <Form.Control
              type="text"
              name="IDContrato"
              value={nuevaFactura.IDContrato}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formMonto_DEC">
            <Form.Label>Monto en decimal</Form.Label>
            <Form.Control
              type="text"
              name="Monto_DEC"
              value={nuevaFactura.Monto_DEC}
              onChange={manejarCambioInput}
              placeholder="Ingresa el monto en formato decimal (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCuotas">
            <Form.Label>Cuotas</Form.Label>
            <Form.Control
              type="text"
              name="Cuotas"
              value={nuevaFactura.Cuotas}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad de cuotas (máx. 20 caracteres)"
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
        <Button variant="secondary" onClick={() => {
          setMostrarModal(false);
        }}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarFactura}>
          Guardar Factura
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroFactura;
