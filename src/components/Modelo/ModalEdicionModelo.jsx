import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionModelo = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  modeloEditado,
  manejarCambioInputEdicion,
  actualizarModelo,
  errorCarga,
  enviando
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Modelo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={modeloEditado?.Nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre del ataúd (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Nombre del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="Modelo"
              value={modeloEditado?.Modelo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el modelo (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Modelo del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMedida">
            <Form.Label>Medida</Form.Label>
            <Form.Control
              type="text"
              name="Medida"
              value={modeloEditado?.Medida || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la medida (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Medida del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="Color"
              value={modeloEditado?.Color || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el color (máx. 20 caracteres)"
              maxLength={20}
              required
              aria-label="Color del ataúd"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImagenModelo">
            <Form.Label>Imagen</Form.Label>
            {modeloEditado?.imagen && (
              <div>
                <img
                  src={`data:image/png;base64,${modeloEditado.imagen}`}
                  alt="Imagen actual"
                  style={{ maxWidth: '100px', marginBottom: '10px' }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              name="imagen"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    manejarCambioInputEdicion({
                      target: { name: 'imagen', value: reader.result.split(',')[1] }
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
          onClick={() => setMostrarModalEdicion(false)}
          aria-label="Cancelar edición de modelo"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={actualizarModelo}
          disabled={enviando}
          aria-label="Guardar cambios del modelo"
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionModelo;