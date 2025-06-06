import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Spinner, Table } from 'react-bootstrap';

const ChatIA = ({ mostrarChatModal, setMostrarChatModal }) => {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setCargando(true);
    setRespuesta(null);
    setMensaje('');

    try {
      const prompt = `
        Genera una consulta SQL válida para un Data Mart con las siguientes tablas y relaciones:
        - dim_tiempo (IDTiempo INT, Fecha DATE, ano INT, mes INT, dia INT, trimestre INT, nombre_mes VARCHAR(20), dia_semana VARCHAR(20))
        - dimension_contrato (IDContrato INT, estado VARCHAR(50), Cantidad_Beneficiarios VARCHAR(50), Cuotas VARCHAR(50), Monto INT, Fecha_Inicio VARCHAR(45), Fecha_Fin VARCHAR(45), IDCliente INT, IDTiempo INT, IDBeneficiarios INT, IDAgente_co INT, IDServicio_AT INT)
        - dimension_agente_cobra (IDAgente_co INT, Nombre VARCHAR(50), Telefono VARCHAR(10))
        - dimension_beneficiarios (IDBeneficiarios INT, Nombre VARCHAR(20), Apellido VARCHAR(20), Cedula CHAR(20), Telefono DECIMAL(20,0))
        - dimension_cliente (IDCliente INT, Nombre VARCHAR(50), Apellido VARCHAR(50), Direccion VARCHAR(50), Cedula VARCHAR(50), Telefono VARCHAR(10))
        - dimension_servicio (IDServicio_AT INT, Codigo_de_Modelo CHAR(10), Monto INT, Nombre VARCHAR(20), IDmodelo INT)
        - hecho_venta (IDContrato INT, IDAgente_co INT, IDCliente INT, IDServicio_AT INT, NumFacturas INT, Agentes VARCHAR(25), Cliente VARCHAR(255), Fecha INT)
        Relaciones:
        - hecho_venta.IDContrato -> dimension_contrato.IDContrato
        - hecho_venta.IDAgente_co -> dimension_agente_cobra.IDAgente_co
        - hecho_venta.IDCliente -> dimension_cliente.IDCliente
        - hecho_venta.IDServicio_AT -> dimension_servicio.IDServicio_AT
        - dimension_contrato.IDTiempo -> dim_tiempo.IDTiempo
        - dimension_contrato.IDBeneficiarios -> dimension_beneficiarios.IDBeneficiarios
        Instrucciones:
        - Toma en cuenta que son consultas SQL para MySQL.
        - Usa solo las columnas listadas en cada tabla.
        - Asegúrate de que los JOINs sean correctos y utilicen las claves foráneas especificadas.
        - Si se solicita información de múltiples tablas, usa JOINs explícitos.
        - No generes subconsultas complejas ni funciones avanzadas a menos que sean explícitamente solicitadas.
        - Devuelve la consulta SQL en una sola línea, sin saltos de línea, comillas triples, ni formato adicional.
        Pregunta del usuario: "${mensaje}"
      `;

      const apiKey = import.meta.env.VITE_API_KEY; // Ajusta según tu entorno (Vite o CRA)
      if (!apiKey) throw new Error('Clave de API no configurada');

      const respuestaGemini = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'text/plain' },
          }),
        }
      );

      if (!respuestaGemini.ok) {
        const errorText = await respuestaGemini.text();
        throw new Error(`Error en Gemini API: ${errorText}`);
      }

      const datosGemini = await respuestaGemini.json();
      const consultaSQL = datosGemini.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!consultaSQL || !consultaSQL.trim().startsWith('SELECT') || consultaSQL.match(/(DROP|DELETE|UPDATE)/i)) {
        throw new Error('Consulta SQL generada inválida o insegura. SOLO SE PUEDEN REALIZAR CONSULTAS SELECT.');
      }

      const response = await fetch('http://localhost:3007/ia/consultarconia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultaSQL }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el backend: ${errorText}`);
      }

      const resultadoConsulta = await response.json();
      setRespuesta({
        usuario: mensaje,
        ia: resultadoConsulta.resultados || 'No se encontraron resultados.',
      });
    } catch (error) {
      console.error('Error:', error);
      setRespuesta({
        usuario: mensaje,
        ia: `Error: ${error.message}`,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={mostrarChatModal} onHide={() => setMostrarChatModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Consulta al Data Mart con IA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {respuesta && (
          <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <ListGroup.Item variant="primary">
              <strong>Tú: </strong>
              {respuesta.usuario}
            </ListGroup.Item>
            <ListGroup.Item variant="light">
              <strong>IA: </strong>
              {Array.isArray(respuesta.ia) && respuesta.ia.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {Object.keys(respuesta.ia[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {respuesta.ia.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value !== null ? value : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <pre>{respuesta.ia}</pre>
              )}
            </ListGroup.Item>
          </ListGroup>
        )}
        <Form.Control
          className="mt-3"
          type="text"
          placeholder="Escribe una consulta (ej. 'Ventas totales por categoría en 2025')"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
          disabled={cargando}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarChatModal(false)}>
          Cerrar
        </Button>
        <Button onClick={enviarMensaje} disabled={cargando || !mensaje.trim()}>
          {cargando ? <Spinner size="sm" animation="border" /> : 'Enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatIA;