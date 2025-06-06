import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Tarjeta from '../Tarjeta';
import CuadroBusquedas from '../busquedas/CuadroBusquedas';
import Paginacion from '../ordenamiento/Paginacion';

const CatalogoModelo = () => {
  const [listaModelos, setListaModelos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 16;

  // Obtener modelos
  const obtenerModelos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:3007/api/modelos');
      if (!respuesta.ok) throw new Error('Error al cargar los modelos');
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

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    setPaginaActual(1);

    const filtrados = listaModelos.filter(
      (modelo) =>
        modelo.Nombre.toLowerCase().includes(texto) ||
        (modelo.Modelo && modelo.Modelo.toLowerCase().includes(texto)) ||
        (modelo.Medida && modelo.Medida.toString().includes(texto))
    );
    setModelosFiltrados(filtrados);
  };

  const modelosPaginados = modelosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  if (cargando) return <div>Cargando...</div>;
  if (errorCarga) return <div>Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <br />
      <h4>Catálogo de Modelos</h4>
      <br />
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}></Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br /><br />
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