import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const PiePagina = () => {
  return (
    <footer className="bg-light py-2">
      <Container>
        <Row>
          <Col 
            xs={{ order: 2, span: 12 }} 
            sm={{ order: 2, span: 12 }} 
            md={{ order: 2, span: 12 }} 
            lg={{ order: 1, span: 6 }} 
            className="text-center text-lg-start"
          >
            <p>Funeraria Heraldica, {new Date().getFullYear()}. ©</p>
          </Col>
          <Col 
            xs={{ order: 1, span: 12 }} 
            sm={{ order: 1, span: 12 }} 
            md={{ order: 1, span: 12 }} 
            lg={{ order: 2, span: 6 }} 
            className="text-center text-lg-end"
          >
            <Button
              variant="link"
              href="https://www.facebook.com"
              target="_blank"
            >
              <i className="bi bi-facebook"></i> Facebook
            </Button>

            <Button variant="link" href="https://wa.me/+50588348160" target="_blank">
              <i className="bi bi-whatsapp"></i> Soporte técnico
            </Button>

          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default PiePagina;