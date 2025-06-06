import React, { useState, useEffect } from 'react';
import TablaContrato from '../components/contrato/TablaContrato';
import ModalRegistroContrato from '../components/contrato/ModalRegistrarContrato';
import ModalEdicionContrato from '../components/contrato/ModalEdicionContrato';
import ModalEliminacionContrato from '../components/contrato/ModalEliminacionContrato';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Contrato = () => {
  const [listaContratos, setListaContratos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoContrato, setNuevoContrato] = useState({
    Estado: '',
    CantidadBeneficiarios: '',
    Cuotas: '',
    Monto: '',
    Fecha_inicio: '',
    Fecha_fin: '',
    IDCliente: ''
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
      !nuevoContrato.CantidadBeneficiarios ||
      !nuevoContrato.Cuotas ||
      !nuevoContrato.Monto ||
      !nuevoContrato.Fecha_inicio ||
      !nuevoContrato.Fecha_fin ||
      !nuevoContrato.IDCliente
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
        CantidadBeneficiarios: '',
        Cuotas: '',
        Monto: '',
        Fecha_inicio: '',
        Fecha_fin: '',
        IDCliente: ''
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
      !contratoEditado?.CantidadBeneficiarios ||
      !contratoEditado?.Cuotas ||
      !contratoEditado?.Monto ||
      !contratoEditado?.Fecha_inicio ||
      !contratoEditado?.Fecha_fin ||
      !contratoEditado?.IDCliente
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
          CantidadBeneficiarios: contratoEditado.CantidadBeneficiarios,
          Cuotas: contratoEditado.Cuotas,
          Monto: contratoEditado.Monto,
          Fecha_inicio: contratoEditado.Fecha_inicio,
          Fecha_fin: contratoEditado.Fecha_fin,
          IDCliente: contratoEditado.IDCliente
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
          (contrato.CantidadBeneficiarios && String(contrato.CantidadBeneficiarios).toLowerCase().includes(texto)) ||
          (contrato.Cuotas && String(contrato.Cuotas).toLowerCase().includes(texto)) ||
          (contrato.Monto && String(contrato.Monto).toLowerCase().includes(texto)) ||
          (contrato.Fecha_inicio && contrato.Fecha_inicio.toLowerCase().includes(texto)) ||
          (contrato.Fecha_fin && contrato.Fecha_fin.toLowerCase().includes(texto)) ||
          (contrato.IDCliente && String(contrato.IDCliente).toLowerCase().includes(texto))
      );
      console.log("Contratos filtrados:", filtrados);
      setContratosFiltrados(filtrados);
      establecerPaginaActual(1);
    }
  };

  const generarPDFContratos = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Contratos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Estado", "Beneficiarios", "Cuotas", "Monto", "Fecha Inicio", "Fecha Fin", "ID Cliente"];
    const filas = contratosFiltrados.map((contrato) => [
      contrato.IDContrato,
      contrato.Estado,
      contrato.CantidadBeneficiarios,
      contrato.Cuotas,
      contrato.Monto,
      contrato.Fecha_inicio,
      contrato.Fecha_fin,
      contrato.IDCliente
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
      columnStyles: { cellWidth: 'auto' },
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
    const nombreArchivo = `contratos_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  const generarPDFDetalleContrato = (contrato) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(`Contrato ${contrato.IDContrato}`, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(`Estado: ${contrato.Estado}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Beneficiarios: ${contrato.CantidadBeneficiarios}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Cuotas: ${contrato.Cuotas}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Monto: C$ ${contrato.Monto}`, anchoPagina / 2, posicionY + 30, { align: "center" });
    pdf.text(`Fecha Inicio: ${contrato.Fecha_inicio}`, anchoPagina / 2, posicionY + 40, { align: "center" });
    pdf.text(`Fecha Fin: ${contrato.Fecha_fin}`, anchoPagina / 2, posicionY + 50, { align: "center" });
    pdf.text(`ID Cliente: ${contrato.IDCliente}`, anchoPagina / 2, posicionY + 60, { align: "center" });

    pdf.save(`contrato_${contrato.IDContrato}.pdf`);
  };

  const exportarExcelContratos = () => {
    const datos = contratosFiltrados.map((contrato) => ({
      ID: contrato.IDContrato,
      Estado: contrato.Estado,
      Beneficiarios: contrato.CantidadBeneficiarios,
      Cuotas: contrato.Cuotas,
      Monto: parseFloat(contrato.Monto),
      "Fecha Inicio": contrato.Fecha_inicio,
      "Fecha Fin": contrato.Fecha_fin,
      "ID Cliente": contrato.IDCliente
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Contratos");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `contratos_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
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
        <Col lg={3} md={4} sm={3}>
          <Button
            className="mb-3"
            onClick={() => generarPDFContratos()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar reporte PDF
          </Button>
        </Col>
        <Col lg={2} md={4} sm={3}>
          <Button
            className="mb-3"
            onClick={() => exportarExcelContratos()}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
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
        generarPDFDetalleContrato={generarPDFDetalleContrato}
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