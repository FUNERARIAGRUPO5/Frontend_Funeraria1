import React from "react";
import { Col, Card, Badge, Stack } from 'react-bootstrap';

const Tarjeta = ({ indice, Nombre, Modelo, Medida, Color, IDModelo, imagen }) => {
  return (
    <Col lg={3} className="mt-3">
      <Card border="">
        <Card.Img
          variant="top"
          src={imagen ? `data:image/png;base64,${imagen}` : undefined}
          alt={Nombre}
        />
        <Card.Body>
          <Card.Title>
            <strong>{Nombre}</strong>
          </Card.Title>
          <Card.Text>{Modelo || 'Sin modelo'}</Card.Text>
          <Stack direction="vertical" gap={2}>
            <Badge pill bg="primary">
              <i className="bi-ruler"></i> {Medida}
            </Badge>
            <Badge pill bg="secondary">
              <i className="bi-palette"></i> Color: {Color}
            </Badge>
            <Badge pill bg="info">
              <i className="bi-tag"></i> Marca: {IDModelo}
            </Badge>
          </Stack>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Tarjeta;