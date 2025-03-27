import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  return (
    <Container>
      <h1>¡Bienvenido, {nombreUsuario}!</h1>
      <p>Vamos que si se puede 👍</p>
      <p>"¡Levántese, señor! Que cada día hay que cumplir una meta más, porque el éxito no espera y los sueños solo se alcanzan con esfuerzo y determinación." 🚀🔥.</p>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </Container>
  );
};

export default Inicio;