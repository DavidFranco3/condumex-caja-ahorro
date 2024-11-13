import { useState, useEffect } from 'react';
import { obtenerNombreSocioEmpleado } from "../../../api/sociosEmpleados";

function NombreSocio(props) {
    const { id } = props;

    // Para almacenar el nombre del cliente
    const [nombreSocio, setNombreSocio] = useState("");

    const cargarNombreSocio= () => {
        //
        try {
            obtenerNombreSocioEmpleado(id).then(response => {
                const { data } = response;
                const { nombre } = data;
                setNombreSocio(nombre)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarNombreSocio();
    }, [id]);

    return (
        <>
            {nombreSocio}
        </>
    );
}

export default NombreSocio;