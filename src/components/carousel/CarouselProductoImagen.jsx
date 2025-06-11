import React from 'react';
// Uncomment and install 'react-awesome-reveal' if you want animation
// import { Zoom } from "react-awesome-reveal";

const CarouselProductImage = ({ imagen, nombre }) => {
  return (
    // Uncomment and adjust Col size if using react-bootstrap
    // <Col lg={12} className="mt-3">
    //   <Zoom cascade delay={10} duration={600}>
    <div 
      style={{ 
        width: '100%',
        height: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
          zIndex: 1
        }}
      />
      <img
        src={imagen ? `data:image/jpeg;base64,${imagen}` : 'https://via.placeholder.com/800x400?text=Imagen+no+disponible'}
        alt={nombre}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(1.1)'
        }}
      />
    </div>
    //   </Zoom>
    // </Col>
  );
};

export default CarouselProductImage;