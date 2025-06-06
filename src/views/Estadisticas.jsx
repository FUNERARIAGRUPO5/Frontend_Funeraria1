import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EstadodeContrato from '../components/graficos/EstadodeContrato';
import ChatIA from '../components/ChatIA';

const Estadisticas = () => {
  const [estados, setEstados] = useState([]);
  const [totalesPorEstado, setTotalesPorEstado] = useState([]);
  const [mostrarChatModal, setMostrarChatModal] = useState(false);

  const cargaEstados = async () => {
    try {
      const response = await fetch('http://localhost:3007/api/estadodecontrato');
      const data = await response.json();
      setEstados(data.map(item => item.estado));
      setTotalesPorEstado(data.map(item => item.total_ventas));
    } catch (error) {
      console.error('Error al cargar estados de contratos:', error);
      alert('Error al cargar estados de contratos: ' + error.message);
    }
  };

  useEffect(() => {
    cargaEstados();
  }, []);

  return (
    <Container className="mt-5">
      <h4>Estadísticas</h4>
      <Button 
        variant="primary" 
        className="mb-4"
        onClick={() => setMostrarChatModal(true)}
      >
        Consultar con IA
      </Button>
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={12} className="mb-4">
          <EstadodeContrato estados={estados} totales_por_estado={totalesPorEstado} />
        </Col>
        <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />
      </Row>
    </Container>
  );
};

export default Estadisticas;