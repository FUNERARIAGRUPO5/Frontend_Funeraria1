import { Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Estadodecontrato = ({ estados, cantidadesPorEstado }) => {
  const chartRef = useRef(null);

  const data = {
    labels: estados,
    datasets: [
      {
        label: 'Contratos',
        data: cantidadesPorEstado,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estados de Contrato',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad',
        },
        min: 0,
      },
      x: {
        title: {
          display: true,
          text: 'Estados',
        },
      },
    },
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Reporte de Estados de Contrato', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    const chartInstance = chartRef.current;
    const chartCanvas = chartInstance?.canvas;
    const chartImage = chartCanvas?.toDataURL('image/png', 1.0);

    if (chartImage) {
      doc.addImage(chartImage, 'PNG', 14, 40, 180, 100);
    }

    const columnas = ['Estado', 'Cantidad'];
    const filas = estados.map((estado, index) => [estado, cantidadesPorEstado[index] || 0]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 150,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
    });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `EstadosDeContrato_${dia}-${mes}-${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Estados de Contrato</Card.Title>
        <div style={{ height: '300px', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          {estados.length > 0 ? (
            <Bar ref={chartRef} data={data} options={options} />
          ) : (
            <p>No hay datos disponibles para mostrar el gráfico.</p>
          )}
        </div>
        <Button className="btn btn-primary mt-3" onClick={generarPDF} disabled={estados.length === 0}>
          Generar Reporte <i className="bi bi-download"></i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Estadodecontrato;