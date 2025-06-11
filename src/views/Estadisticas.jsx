import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EstadodeContrato from '../components/graficos/Estadodecontrato';
import ChatIA from '../components/ChatIA';

const Estadisticas = () => {
  const [estados, setEstados] = useState([]);
  const [totalesPorEstado, setTotalesPorEstado] = useState([]);
  const [mostrarChatModal, setMostrarChatModal] = useState(false);

  const cargaEstados = async () => {
    try {
      const response = await fetch('http://localhost:3007/api/estadodecontrato');
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setEstados(data.map(item => item.Estado));
      setTotalesPorEstado(data.map(item => item.Cant_Beneficiarios || 0));
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
      <br />
      <h4>Estadísticas</h4>
      
      <Button 
        variant="primary" 
        className="mb-4"
        onClick={() => setMostrarChatModal(true)}
      >
        Consultar con IA
      </Button>

      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={12} className="mb-5">
          <EstadodeContrato estados={estados} cantidadesPorEstado={totalesPorEstado} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-5">
          <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;