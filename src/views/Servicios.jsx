import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroServicio from '../components/servicios/ModalRegistrarServicios';
import TablaServicio from '../components/servicios/TablaServicios';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionServicio from '../components/servicios/ModalEdicionServicios';
import ModalEliminacionServicio from '../components/servicios/ModalEliminarServicios';

const Servicios = () => {
  const [listaServicios, setListaServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({
    Nombre: '',
    Codigo_de_Modelo: '',
    monto: '',
    IDModelo: '',
    ID_Contrato: ''
  });
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [servicioEditado, setServicioEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerServicios = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/servicios');
      if (!respuesta.ok) throw new Error('Error al cargar los servicios');
      const datos = await respuesta.json();
      setListaServicios(datos);
      setServiciosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener servicios:", error.message);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoServicio((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setServicioEditado((prev) => ({ ...prev, [name]: value }));
  };

  const agregarServicio = async () => {
    if (!nuevoServicio.Nombre || !nuevoServicio.Codigo_de_Modelo || !nuevoServicio.monto || !nuevoServicio.IDModelo || !nuevoServicio.ID_Contrato) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registrarservicio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoServicio)
      });

      if (!respuesta.ok) throw new Error('Error al agregar el servicio');

      await obtenerServicios();
      setNuevoServicio({ Nombre: '', Codigo_de_Modelo: '', monto: '', IDModelo: '', ID_Contrato: '' });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarServicio = async () => {
    if (!servicioAEliminar) return;

    try {
      const id = servicioAEliminar.ID_Servicio ?? servicioAEliminar.IDServicio_At;
      const respuesta = await fetch(`http://localhost:3007/api/eliminarservicio/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('Error al eliminar el servicio');

      await obtenerServicios();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setServicioAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarServicio = async () => {
    const id = servicioEditado?.ID_Servicio ?? servicioEditado?.IDServicio_At;
    if (!id || !servicioEditado?.Nombre || !servicioEditado?.Codigo_de_Modelo || !servicioEditado?.monto || !servicioEditado?.IDModelo || !servicioEditado?.ID_Contrato) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizarservicio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: servicioEditado.Nombre,
          Codigo_de_Modelo: servicioEditado.Codigo_de_Modelo,
          monto: servicioEditado.monto,
          IDModelo: servicioEditado.IDModelo,
          ID_Contrato: servicioEditado.ID_Contrato
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error(`Servicio con ID ${id} no encontrado o ruta de actualización no disponible`);
        }
        throw new Error(`Error al actualizar el servicio: ${respuesta.statusText}`);
      }

      await obtenerServicios();
      setMostrarModalEdicion(false);
      setServicioEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error en actualizarServicio:', error);
    }
  };

  const abrirModalEdicion = (servicio) => {
    console.log("Abrir modal de edición con:", servicio);

    const servicioConID = {
      ...servicio,
      ID_Servicio: servicio.ID_Servicio ?? servicio.IDServicio_At
    };

    if (!servicioConID.ID_Servicio) {
      console.warn("El servicio no tiene ID_Servicio definido.");
      return;
    }

    setServicioEditado(servicioConID);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (servicio) => {
    const servicioConID = {
      ...servicio,
      ID_Servicio: servicio.ID_Servicio ?? servicio.IDServicio_At
    };

    if (!servicioConID.ID_Servicio) {
      console.warn("El servicio no tiene ID_Servicio definido.");
      return;
    }

    setServicioAEliminar(servicioConID);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    if (texto === "") {
      setServiciosFiltrados(listaServicios);
      establecerPaginaActual(1);
    } else {
      const filtrados = listaServicios.filter(
        (servicio) =>
          (servicio.Nombre && servicio.Nombre.toLowerCase().includes(texto)) ||
          (servicio.Codigo_de_Modelo && servicio.Codigo_de_Modelo.toLowerCase().includes(texto)) ||
          (servicio.monto && String(servicio.monto).toLowerCase().includes(texto)) ||
          (servicio.IDModelo && String(servicio.IDModelo).toLowerCase().includes(texto)) ||
          (servicio.ID_Contrato && String(servicio.ID_Contrato).toLowerCase().includes(texto))
      );
      setServiciosFiltrados(filtrados);
      establecerPaginaActual(1);
    }
  };

  const serviciosPaginados = serviciosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Servicios Funerarios</h4>
      <Row>
        <Col lg={2} md={4} sm={6}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Servicio
          </Button>
        </Col>
        <Col lg={5} md={8} sm={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <TablaServicio
        Servicios={serviciosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={serviciosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />
      <ModalRegistroServicio
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoServicio={nuevoServicio}
        manejarCambioInput={manejarCambioInput}
        agregarServicio={agregarServicio}
        errorCarga={errorCarga}
      />
      <ModalEliminacionServicio
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarServicio={eliminarServicio}
      />
      <ModalEdicionServicio
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        servicioEditado={servicioEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarServicio={actualizarServicio}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Servicios;
