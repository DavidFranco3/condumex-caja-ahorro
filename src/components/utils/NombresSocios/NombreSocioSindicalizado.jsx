import { useState, useEffect } from 'react';
import {obtenerNombreSocioSindicalizado} from "../../../api/sociosSindicalizados";
import {toast} from "react-toastify";

function NombreSocio(props) {
    const { fichaSocio } = props;

    // Para almacenar el nombre del cliente
    const [nombreSocio, setNombreSocio] = useState("");

    useEffect(() => {
        //
        try {
            obtenerNombreSocioSindicalizado(fichaSocio).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombre } = data;
                setNombreSocio(nombre)
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
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
