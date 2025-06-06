import React from "react";
import { Navigate } from "react-router-dom";

const RutasProtegida = ({vista}) =>{

    const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

    console.log("Usuario autenticado", estaLogueado);

    return estaLogueado ? vista : <Navigate to="/" replace />;
};

export default RutasProtegida;