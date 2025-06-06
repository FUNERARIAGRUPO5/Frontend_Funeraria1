import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroAgente from '../components/agente/ModalRegistroAgentes';
import TablaAgente from '../components/agente/TablaAgente';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionAgente from '../components/agente/ModalEdicionAgente';
import ModalEliminacionAgente from '../components/agente/ModalEliminacionAgente';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  // Función para generar un reporte PDF de todos los agentes
  const generarPDFAgentes = () => {
    const doc = new jsPDF();
    
    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Agentes", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Teléfono"];
    const filas = agentesFiltrados.map((agente) => [
      agente.IDAgente_co,
      agente.Nombre,
      agente.Telefono,
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
    const nombreArchivo = `agentes_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  // Función para generar un reporte PDF detallado de un agente
  const generarPDFDetalleAgente = (agente) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(`${agente.Nombre}`, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`ID: ${agente.IDAgente_co}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Teléfono: ${agente.Telefono}`, anchoPagina / 2, posicionY + 10, { align: "center" });

    pdf.save(`${agente.Nombre}.pdf`);
  };

  // Función para exportar los agentes a un archivo Excel
  const exportarExcelAgentes = () => {
    const datos = agentesFiltrados.map((agente) => ({
      ID: agente.IDAgente_co,
      Nombre: agente.Nombre,
      Teléfono: agente.Telefono,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Agentes");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `agentes_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  const agentesPaginados = agentesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Agentes</h4>
      <Row className="mb-3">
        <Col lg={2} md={4} sm={3} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
            Nuevo Agente
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
            onClick={() => generarPDFAgentes()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={3} xs={3}>
          <Button
            className="mb-3"
            onClick={() => exportarExcelAgentes()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
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
        generarPDFDetalleAgente={generarPDFDetalleAgente}
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