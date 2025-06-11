import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, NavDropdown } from "react-bootstrap";
import logo from "/FunerariaHeraldica.png"; // Importación del logo
import "bootstrap-icons/font/bootstrap-icons.css"; // Importación de íconos de Bootstrap
import "../../../App.css";

const Encabezado = () => {
  const [estaColapsado, setEstaColapsado] = useState(false);
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  const cerrarSesion = () => {
    setEstaColapsado(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  const navegarA = (ruta) => {
    navegar(ruta);
    setEstaColapsado(false);
  };

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => navegarA("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <img
            alt="Funeraria Heraldica"
            src={logo}
            style={{ height: "40px", width: "auto", marginRight: "10px" }}
            className="d-inline-block align-top"
          />
          <strong>Funeraria Heraldica</strong>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={estaColapsado}
          onHide={() => setEstaColapsado(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={estaColapsado ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {estaLogueado ? (
                <>
                  <Nav.Link
                    onClick={() => navegarA("/inicio")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado && <i className="bi-house-door-fill me-2"></i>}
                    <strong>Inicio</strong>
                  </Nav.Link>

                  <Nav.Link
                    onClick={() => navegarA("/Dashboard")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado && <i className="bi-speedometer2 me-2"></i>}
                    <strong>Dashboard</strong>
                  </Nav.Link>

                  <Nav.Link
                    onClick={() => navegarA("/Estadisticas")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado && <i className="bi-graph-up me-2"></i>}
                    <strong>Estadísticas</strong>
                  </Nav.Link>

                  <Nav.Link
                    onClick={() => navegarA("/Facturas")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado && <i className="bi-receipt me-2"></i>}
                    <strong>Facturas</strong>
                  </Nav.Link>

                  <NavDropdown
                    title={
                      <span>
                        {estaColapsado && <i className="bi-folder-fill me-2"></i>}
                        Registros
                      </span>
                    }
                    id="dropdown-registros"
                    className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/clientes")}
                      className="text-black"
                    >
                      <strong>Gestión Clientes</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/Beneficiarios")}
                      className="text-black"
                    >
                      <strong>Gestión Beneficiarios</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/Agentes")}
                      className="text-black"
                    >
                      <strong>Gestión Agentes</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title={
                      <span>
                        {estaColapsado && <i className="bi-box-fill me-2"></i>}
                        Servicios
                      </span>
                    }
                    id="dropdown-servicios"
                    className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/Servicios")}
                      className="text-black"
                    >
                      <strong>Gestión Servicios</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/Modelos")}
                      className="text-black"
                    >
                      <strong>Gestión Modelos</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navegarA("/CatalogoModelo")}
                      className="text-black"
                    >
                      <strong>Catálogo Modelos</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  <Nav.Link
                    onClick={() => navegarA("/Contrato")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado && <i className="bi-file-earmark-text me-2"></i>}
                    <strong>Contrato</strong>
                  </Nav.Link>

                  <Nav.Link
                    onClick={cerrarSesion}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    <i className="bi-box-arrow-right me-2"></i>
                    <strong>Cerrar Sesión</strong>
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  onClick={() => navegarA("/")}
                  className={estaColapsado ? "text-black" : "text-white"}
                >
                  <i className="bi-box-arrow-in-right me-2"></i>
                  <strong>Iniciar Sesión</strong>
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;