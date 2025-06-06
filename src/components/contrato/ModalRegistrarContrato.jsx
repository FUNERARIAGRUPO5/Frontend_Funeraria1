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
          
          <Form.Group className="mb-3" controlId="formCantidad_Beneficiarios">
            <Form.Label>Cantidad de beneficiarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Cantidad_Beneficiarios"
              value={nuevoContrato.Cantidad_Beneficiarios}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad de beneficiarios (máx. 20 caracteres)"
              maxLength={100}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formCuotas">
            <Form.Label>Cuotas</Form.Label>
            <Form.Control
              type="text"
              name="Cuotas"
              value={nuevoContrato.Cuotas}
              onChange={manejarCambioInput}
              placeholder="Ingresa las cuatoas del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMonto">
            <Form.Label>Monto del contrato</Form.Label>
            <Form.Control
              type="text"
              name="Monto"
              value={nuevoContrato.Monto}
              onChange={manejarCambioInput}
              placeholder="Ingresa el Monto (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFecha_inicio">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="text"
              name="Fecha_inicio"
              value={nuevoContrato.Fecha_inicio}
              onChange={manejarCambioInput}
              placeholder="Ingresa la fecha de creacion del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFecha_fin">
            <Form.Label>Fecha del fin</Form.Label>
            <Form.Control
              type="text"
              name="Fecha_fin"
              value={nuevoContrato.Fecha_fin}
              onChange={manejarCambioInput}
              placeholder="Ingresa la fecha de finalisacion del contrato (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIDcliente">
            <Form.Label>ID del cliente</Form.Label>
            <Form.Control
              type="text"
              name="IDcliente"
              value={nuevoContrato.IDcliente}
              onChange={manejarCambioInput}
              placeholder="Ingresa el ID del cliente (máx. 20 caracteres)"
              maxLength={20}
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
        <Button variant="secondary" onClick={() => {
          setMostrarModal(false);
        }}>
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