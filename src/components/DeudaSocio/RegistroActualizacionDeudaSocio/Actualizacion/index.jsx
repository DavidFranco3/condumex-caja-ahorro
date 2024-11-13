import { getRazonSocial, getTokenApi, obtenidusuarioLogueado } from "../../../../api/auth";
import { registraDeudaSocio, 
    actualizaDeudaSocio, 
    obtenerFolioActualDeudaSocio, 
    obtenerDatosDeudaSocio 
} from "../../../../api/deudaSocio";
import { toast } from "react-toastify";

// Realiza la modificación de saldos al realizar un movimiento
export function actualizacionDeudaSocio (ingresaFichaSocio, ingresaAbono, ingresaPrestamo, movimiento, ingresaFecha) {
    try {
        const ingresaFecha = ingresaFecha.split("T");
        console.log(ingresaFecha)
        obtenerDatosDeudaSocio(ingresaFichaSocio).then(response => {
            
            const { data } = response;
            const { _id, fichaSocio, abonoTotal, prestamoTotal, fechaCreacion } = data;
            
            const fechaToCurrentTimezone = (fecha) => {
            const date = new Date(fecha);

            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


            return date.toISOString().slice(0, 16);
            };
            
            // Se recibe solamente lo ingresado, hya que sumar lo ingresado con lo que tiene en ->
            // Aportaciones, prestamos, patrimonio
            let finalFichaSocio = fichaSocio;
            let finalAbono = abonoTotal;
            let finalPrestamo = prestamoTotal;
            let finalFecha = fechaToCurrentTimezone(fechaCreacion);
            finalFecha = finalFecha.split("T")
            console.log(finalFecha)

            // Evaluar caso especial en caso de eliminar la aportación
             if (movimiento === "Prestamo"){
                finalPrestamo = parseFloat(finalPrestamo) + parseFloat(ingresaPrestamo);
            } else if (movimiento === "Eliminación prestamo") {
                finalPrestamo = parseFloat(finalPrestamo) - parseFloat(ingresaPrestamo);
            } else if (movimiento === "Modificación prestamo") {
                finalPrestamo = parseFloat(finalPrestamo) + parseFloat(ingresaPrestamo);
            } else if (movimiento === "Abono"){
                finalAbono = parseFloat(finalAbono) + parseFloat(ingresaAbono);
            } else if (movimiento === "Eliminación abono") {
                finalAbono = parseFloat(finalAbono) - parseFloat(ingresaAbono);
            }

            const dataTemp = {
                
                fichaSocio: parseInt(fichaSocio),
                abonoTotal: finalAbono,
                prestamoTotal: finalPrestamo,
                movimiento: movimiento,
                createdAt: ingresaFecha
            }
            
            console.log

            // Inicia actualización de saldos de los socios
            actualizaDeudaSocio(_id, dataTemp).then(response => {
                const { data } = response;
                // console.log("Actualización de saldo personal")
            }).catch(e => {
                // console.log(e)
            })
            // Termina actualización de saldos de los socios

        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        // console.log(e)
    }
}
