import React, { useState, useEffect } from 'react';
import TablaModelo from '../components/Modelo/TablaModelo';
import ModalAgregarModelo from '../components/Modelo/ModalRegistroModelo';
import ModalEliminacionModelo from '../components/Modelo/ModalEliminacionModelo';
import ModalEdicionModelo from '../components/Modelo/ModalEdicionModelo';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
    Color: '',
    imagen: ''
  });
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [modeloAEliminar, setModeloAEliminar] = useState(null);
  const [modeloEditado, setModeloEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [enviando, setEnviando] = useState(false);

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
      setEnviando(true);
      const respuesta = await fetch('http://localhost:3007/api/modelos', {
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
        Color: '',
        imagen: ''
      });
      setMostrarModal(false);
      establecerPaginaActual(1);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setEnviando(false);
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
      const respuesta = await fetch(`http://localhost:3007/api/actualizarModelo/${modeloEditado.IDModelo}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: modeloEditado.Nombre,
          Modelo: modeloEditado.Modelo,
          Medida: modeloEditado.Medida,
          Color: modeloEditado.Color,
          imagen: modeloEditado.imagen
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

  const generarPDFModelos = () => {
    const doc = new jsPDF();
    
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Modelos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Modelo", "Medida", "Color"];
    const filas = modelosFiltrados.map((modelo) => [
      modelo.IDModelo,
      modelo.Nombre,
      modelo.Modelo,
      modelo.Medida,
      modelo.Color,
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
    const nombreArchivo = `modelos_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  const generarPDFDetalleModelo = (modelo) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(modelo.Nombre, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    if (modelo.imagen) {
      const propiedadesImagen = pdf.getImageProperties(modelo.imagen);
      const anchoImagen = 100;
      const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
      const posicionX = (anchoPagina - anchoImagen) / 2;
      pdf.addImage(modelo.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
      posicionY = 40 + altoImagen + 10;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`Modelo: ${modelo.Modelo}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Medida: ${modelo.Medida}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Color: ${modelo.Color}`, anchoPagina / 2, posicionY + 20, { align: "center" });

    pdf.save(`${modelo.Nombre}.pdf`);
  };

  const exportarExcelModelos = () => {
    const datos = modelosFiltrados.map((modelo) => ({
      ID: modelo.IDModelo,
      Nombre: modelo.Nombre,
      Modelo: modelo.Modelo,
      Medida: modelo.Medida,
      Color: modelo.Color,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Modelos");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `modelos_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
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
        <Col lg={3} md={4} sm={3}>
          <Button
            className="mb-3"
            onClick={() => generarPDFModelos()}
            variant="secondary"
            style={{ width: "100%" }}
            disabled={enviando}
          >
            Generar reporte PDF
          </Button>
        </Col>
        <Col lg={2} md={4} sm={3}>
          <Button
            className="mb-3"
            onClick={() => exportarExcelModelos()}
            variant="secondary"
            style={{ width: "100%" }}
            disabled={enviando}
          >
            Generar Excel
          </Button>
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
        generarPDFDetalleModelo={generarPDFDetalleModelo}
      />

      <ModalAgregarModelo
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoModelo={nuevoModelo}
        manejarCambioInput={manejarCambioInput}
        agregarModelo={agregarModelo}
        errorCarga={errorCarga}
        enviando={enviando}
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