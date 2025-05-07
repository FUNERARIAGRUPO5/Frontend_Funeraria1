import React, { useState, useEffect } from 'react';
import TablaFacturas from '../components/factura/TablaFacturas';
import ModalRegistroFactura from '../components/factura/ModalRegistroFactura';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Facturas = () => {
  const [listaFacturas, setListaFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaFactura, setNuevaFactura] = useState({
    IDAgente_co: '',
    IDContrato: '',
    Monto_DEC: '',
    Cuotas: ''
  });
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const obtenerFacturas = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/Factura');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las facturas');
      }
      const datos = await respuesta.json();
      console.log("Datos recibidos de la API:", datos);
      setListaFacturas(datos);
      setFacturasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener facturas:", error.message);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaFactura((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarFactura = async () => {
    if (
      !nuevaFactura.IDAgente_co ||
      !nuevaFactura.IDContrato ||
      !nuevaFactura.Monto_DEC ||
      !nuevaFactura.Cuotas
    ) {
      setErrorCarga('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registrarfactura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaFactura),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la factura');
      }

      await obtenerFacturas();
      setNuevaFactura({
        IDAgente_co: '',
        IDContrato: '',
        Monto_DEC: '',
        Cuotas: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    console.log("Texto de búsqueda:", texto);
    console.log("Lista de facturas completa:", listaFacturas);

    if (texto === "") {
      setFacturasFiltradas(listaFacturas);
      establecerPaginaActual(1);
    } else {
      const filtradas = listaFacturas.filter(
        (factura) =>
          (factura.IDAgente_co && String(factura.IDAgente_co).toLowerCase().includes(texto)) ||
          (factura.IDContrato && String(factura.IDContrato).toLowerCase().includes(texto)) ||
          (factura.Monto_DEC && String(factura.Monto_DEC).toLowerCase().includes(texto)) ||
          (factura.Cuotas && String(factura.Cuotas).toLowerCase().includes(texto))
      );
      console.log("Facturas filtradas:", filtradas);
      setFacturasFiltradas(filtradas);
      establecerPaginaActual(1);
    }
  };

  const facturasPaginadas = facturasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <h4>Facturas</h4>
        <Row>
          <Col lg={2} md={4} sm={6}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nueva Factura
            </Button>
          </Col>
          <Col lg={5} md={8} sm={6}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaFacturas
          Factura={facturasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={facturasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        <ModalRegistroFactura
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaFactura={nuevaFactura}
          manejarCambioInput={manejarCambioInput}
          agregarFactura={agregarFactura}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

export default Facturas;