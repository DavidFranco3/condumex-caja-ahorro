import { useState, useEffect } from 'react';
import {obtenerNombreSocioEmpleado} from "../../../api/sociosEmpleados";
import Swal from "sweetalert2";

function NombreSocio(props) {
    const { fichaSocio } = props;

    // Para almacenar el nombre del cliente
    const [nombreSocio, setNombreSocio] = useState("");

    useEffect(() => {
        //
        try {
            obtenerNombreSocioEmpleado(fichaSocio).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombre } = data;
                setNombreSocio(nombre)
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                     Swal.fire({
                        title: "Conexión al servidor no disponible",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, [fichaSocio]);

    return (
        <>
            {nombreSocio}
        </>
    );
}

export default NombreSocio;
