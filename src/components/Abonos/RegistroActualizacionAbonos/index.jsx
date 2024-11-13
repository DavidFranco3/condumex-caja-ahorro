import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registraAbonos, 
    actualizaAbonos, 
    obtenerFolioActualAbono, 
    obtenerDatosAbonos 
} from "../../../api/abonos";
import { toast } from "react-toastify";

// Realiza el registro inicial de saldos de socios
export function registroAbonoInicial (
        fichaSocio,
        abono,
        movimiento,
        fecha
        ) {
    try {
        obtenerFolioActualAbono().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                abono: abono,
                movimiento: movimiento,
                createdAt: fecha,
            }

            registraAbonos(dataTemp).then(response => {
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
export function actualizacionAbonos (fichaSocio, ingresaAbono, movimiento, ingresaFecha) {
    try {
        obtenerDatosAbonos(fichaSocio).then(response => {
            console.log("socio a actualizar: ", fichaSocio)
            const { data } = response;
            const { _id,  abono, fechaCreacion } = data;
            // Se recibe solamente lo ingresado, hya que sumar lo ingresado con lo que tiene en ->
            // Aportaciones, prestamos, patrimonio
            console.log(ingresaAbono, movimiento)
            let finalAbono = abono;
            let finalFecha = ingresaFecha;

            // Evaluar caso especial en caso de eliminar la aportación
            if (movimiento === "Abono"){
                finalAbono = parseFloat(finalAbono) + parseFloat(ingresaAbono);
            }

            const dataTemp = {
                
                fichaSocio: parseInt(fichaSocio),
                abono: finalAbono,
                movimiento: movimiento,
                createdAt: finalFecha
            }

            // Inicia actualización de saldos de los socios
            actualizaAbonos(_id, dataTemp).then(response => {
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