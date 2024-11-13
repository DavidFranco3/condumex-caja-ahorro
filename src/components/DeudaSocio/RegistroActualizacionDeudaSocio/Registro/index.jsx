import { getRazonSocial, getPeriodo } from "../../../../api/auth";
import { registraDeudaSocio, 
    actualizaDeudaSocio, 
    obtenerFolioActualDeudaSocio, 
    obtenerDatosDeudaSocio 
} from "../../../../api/deudaSocio";
import { toast } from "react-toastify";

// Realiza el registro inicial de saldos de socios
export function registroDeudaSocioInicial (fichaSocio, abonoTotal, prestamoTotal, movimiento, fecha) {
    console.log("ficha recibida", fichaSocio);
    try {
        obtenerFolioActualDeudaSocio().then(response => {
            const { data } = response;
            const { folio } = data;
            console.log("folio generado", folio);
            const dataTemp = {
                folio: folio,
                fichaSocio: parseInt(fichaSocio),
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                abonoTotal: abonoTotal,
                prestamoTotal: prestamoTotal,
                movimiento: movimiento,
                createdAt: fecha,
            }

            registraDeudaSocio(dataTemp).then(response => {
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