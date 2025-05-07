import React, { useState, useEffect } from 'react';
import TablaModelo from '../components/Modelo/TablaModelo';
import ModalAgregarModelo from '../components/Modelo/ModalRegistroModelo';
import ModalEliminacionModelo from '../components/Modelo/ModalEliminacionModelo';
import ModalEdicionModelo from '../components/Modelo/ModalEdicionModelo';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

const Modelos = () => {
  const [listaModelos, setListaModelos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoModelo, setNuevoModelo] = useState({
    Nombre: '',
    Modelo: '',
    Medida: '',
    Color: ''
  });
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [modeloAEliminar, setModeloAEliminar] = useState(null);
  const [modeloEditado, setModeloEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [enviando, setEnviando] = useState(false); // Added for loading state

  const obtenerModelos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/modelos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los modelos');
      }
      const datos = await respuesta.json();
      setListaModelos(datos);
      setModelosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerModelos();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoModelo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setModeloEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarModelo = async () => {
    if (!nuevoModelo.Nombre || !nuevoModelo.Modelo || !nuevoModelo.Medida || !nuevoModelo.Color) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      setEnviando(true); // Start loading state
      const respuesta = await fetch('http://localhost:3007/api/registrarmodelos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoModelo)
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al agregar el modelo');
      }

      await obtenerModelos();
      setNuevoModelo({
        Nombre: '',
        Modelo: '',
        Medida: '',
        Color: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setEnviando(false); // End loading state
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    if (!texto) {
      setModelosFiltrados(listaModelos);
      establecerPaginaActual(1);
      return;
    }

    const filtrados = listaModelos.filter((modelo) =>
      (modelo.Nombre && modelo.Nombre.toLowerCase().includes(texto)) ||
      (modelo.Modelo && modelo.Modelo.toLowerCase().includes(texto)) ||
      (modelo.Medida && modelo.Medida.toLowerCase().includes(texto)) ||
      (modelo.Color && modelo.Color.toLowerCase().includes(texto))
    );

    setModelosFiltrados(filtrados);
    establecerPaginaActual(1);
  };

  const eliminarModelo = async () => {
    if (!modeloAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3007/api/eliminarmodelos/${modeloAEliminar.IDModelo}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el modelo');
      }

      await obtenerModelos();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setModeloAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarModelo = async () => {
    if (!modeloEditado?.Nombre || !modeloEditado?.Modelo || 
        !modeloEditado?.Medida || !modeloEditado?.Color) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizarmodelos/${modeloEditado.IDModelo}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: modeloEditado.Nombre,
          Modelo: modeloEditado.Modelo,
          Medida: modeloEditado.Medida,
          Color: modeloEditado.Color
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || `Error al actualizar el modelo: ${respuesta.statusText}`);
      }

      await obtenerModelos();
      setMostrarModalEdicion(false);
      setModeloEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (modelo) => {
    setModeloEditado(modelo);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (modelo) => {
    setModeloAEliminar(modelo);
    setMostrarModalEliminacion(true);
  };

  const modelosPaginados = modelosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Modelos</h4>

      <Row className="mb-3">
        <Col lg={2} md={4} sm={6}>
          <Button 
            variant="primary" 
            onClick={() => setMostrarModal(true)} 
            style={{ width: "100%" }}
            disabled={enviando}
          >
            Nuevo Modelo
          </Button>
        </Col>
        <Col lg={5} md={8} sm={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      <TablaModelo
        modelos={modelosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={modelosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />

      <ModalAgregarModelo
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoModelo={nuevoModelo}
        manejarCambioInput={manejarCambioInput}
        agregarModelo={agregarModelo}
        errorCarga={errorCarga}
        enviando={enviando} // Pass loading state to modal
      />

      <ModalEliminacionModelo
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarModelo={eliminarModelo}
      />

      <ModalEdicionModelo
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        modeloEditado={modeloEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarModelo={actualizarModelo}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Modelos;