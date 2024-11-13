import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registraPrestamos, 
    actualizaPrestamos, 
    obtenerFolioActualPrestamo, 
    obtenerInfoxPrestamos 
} from "../../../api/prestamos";
import { toast } from "react-toastify";

// Realiza el registro inicial de saldos de socios
export function registroPrestamoInicial (
        fichaSocio,
        prestamo,
        prestamoTotal,
        tasaInteres,
        movimiento,
        fecha
        ) {
    try {
        obtenerFolioActualPrestamo().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                prestamo: prestamo,
                prestamoTotal: prestamoTotal,
                tasaInteres: tasaInteres,
                movimiento: movimiento,
                createdAt: fecha,
            }

            registraPrestamos(dataTemp).then(response => {
                const { data } = response;
            }).catch(e => {
                console.log(e)
            })

        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        // console.log(e)
    }
}

// Realiza la modificación de saldos al realizar un movimiento
export function actualizacionPrestamos (fichaSocio, ingresaPrestamo, ingresaPrestamoTotal, ingresaTasaInteres, movimiento, ingresaFecha) {
    try {
        obtenerInfoxPrestamos(fichaSocio).then(response => {
            const { data } = response;
            const { _id,  prestamo, prestamoTotal, tasaInteres, fechaCreacion } = data;
            // Se recibe solamente lo ingresado, hya que sumar lo ingresado con lo que tiene en ->
            // Aportaciones, prestamos, patrimonio
            let finalPrestamoTotal = prestamoTotal;
            let finalPrestamo = prestamo;
            let finalTasaInteres = tasaInteres;
            let finalFecha = ingresaFecha;

            // Evaluar caso especial en caso de eliminar la aportación
            if (movimiento === "Prestamo"){
                finalPrestamoTotal = parseFloat(finalPrestamoTotal) + parseFloat(ingresaPrestamoTotal);
                finalPrestamo = parseFloat(finalPrestamo) + parseFloat(ingresaPrestamo);
            } else if (movimiento === "Abono"){
                finalPrestamoTotal = parseFloat(finalPrestamoTotal) - parseFloat(ingresaPrestamoTotal);
            } else if (movimiento === "Eliminación abono"){
                finalPrestamoTotal = parseFloat(finalPrestamoTotal) + parseFloat(ingresaPrestamoTotal);
            }

            const dataTemp = {
                
                fichaSocio: parseInt(fichaSocio),
                prestamo: finalPrestamo,
                prestamoTotal: finalPrestamoTotal,
                tasaInteres: finalTasaInteres,
                movimiento: movimiento,
                createdAt: finalFecha
            }

            // Inicia actualización de saldos de los socios
            actualizaPrestamos(_id, dataTemp).then(response => {
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