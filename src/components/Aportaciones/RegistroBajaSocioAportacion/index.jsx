import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registraAportacionesSocios, 
    obtenerFolioActualAportaciones, 
} from "../../../api/aportaciones";
import Swal from "sweetalert2";

// Realiza el registro inicial de saldos de socios
export const registroAportacionInicial = async(
        fichaSocio,
        aportacion,
        fecha
        ) => {
    try {
        await obtenerFolioActualAportaciones().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                aportacion: aportacion,
                createdAt: fecha,
            }

            registraAportacionesSocios(dataTemp).then(response => {
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
