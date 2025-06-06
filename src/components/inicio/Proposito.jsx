import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Proposito = () => {
  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">

        {/* Objetivos */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-bullseye" style={{ fontSize: "2rem", color: "#dc3545" }}></i>
          <h5>Objetivos</h5>
          <p>"Sabemos que no hay palabras suficientes para aliviar el dolor de una pérdida, pero creemos firmemente que cada vida merece ser recordada con amor, dignidad y gratitud. Nuestro compromiso es acompañarte con respeto en cada paso del camino.".</p>
        </Col>

        {/* Misión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-flag-fill" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
          <h5>Misión</h5>
          <p>"El final de una vida no significa el final del amor. Los recuerdos, las enseñanzas y los momentos compartidos continúan vivos en quienes amaron. En nuestra funeraria, transformamos la despedida en un acto de homenaje y serenidad."</p>
        </Col>

        {/* Visión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-eye-fill" style={{ fontSize: "2rem", color: "#198754" }}></i>
          <h5>Visión</h5>
          <p>"Despedir a un ser querido es uno de los actos más humanos y dolorosos. Por eso, estamos aquí para ofrecerte un espacio de calma, respeto y acompañamiento, donde cada detalle rinda tributo a la historia vivida."</p>
        </Col>

      </Row>
    </Container>
  );
};

export default Proposito;