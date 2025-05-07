import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from "react-bootstrap";
import TablaBeneficiarios from '../components/beneficiario/TabalBeneficiarios';
import ModalRegistroBeneficiario from '../components/beneficiario/ModalRegistroBeneficiario';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionBeneficiario from '../components/beneficiario/ModalEdicionBeneficiario';
import ModalEliminacionBeneficiario from '../components/beneficiario/ModalEliminacionBeneficiario';

const Beneficiarios = () => {
  const [listaBeneficiarios, setListaBeneficiarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoBeneficiario, setNuevoBeneficiario] = useState({
    Nombre: '',
    Apellido: '',
    Cedula: '',
    Telefono: '',
    IDContratos: ''
  });
  const [beneficiariosFiltrados, setBeneficiariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [beneficiarioAEliminar, setBeneficiarioAEliminar] = useState(null);
  const [beneficiarioEditado, setBeneficiarioEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerBeneficiarios = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/Beneficiarios');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los beneficiarios');
      }
      const datos = await respuesta.json();
      setListaBeneficiarios(datos);
      setBeneficiariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerBeneficiarios();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoBeneficiario((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setBeneficiarioEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarBeneficiario = async () => {
    if (!nuevoBeneficiario.Nombre || !nuevoBeneficiario.Apellido || !nuevoBeneficiario.Cedula || !nuevoBeneficiario.Telefono || !nuevoBeneficiario.IDContratos) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registrarbeneficiario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoBeneficiario)
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el beneficiario');
      }

      await obtenerBeneficiarios();
      setNuevoBeneficiario({
        Nombre: '',
        Apellido: '',
        Cedula: '',
        Telefono: '',
        IDContratos: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1); // Reset to page 1 after adding
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarBeneficiario = async () => {
    if (!beneficiarioAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3007/api/eliminarbeneficiario/${beneficiarioAEliminar.IDBeneficiarios}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el beneficiario');
      }

      await obtenerBeneficiarios();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1); // Regresa a la primera página
      setBeneficiarioAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarBeneficiario = async () => {
    if (!beneficiarioEditado?.Nombre || !beneficiarioEditado?.Apellido || 
        !beneficiarioEditado?.Cedula || !beneficiarioEditado?.Telefono || 
        !beneficiarioEditado?.IDContratos) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizarbeneficiario/${beneficiarioEditado.IDBeneficiarios}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: beneficiarioEditado.Nombre,
          Apellido: beneficiarioEditado.Apellido,
          Cedula: beneficiarioEditado.Cedula,
          Telefono: beneficiarioEditado.Telefono,
          IDContratos: beneficiarioEditado.IDContratos
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error(`Beneficiario con ID ${beneficiarioEditado.IDBeneficiarios} no encontrado o ruta de actualización no disponible`);
        }
        throw new Error(`Error al actualizar el beneficiario: ${respuesta.statusText}`);
      }

      await obtenerBeneficiarios();
      setMostrarModalEdicion(false);
      setBeneficiarioEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error en actualizarBeneficiario:', error);
    }
  };

  const abrirModalEdicion = (beneficiario) => {
    setBeneficiarioEditado(beneficiario);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (beneficiario) => {
    setBeneficiarioAEliminar(beneficiario);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);

    if (texto === "") {
      setBeneficiariosFiltrados(listaBeneficiarios);
      establecerPaginaActual(1); // Reset to page 1
    } else {
      const filtrados = listaBeneficiarios.filter(
        (beneficiario) =>
          (beneficiario.Nombre && beneficiario.Nombre.toLowerCase().includes(texto)) ||
          (beneficiario.Apellido && beneficiario.Apellido.toLowerCase().includes(texto)) ||
          (beneficiario.Cedula && String(beneficiario.Cedula).toLowerCase().includes(texto)) ||
          (beneficiario.Telefono && String(beneficiario.Telefono).toLowerCase().includes(texto))
      );
      setBeneficiariosFiltrados(filtrados);
      establecerPaginaActual(1); // Reset to page 1 on search
    }
  };

  // Calcular elementos paginados
  const beneficiariosPaginados = beneficiariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Beneficiarios</h4>
      <Row>
        <Col lg={2} md={4} sm={6}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Beneficiario
          </Button>
        </Col>
        <Col lg={5} md={8} sm={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <TablaBeneficiarios
        beneficiarios={beneficiariosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={beneficiariosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
      />
      <ModalRegistroBeneficiario
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoBeneficiario={nuevoBeneficiario}
        manejarCambioInput={manejarCambioInput}
        agregarBeneficiario={agregarBeneficiario}
        errorCarga={errorCarga}
      />
      <ModalEliminacionBeneficiario
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarBeneficiario={eliminarBeneficiario}
      />
      <ModalEdicionBeneficiario
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        beneficiarioEditado={beneficiarioEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarBeneficiario={actualizarBeneficiario}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Beneficiarios;