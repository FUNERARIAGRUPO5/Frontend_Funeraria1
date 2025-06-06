import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/cliente/TablaClientes';
import ModalRegistroCliente from '../components/cliente/ModalRegistrarCliente';
import ModalEdicionCliente from '../components/cliente/ModalEdicionCliente';
import ModalEliminacionCliente from '../components/cliente/ModalEliminacionCliente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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

  // Función para generar un reporte PDF de todos los clientes
  const generarPDFClientes = () => {
    const doc = new jsPDF();
    
    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Clientes", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Apellido", "Dirección", "Cédula", "Teléfono"];
    const filas = clientesFiltrados.map((cliente) => [
      cliente.IDcliente,
      cliente.Nombre,
      cliente.Apellido,
      cliente.Direccion,
      cliente.Cedula,
      cliente.Telefono,
    ]);

    const totalPaginas = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `clientes_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  // Función para generar un reporte PDF detallado de un cliente
  const generarPDFDetalleCliente = (cliente) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(`${cliente.Nombre} ${cliente.Apellido}`, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`ID: ${cliente.IDcliente}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Dirección: ${cliente.Direccion}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Cédula: ${cliente.Cedula}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Teléfono: ${cliente.Telefono}`, anchoPagina / 2, posicionY + 30, { align: "center" });

    pdf.save(`${cliente.Nombre}_${cliente.Apellido}.pdf`);
  };

  // Función para exportar los clientes a un archivo Excel
  const exportarExcelClientes = () => {
    const datos = clientesFiltrados.map((cliente) => ({
      ID: cliente.IDcliente,
      Nombre: cliente.Nombre,
      Apellido: cliente.Apellido,
      Dirección: cliente.Direccion,
      Cédula: cliente.Cedula,
      Teléfono: cliente.Telefono,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Clientes");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `clientes_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  // Calcular elementos paginados
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado del componente
  return (
    <Container className="mt-5">
      <h4>Clientes</h4>

      <Row className="mb-3">
        <Col lg={2} md={4} sm={3} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Cliente
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col lg={3} md={4} sm={3} xs={3}>
          <Button
            className="mb-3"
            onClick={() => generarPDFClientes()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={3} xs={3}>
          <Button
            className="mb-3"
            onClick={() => exportarExcelClientes()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </Row>

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
        generarPDFDetalleCliente={generarPDFDetalleCliente}
      />

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
        errorCarga={errorCarga}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditado={clienteEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarCliente={actualizarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

// Exportación del componente
export default Clientes;