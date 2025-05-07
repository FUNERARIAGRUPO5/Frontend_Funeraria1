import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/cliente/TablaClientes';
import ModalRegistroCliente from '../components/cliente/ModalRegistrarCliente';
import ModalEdicionCliente from '../components/cliente/ModalEdicionCliente';
import ModalEliminacionCliente from '../components/cliente/ModalEliminacionCliente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Clientes
const Clientes = () => {
  // Estados para manejar datos, carga, errores, modales y búsqueda
  const [listaClientes, setListaClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    Nombre: '',
    Apellido: '',
    Direccion: '',
    Cedula: '',
    Telefono: ''
  });
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteEditado, setClienteEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  // Función para obtener la lista de clientes desde la API
  const obtenerClientes = async () => {
    try {
      setCargando(true); // Activa estado de carga
      const respuesta = await fetch('http://localhost:3007/api/Cliente');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los clientes');
      }
      const datos = await respuesta.json();
      setListaClientes(datos); // Actualiza lista completa
      setClientesFiltrados(datos); // Actualiza lista filtrada
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Carga inicial de clientes con useEffect
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Maneja los cambios en los inputs del modal de registro
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja los cambios en los inputs del modal de edición
  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para agregar un nuevo cliente
  const agregarCliente = async () => {
    // Validación de campos obligatorios
    if (!nuevoCliente.Nombre || !nuevoCliente.Apellido || 
        !nuevoCliente.Direccion || !nuevoCliente.Cedula || 
        !nuevoCliente.Telefono) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3007/api/registrarcliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el cliente');
      }

      await obtenerClientes(); // Refresca la lista de clientes
      setNuevoCliente({
        Nombre: '',
        Apellido: '',
        Direccion: '',
        Cedula: '',
        Telefono: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1); // Reset to page 1 after adding
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Función para manejar la búsqueda dinámica
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim(); // Convierte a minúsculas y elimina espacios
    setTextoBusqueda(texto);

    if (!texto) {
      setClientesFiltrados(listaClientes); // Restaura lista completa si no hay texto
      establecerPaginaActual(1); // Reset to page 1
      return;
    }

    const filtrados = listaClientes.filter((cliente) =>
      (cliente.Nombre && cliente.Nombre.toLowerCase().includes(texto)) ||
      (cliente.Apellido && cliente.Apellido.toLowerCase().includes(texto)) ||
      (cliente.Direccion && cliente.Direccion.toLowerCase().includes(texto)) ||
      (cliente.Cedula && String(cliente.Cedula).toLowerCase().includes(texto)) ||
      (cliente.Telefono && String(cliente.Telefono).toLowerCase().includes(texto))
    );

    setClientesFiltrados(filtrados); // Actualiza clientes filtrados
    establecerPaginaActual(1); // Reset to page 1 on search
  };

  // Función para eliminar un cliente
  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3007/api/eliminarcliente/${clienteAEliminar.IDcliente}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      await obtenerClientes(); // Refresca la lista
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1); // Regresa a la primera página
      setClienteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Función para actualizar un cliente
  const actualizarCliente = async () => {
    if (!clienteEditado?.Nombre || !clienteEditado?.Apellido || 
        !clienteEditado?.Direccion || !clienteEditado?.Cedula || 
        !clienteEditado?.Telefono) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3007/api/actualizarcliente/${clienteEditado.IDcliente}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: clienteEditado.Nombre,
          Apellido: clienteEditado.Apellido,
          Direccion: clienteEditado.Direccion,
          Cedula: clienteEditado.Cedula,
          Telefono: clienteEditado.Telefono
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error(`Cliente con ID ${clienteEditado.IDcliente} no encontrado o ruta de actualización no disponible`);
        }
        throw new Error(`Error al actualizar el cliente: ${respuesta.statusText}`);
      }

      await obtenerClientes();
      setMostrarModalEdicion(false);
      setClienteEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
      console.error('Error en actualizarCliente:', error);
    }
  };

  // Función para abrir el modal de edición
  const abrirModalEdicion = (cliente) => {
    setClienteEditado(cliente);
    setMostrarModalEdicion(true);
  };

  // Función para abrir el modal de eliminación
  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  // Calcular elementos paginados
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado del componente
  return (
    <>
      <Container className="mt-5">
        <h4>Clientes</h4>

        <Row className="mb-3">
          <Col lg={2} md={4} sm={6}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nuevo Cliente
            </Button>
          </Col>
          <Col lg={5} md={8} sm={6}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        {/* Renderizado de tabla de clientes */}
        <TablaClientes
          clientes={clientesPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={clientesFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        {/* Modal para registrar nuevos clientes */}
        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
          errorCarga={errorCarga}
        />

        {/* Modal para eliminar clientes */}
        <ModalEliminacionCliente
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCliente={eliminarCliente}
        />

        {/* Modal para editar clientes */}
        <ModalEdicionCliente
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          clienteEditado={clienteEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarCliente={actualizarCliente}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Clientes;