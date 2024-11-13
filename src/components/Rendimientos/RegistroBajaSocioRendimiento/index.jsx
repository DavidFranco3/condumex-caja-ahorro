import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registraRendimientosSocios, 
    obtenerFolioActualRendimientos, 
} from "../../../api/rendimientos";
import { toast } from "react-toastify";

// Realiza el registro inicial de saldos de socios
export function registroRendimientoInicial (
        fichaSocio,
        rendimiento,
        fecha
        ) {
    try {
        obtenerFolioActualRendimientos().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                rendimiento: rendimiento,
                createdAt: fecha,
            }

            registraRendimientosSocios(dataTemp).then(response => {
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