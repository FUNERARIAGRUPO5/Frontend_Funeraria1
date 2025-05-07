import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionContrato = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  contratoEditado,
  manejarCambioInputEdicion,
  actualizarContrato,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Contrato</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado del contrato</Form.Label>
            <Form.Control
              type="text"
              name="Estado"
              value={contratoEditado?.Estado || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el estado del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCantidad_Beneficiarios">
            <Form.Label>Cantidad de beneficiarios</Form.Label>
            <Form.Control
              type="number"
              name="Cantidad_Beneficiarios"
              value={contratoEditado?.Cantidad_Beneficiarios || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cantidad de beneficiarios"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCuotas">
            <Form.Label>Cuotas</Form.Label>
            <Form.Control
              type="number"
              name="Cuotas"
              value={contratoEditado?.Cuotas || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa las cuotas del contrato"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto del contrato</Form.Label>
            <Form.Control
              type="number"
              name="Monto"
              value={contratoEditado?.Monto || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el monto"
              step="0.01"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFecha_inicio">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              name="Fecha_inicio"
              value={contratoEditado?.Fecha_inicio || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la fecha de inicio"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFecha_fin">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              name="Fecha_fin"
              value={contratoEditado?.Fecha_fin || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la fecha de finalización"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIDcliente">
            <Form.Label>ID del cliente</Form.Label>
            <Form.Control
              type="number"
              name="IDcliente"
              value={contratoEditado?.IDcliente || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el ID del cliente"
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
        <Button variant="primary" onClick={actualizarContrato}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionContrato;