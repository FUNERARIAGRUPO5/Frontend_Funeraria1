import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Image } from "react-bootstrap";
import logo from "../assets/logo .jpg"; // Using the logo from the previous context
import Proposito from "../components/inicio/Proposito"; // Placeholder component similar to the first example

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
    <h1 className="text-center m-4">¡Bienvenido, {nombreUsuario}!</h1>
    <Image style={{ width: "90%" }} src={logo} fluid rounded />
    <Proposito />
  </Container>
);
};

export default Inicio;