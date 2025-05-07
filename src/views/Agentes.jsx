import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroAgente from '../components/agente/ModalRegistroAgentes';
import TablaAgente from '../components/agente/TablaAgente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionAgente from '../components/agente/ModalEdicionAgente';
import ModalEliminacionAgente from '../components/agente/ModalEliminacionAgente';

const Agentes = () => {
  const [listaAgentes, setListaAgentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoAgente, setNuevoAgente] = useState({
    Nombre: '',
    Telefono: ''
  });
  const [agentesFiltrados, setAgentesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [agenteAEliminar, setAgenteAEliminar] = useState(null);
  const [agenteEditado, setAgenteEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerAgentes = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/Agentes');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los agentes');
      }
      const datos = await respuesta.json();
      console.log("Datos recibidos de la API:", datos);
      setListaAgentes(datos);
      setAgentesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener agentes:", error.message);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAgentes();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoAgente((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setAgenteEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarAgente = async () => {
    if (!nuevoAgente.Nombre || !nuevoAgente.Telefono) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registraragentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoAgente)
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el agente');
      }

      await obtenerAgentes();
      setNuevoAgente({ Nombre: '', Telefono: '' });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarAgente = async () => {
    if (!agenteAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3007/api/eliminaragente/${agenteAEliminar.IDAgente_co}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el agente');
      }

      await obtenerAgentes();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setAgenteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarAgente = async () => {
    if (!agenteEditado?.Nombre || !agenteEditado?.Telefono) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizaragente/${agenteEditado.IDAgente_co}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: agenteEditado.Nombre,
          Telefono: agenteEditado.Telefono
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error(`Agente con ID ${agenteEditado.IDAgente_co} no encontrado o ruta de actualización no disponible`);
        }
        throw new Error(`Error al actualizar el agente: ${respuesta.statusText}`);
      }

      await obtenerAgentes();
      setMostrarModalEdicion(false);
      setAgenteEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error en actualizarAgente:', error);
    }
  };

  const abrirModalEdicion = (agente) => {
    setAgenteEditado(agente);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (agente) => {
    setAgenteAEliminar(agente);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    console.log("Texto de búsqueda:", texto);
    console.log("Lista de agentes completa:", listaAgentes);

    if (texto === "") {
      setAgentesFiltrados(listaAgentes);
      establecerPaginaActual(1);
    } else {
      const filtrados = listaAgentes.filter(
        (agente) =>
          (agente.Nombre && agente.Nombre.toLowerCase().includes(texto)) ||
          (agente.Telefono && String(agente.Telefono).toLowerCase().includes(texto))
      );
      console.log("Agentes filtrados:", filtrados);
      setAgentesFiltrados(filtrados);
      establecerPaginaActual(1);
    }
  };

  const agentesPaginados = agentesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Agentes</h4>
      <Row>
        <Col lg={2} md={4} sm={6}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Agente
          </Button>
        </Col>
        <Col lg={5} md={8} sm={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <TablaAgente
        agentes={agentesPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={agentesFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />
      <ModalRegistroAgente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoAgente={nuevoAgente}
        manejarCambioInput={manejarCambioInput}
        agregarAgente={agregarAgente}
        errorCarga={errorCarga}
      />
      <ModalEliminacionAgente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarAgente={eliminarAgente}
      />
      <ModalEdicionAgente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        agenteEditado={agenteEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarAgente={actualizarAgente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Agentes;