import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import TablaBeneficiarios from "../components/beneficiario/TabalBeneficiarios";
import ModalRegistroBeneficiario from "../components/beneficiario/ModalRegistroBeneficiario";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalEdicionBeneficiario from "../components/beneficiario/ModalEdicionBeneficiario";
import ModalEliminacionBeneficiario from "../components/beneficiario/ModalEliminacionBeneficiario";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    const elementosPorPagina = 5;
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [beneficiarioAEliminar, setBeneficiarioAEliminar] = useState(null);
    const [beneficiarioEditado, setBeneficiarioEditado] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const obtenerBeneficiarios = async () => {
        try {
            setCargando(true);
            const respuesta = await fetch("http://localhost:3007/api/Beneficiarios");
            if (!respuesta.ok) throw new Error("Error al cargar los beneficiarios");
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
            [name]: value,
        }));
    };

    const manejarCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setBeneficiarioEditado((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const agregarBeneficiario = async () => {
        if (
            !nuevoBeneficiario.Nombre ||
            !nuevoBeneficiario.Apellido ||
            !nuevoBeneficiario.Cedula ||
            !nuevoBeneficiario.Telefono ||
            !nuevoBeneficiario.IDContratos
        ) {
            setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:3007/api/registrarbeneficiario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoBeneficiario),
            });
            if (!respuesta.ok) throw new Error("Error al agregar el beneficiario");

            await obtenerBeneficiarios();
            setNuevoBeneficiario({
                Nombre: "",
                Apellido: "",
                Cedula: "",
                Telefono: "",
                IDContratos: "",
            });
            setMostrarModal(false);
            establecerPaginaActual(1);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
        }
    };

    const eliminarBeneficiario = async () => {
        if (!beneficiarioAEliminar) return;

        try {
            const respuesta = await fetch(
                `http://localhost:3007/api/eliminarbeneficiario/${beneficiarioAEliminar.IDBeneficiarios}`,
                {
                    method: "DELETE",
                }
            );
            if (!respuesta.ok) throw new Error("Error al eliminar el beneficiario");

            await obtenerBeneficiarios();
            setMostrarModalEliminacion(false);
            establecerPaginaActual(1);
            setBeneficiarioAEliminar(null);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
        }
    };

    const actualizarBeneficiario = async () => {
        if (
            !beneficiarioEditado?.Nombre ||
            !beneficiarioEditado?.Apellido ||
            !beneficiarioEditado?.Cedula ||
            !beneficiarioEditado?.Telefono ||
            !beneficiarioEditado?.IDContratos
        ) {
            setErrorCarga("Por favor, completa todos los campos antes de guardar.");
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3007/api/actualizarbeneficiario/${beneficiarioEditado.IDBeneficiarios}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Nombre: beneficiarioEditado.Nombre,
                        Apellido: beneficiarioEditado.Apellido,
                        Cedula: beneficiarioEditado.Cedula,
                        Telefono: beneficiarioEditado.Telefono,
                        IDContratos: beneficiarioEditado.IDContratos,
                    }),
                }
            );
            if (!respuesta.ok) throw new Error("Error al actualizar el beneficiario");

            await obtenerBeneficiarios();
            setMostrarModalEdicion(false);
            setBeneficiarioEditado(null);
            setErrorCarga(null);
        } catch (error) {
            setErrorCarga(error.message);
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
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        establecerPaginaActual(1);

        const filtrados = listaBeneficiarios.filter(
            (beneficiario) =>
                (beneficiario.Nombre && beneficiario.Nombre.toLowerCase().includes(texto)) ||
                (beneficiario.Apellido && beneficiario.Apellido.toLowerCase().includes(texto)) ||
                (beneficiario.Cedula && String(beneficiario.Cedula).toLowerCase().includes(texto)) ||
                (beneficiario.Telefono && String(beneficiario.Telefono).toLowerCase().includes(texto))
        );
        setBeneficiariosFiltrados(filtrados);
    };

    const generarPDFBeneficiarios = () => {
        const doc = new jsPDF();

        // Encabezado del PDF
        doc.setFillColor(28, 41, 51);
        doc.rect(0, 0, 220, 30, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.text("Lista de Beneficiarios", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

        const columnas = ["ID", "Nombre", "Apellido", "Cédula", "Teléfono", "ID Contrato"];
        const filas = beneficiariosFiltrados.map((beneficiario) => [
            beneficiario.IDBeneficiarios,
            beneficiario.Nombre,
            beneficiario.Apellido,
            beneficiario.Cedula,
            beneficiario.Telefono,
            beneficiario.IDContratos,
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
                0: { cellWidth: "auto" },
                1: { cellWidth: "auto" },
                2: { cellWidth: "auto" },
                3: { cellWidth: "auto" },
                4: { cellWidth: "auto" },
                5: { cellWidth: "auto" },
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

        if (typeof doc.putTotalPages === "function") {
            doc.putTotalPages(totalPaginas);
        }

        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();
        const nombreArchivo = `beneficiarios_${dia}${mes}${anio}.pdf`;
        doc.save(nombreArchivo);
    };

    const generarPDFDetalleBeneficiario = (beneficiario) => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();

        // Encabezado
        pdf.setFillColor(28, 41, 51);
        pdf.rect(0, 0, 220, 30, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text(`${beneficiario.Nombre} ${beneficiario.Apellido}`, anchoPagina / 2, 18, {
            align: "center",
        });

        let posicionY = 50;

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.text(`ID: ${beneficiario.IDBeneficiarios}`, anchoPagina / 2, posicionY, {
            align: "center",
        });
        pdf.text(`Nombre: ${beneficiario.Nombre}`, anchoPagina / 2, posicionY + 10, {
            align: "center",
        });
        pdf.text(`Apellido: ${beneficiario.Apellido}`, anchoPagina / 2, posicionY + 20, {
            align: "center",
        });
        pdf.text(`Cédula: ${beneficiario.Cedula}`, anchoPagina / 2, posicionY + 30, {
            align: "center",
        });
        pdf.text(`Teléfono: ${beneficiario.Telefono}`, anchoPagina / 2, posicionY + 40, {
            align: "center",
        });
        pdf.text(`ID Contrato: ${beneficiario.IDContratos}`, anchoPagina / 2, posicionY + 50, {
            align: "center",
        });

        pdf.save(`${beneficiario.Nombre}_${beneficiario.Apellido}.pdf`);
    };

    const exportarExcelBeneficiarios = () => {
        const datos = beneficiariosFiltrados.map((beneficiario) => ({
            ID: beneficiario.IDBeneficiarios,
            Nombre: beneficiario.Nombre,
            Apellido: beneficiario.Apellido,
            Cédula: beneficiario.Cedula,
            Teléfono: beneficiario.Telefono,
            "ID Contrato": beneficiario.IDContratos,
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Beneficiarios");

        const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();
        const nombreArchivo = `beneficiarios_${dia}${mes}${anio}.xlsx`;

        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, nombreArchivo);
    };

    const beneficiariosPaginados = beneficiariosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    return (
        <Container className="mt-5">
            <br />
            <h4>Beneficiarios</h4>
            <Row>
                <Col lg={2} md={4} sm={3} xs={5}>
                    <Button
                        variant="primary"
                        onClick={() => setMostrarModal(true)}
                        style={{ width: "100%" }}
                    >
                        Nuevo Beneficiario
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
                        onClick={() => generarPDFBeneficiarios()}
                        variant="secondary"
                        style={{ width: "100%" }}
                    >
                        Generar reporte PDF
                    </Button>
                </Col>
                <Col lg={3} md={4} sm={3} xs={3}>
                    <Button
                        className="mb-3"
                        onClick={() => exportarExcelBeneficiarios()}
                        variant="secondary"
                        style={{ width: "100%" }}
                    >
                        Generar Excel
                    </Button>
                </Col>
            </Row>
            <br />
            <br />
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
                generarPDFDetalleBeneficiario={generarPDFDetalleBeneficiario}
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