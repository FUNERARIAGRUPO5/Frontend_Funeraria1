import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Carousel, Button } from 'react-bootstrap';
import Tarjeta from '../components/Tarjeta'; // Asegúrate de que la ruta sea correcta
import CarouselProductImage from '../components/carousel/CarouselProductoImagen'; // Asegúrate de que la ruta sea correcta
import ModalAgregarModelo from '../components/Modelo/ModalRegistroModelo'; // Asegúrate de que la ruta sea correcta
import '../CatalogoModelos.css'; // Archivo CSS opcional para estilos personalizados

const CatalogoModelos = () => {
  const [listaModelos, setListaModelos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modelosDestacados, setModelosDestacados] = useState([]);
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
  const [enviando, setEnviando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);

  // Obtener modelos
  const obtenerModelos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/modelos'); // Ajusta la URL según tu API
      if (!respuesta.ok) throw new Error('Error al cargar los modelos');
      const datos = await respuesta.json();
      console.log('Datos de modelos recibidos:', datos[0]); // Debug
      setListaModelos(datos);

      // Simulamos modelos destacados (los primeros 3)
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

  // Manejar cambios en el formulario del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoModelo((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar nuevo modelo
  const agregarModelo = async () => {
    // Validación básica
    if (!nuevoModelo.Nombre || !nuevoModelo.Modelo || !nuevoModelo.Medida || !nuevoModelo.Color) {
      setErrorFormulario('Todos los campos son obligatorios');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch('http://localhost:3000/api/modelos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoModelo)
      });
      if (!respuesta.ok) throw new Error('Error al agregar el modelo');
      const modeloAgregado = await respuesta.json();
      setListaModelos((prev) => [...prev, modeloAgregado]);
      setMostrarModal(false);
      setNuevoModelo({ Nombre: '', Modelo: '', Medida: '', Color: '', imagen: '' });
      setErrorFormulario(null);
    } catch (error) {
      console.error('Error al agregar modelo:', error);
      setErrorFormulario(error.message);
    } finally {
      setEnviando(false);
    }
  };

  // Filtrar modelos basado en la búsqueda
  const modelosFiltrados = listaModelos.filter((modelo) =>
    modelo.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Determinar si se debe mostrar el carrusel
  const mostrarCarrusel = busqueda === '';

  if (cargando) return <div className="text-center p-4">Cargando...</div>;
  if (errorCarga) return <div className="text-danger text-center p-4">Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <h4>Catálogo de Modelos de Ataúdes</h4>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Agregar Nuevo Modelo
        </Button>
        <Form.Group className="w-50">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre del modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar modelos"
          />
        </Form.Group>
      </div>

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

      {/* Lista de modelos */}
      <Row>
        {modelosFiltrados.map((modelo, indice) => (
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
    </Container>
  );
};

export default CatalogoModelos;