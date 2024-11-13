import { getRazonSocial, getTokenApi, obtenidusuarioLogueado } from "../../../api/auth";
import { registroInicialSaldosSocio, 
    actualizaSaldosSocios, 
    obtenerFolioActualSaldosSocios, 
    obtenerInfoxFichaSaldoSocios 
} from "../../../api/saldosSocios";
import { toast } from "react-toastify";
import { actualizacionSaldosGlobales } from "../SaldosGlobales/SaldosGlobales";

// Realiza el registro inicial de saldos de socios
export const registroSaldoInicial = async (
        fichaSocio,
        aportacion,
        patrimonio,
        rendimiento,
        folioMovimiento,
        movimiento
        ) => {
    try {
        await obtenerFolioActualSaldosSocios().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                aportacion: aportacion,
                patrimonio: patrimonio,
                rendimiento: rendimiento,
                folioMovimiento: folioMovimiento,
                movimiento: movimiento
            }

            registroInicialSaldosSocio(dataTemp).then(response => {
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
