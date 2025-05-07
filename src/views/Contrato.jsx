import React, { useState, useEffect } from 'react';
import TablaContrato from '../components/contrato/TablaContrato';
import ModalRegistroContrato from '../components/contrato/ModalRegistrarContrato';
import ModalEdicionContrato from '../components/contrato/ModalEdicionContrato';
import ModalEliminacionContrato from '../components/contrato/ModalEliminacionContrato';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Contrato = () => {
  const [listaContratos, setListaContratos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoContrato, setNuevoContrato] = useState({
    Estado: '',
    Cantidad_Beneficiarios: '',
    Cuotas: '',
    Monto: '',
    Fecha_inicio: '',
    Fecha_fin: '',
    IDcliente: ''
  });
  const [contratosFiltrados, setContratosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [contratoAEliminar, setContratoAEliminar] = useState(null);
  const [contratoEditado, setContratoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerContratos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/contratos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los contratos');
      }
      const datos = await respuesta.json();
      console.log("Datos recibidos de la API:", datos);
      setListaContratos(datos);
      setContratosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener contratos:", error.message);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerContratos();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoContrato((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setContratoEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarContrato = async () => {
    if (
      !nuevoContrato.Estado ||
      !nuevoContrato.Cantidad_Beneficiarios ||
      !nuevoContrato.Cuotas ||
      !nuevoContrato.Monto ||
      !nuevoContrato.Fecha_inicio ||
      !nuevoContrato.Fecha_fin ||
      !nuevoContrato.IDcliente
    ) {
      setErrorCarga('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registrarcontrato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoContrato),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el contrato');
      }

      await obtenerContratos();
      setNuevoContrato({
        Estado: '',
        Cantidad_Beneficiarios: '',
        Cuotas: '',
        Monto: '',
        Fecha_inicio: '',
        Fecha_fin: '',
        IDcliente: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarContrato = async () => {
    if (!contratoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3007/api/eliminarcontrato/${contratoAEliminar.IDContrato}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el contrato');
      }

      await obtenerContratos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setContratoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarContrato = async () => {
    if (
      !contratoEditado?.Estado ||
      !contratoEditado?.Cantidad_Beneficiarios ||
      !contratoEditado?.Cuotas ||
      !contratoEditado?.Monto ||
      !contratoEditado?.Fecha_inicio ||
      !contratoEditado?.Fecha_fin ||
      !contratoEditado?.IDcliente
    ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizarcontrato/${contratoEditado.IDContrato}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Estado: contratoEditado.Estado,
          Cantidad_Beneficiarios: contratoEditado.Cantidad_Beneficiarios,
          Cuotas: contratoEditado.Cuotas,
          Monto: contratoEditado.Monto,
          Fecha_inicio: contratoEditado.Fecha_inicio,
          Fecha_fin: contratoEditado.Fecha_fin,
          IDcliente: contratoEditado.IDcliente
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error(`Contrato con ID ${contratoEditado.IDContrato} no encontrado o ruta de actualización no disponible`);
        }
        throw new Error(`Error al actualizar el contrato: ${respuesta.statusText}`);
      }

      await obtenerContratos();
      setMostrarModalEdicion(false);
      setContratoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error en actualizarContrato:', error);
    }
  };

  const abrirModalEdicion = (contrato) => {
    setContratoEditado(contrato);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (contrato) => {
    setContratoAEliminar(contrato);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    console.log("Texto de búsqueda:", texto);
    console.log("Lista de contratos completa:", listaContratos);

    if (texto === "") {
      setContratosFiltrados(listaContratos);
      establecerPaginaActual(1);
    } else {
      const filtrados = listaContratos.filter(
        (contrato) =>
          (contrato.Estado && contrato.Estado.toLowerCase().includes(texto)) ||
          (contrato.Cantidad_Beneficiarios && String(contrato.Cantidad_Beneficiarios).toLowerCase().includes(texto)) ||
          (contrato.Cuotas && String(contrato.Cuotas).toLowerCase().includes(texto)) ||
          (contrato.Monto && String(contrato.Monto).toLowerCase().includes(texto)) ||
          (contrato.Fecha_inicio && contrato.Fecha_inicio.toLowerCase().includes(texto)) ||
          (contrato.Fecha_fin && contrato.Fecha_fin.toLowerCase().includes(texto)) ||
          (contrato.IDcliente && String(contrato.IDcliente).toLowerCase().includes(texto))
      );
      console.log("Contratos filtrados:", filtrados);
      setContratosFiltrados(filtrados);
      establecerPaginaActual(1);
    }
  };

  const contratosPaginados = contratosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Contratos</h4>
      <Row>
        <Col lg={2} md={4} sm={6}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Contrato
          </Button>
        </Col>
        <Col lg={5} md={8} sm={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      <TablaContrato
        contratos={contratosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={contratosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />

      <ModalRegistroContrato
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoContrato={nuevoContrato}
        manejarCambioInput={manejarCambioInput}
        agregarContrato={agregarContrato}
        errorCarga={errorCarga}
      />

      <ModalEliminacionContrato
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarContrato={eliminarContrato}
      />

      <ModalEdicionContrato
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        contratoEditado={contratoEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarContrato={actualizarContrato}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Contrato;