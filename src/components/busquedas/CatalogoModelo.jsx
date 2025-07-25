import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import Tarjeta from '../Tarjeta'; // Asegúrate de que la ruta sea correcta
import CuadroBusquedas from '../busquedas/CuadroBusquedas'; // Asegúrate de que la ruta sea correcta
import Paginacion from '../ordenamiento/Paginacion'; // Asegúrate de que la ruta sea correcta
import CarouselProductImage from '../carousel/CarouselProductoImagen'; // Asegúrate de que la ruta sea correcta
import ModalAgregarModelo from '../Modelo/ModalRegistroModelo'; // Asegúrate de que la ruta sea correcta
import './CatalogoModelo.css'; // Archivo CSS opcional para estilos

const CatalogoModelo = () => {
  const [listaModelos, setListaModelos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modelosDestacados, setModelosDestacados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoModelo, setNuevoModelo] = useState({
    Nombre: '',
    Modelo: '',
    Medida: '',
    Color: '',
    imagen: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const elementosPorPagina = 16;

  // Obtener modelos
  const obtenerModelos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/modelos');
      if (!respuesta.ok) throw new Error('Error al cargar los modelos');
      const datos = await respuesta.json();
      console.log('Datos de modelos recibidos:', datos[0]); // Debug
      setListaModelos(datos);
      setModelosFiltrados(datos);

      // Seleccionar los primeros 3 modelos como destacados
      const destacados = datos.slice(0, 3);
      console.log('Modelos destacados:', destacados[0]); // Debug
      setModelosDestacados(destacados);

      setCargando(false);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerModelos();
  }, []);

  // Manejar cambios en la búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    setPaginaActual(1);

    const filtrados = listaModelos.filter(
      (modelo) =>
        modelo.Nombre.toLowerCase().includes(texto) ||
        (modelo.Modelo && modelo.Modelo.toLowerCase().includes(texto)) ||
        (modelo.Medida && modelo.Medida.toString().toLowerCase().includes(texto)) ||
        (modelo.Color && modelo.Color.toLowerCase().includes(texto))
    );
    setModelosFiltrados(filtrados);
  };

  // Manejar cambios en el formulario del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoModelo((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar nuevo modelo
  const agregarModelo = async () => {
    // Validación básica
    if (!nuevoModelo.Nombre || 
      !nuevoModelo.Modelo || 
      !nuevoModelo.Medida || 
      !nuevoModelo.Color) {
      setErrorFormulario('Todos los campos son obligatorios');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch('http://localhost:3007/api/modelos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoModelo)
      });
      if (!respuesta.ok) throw new Error('Error al agregar el modelo');
      const modeloAgregado = await respuesta.json();
      setListaModelos((prev) => [...prev, modeloAgregado]);
      setModelosFiltrados((prev) => [...prev, modeloAgregado]);
      setMostrarModal(false);
      setNuevoModelo({ Nombre: '', Modelo: 
        '', Medida: '',
         Color: '', 
         imagen: '' });
      setErrorFormulario(null);
    } catch (error) {
      console.error('Error al agregar modelo:', error);
      setErrorFormulario(error.message);
    } finally {
      setEnviando(false);
    }
  };

  // Calcular modelos paginados
  const modelosPaginados = modelosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Determinar si se debe mostrar el carrusel
  const mostrarCarrusel = textoBusqueda === '';

  if (cargando) return <div className="text-center p-4">Cargando...</div>;
  if (errorCarga) return <div className="text-danger text-center p-4">Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <h4>Catálogo de Modelos de Ataúdes</h4>
      <Row className="mb-4 align-items-center">
        <Col lg={2} md={3} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            Agregar Modelo
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {/* Modal para agregar modelo */}
      <ModalAgregarModelo
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoModelo={nuevoModelo}
        manejarCambioInput={manejarCambioInput}
        agregarModelo={agregarModelo}
        errorCarga={errorFormulario}
        enviando={enviando}
      />

      {/* Carrusel de modelos destacados */}
      {mostrarCarrusel && (
        <div className="mb-5">
          <h5 className="mb-3">Modelos Destacados</h5>
          <div className="carousel-container">
            {modelosDestacados.length > 0 ? (
              <Carousel interval={3000} className="product-carousel" indicators={true} controls={true}>
                {modelosDestacados.map((modelo) => (
                  <Carousel.Item key={modelo.IDModelo}>
                    <CarouselProductImage imagen={modelo.imagen} nombre={modelo.Nombre} />
                    <Carousel.Caption>
                      <h3>{modelo.Nombre}</h3>
                      <p>Modelo: {modelo.Modelo}</p>
                      <p>Medida: {modelo.Medida}</p>
                      <p>Color: {modelo.Color}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="text-center p-4">No hay modelos destacados disponibles</div>
            )}
          </div>
        </div>
      )}

      <Row>
        {modelosPaginados.map((modelo, indice) => (
          <Tarjeta
            key={modelo.IDModelo}
            indice={indice}
            Nombre={modelo.Nombre}
            Modelo={modelo.Modelo}
            Medida={modelo.Medida}
            Color={modelo.Color}
            IDModelo={modelo.IDModelo}
            imagen={modelo.imagen}
          />
        ))}
      </Row>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={modelosFiltrados.length}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />
    </Container>
  );
};

export default CatalogoModelo;