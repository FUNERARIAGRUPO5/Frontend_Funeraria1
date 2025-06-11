import React from 'react';
import { Col, Card, Badge, Stack } from 'react-bootstrap';
import { Zoom } from 'react-awesome-reveal';

const Tarjeta = ({ indice, Nombre, Modelo, Medida, Color, IDModelo, imagen, precio }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
      <Zoom cascade delay={10} duration={600}>
        <Card border="light" className="shadow-sm">
          <Card.Img
            variant="top"
            src={imagen ? `data:image/png;base64,${imagen}` : 'https://via.placeholder.com/300x200?text=Imagen+no+disponible'}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            alt={Nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
            }}
          />
          <Card.Body className="text-center">
            <Card.Title>
              <strong>{Nombre}</strong>
            </Card.Title>
            <Card.Text className="text-muted">{Modelo || 'Sin modelo'}</Card.Text>
            <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap mt-2">
              <Badge pill bg="success" className="m-1">
                €{precio || 'N/A'} por {Medida}
              </Badge>
              <Badge pill bg="primary" className="m-1">
                Color: {Color || 'N/A'}
              </Badge>
              {IDModelo && (
                <Badge pill bg="warning" className="m-1">
                  Marca: {IDModelo}
                </Badge>
              )}
            </Stack>
          </Card.Body>
        </Card>
      </Zoom>
    </Col>
  );
};

export default Tarjeta;