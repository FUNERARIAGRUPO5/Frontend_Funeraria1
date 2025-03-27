import React, { useState } from "react"; // Asegúrate de importar useState
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate
import "../../app.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, manejarEnvio }) => {
  const [showPassword, setShowPassword] = useState(false); // Corrige el uso de useState
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword); // Corrige el nombre de la función

  const handleForgotPassword = () => {
    navigate("/Recuperar-contraseña");
  };

  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4}>
        <Card className="p-4 shadow-lg">
          <Card.Body>
            <h3 className="text-center mb-4">Iniciar Sesión</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={manejarEnvio}>
              <Form.Group className="mb-3" controlId="usuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contraseñaUsuario">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="secondary" onClick={toggleShowPassword} className="mb-3">
                {showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"} {/* Corrige el texto */}
              </Button>

              <div className="mb-3">
                <Button variant="link" onClick={handleForgotPassword}>
                  ¿Olvidaste tu contraseña? {/* Corrige el texto */}
                </Button>
              </div>

              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;