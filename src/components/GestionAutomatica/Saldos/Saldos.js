import { getRazonSocial } from '../../../api/auth'
import {
  registroInicialSaldosSocio,
  obtenerFolioActualSaldosSocios,
} from '../../../api/saldosSocios'

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
      const { data } = response
      const { folio } = data

      const dataTemp = {
        folio,
        fichaSocio,
        tipo: getRazonSocial(),
        aportacion,
        patrimonio,
        rendimiento,
        folioMovimiento,
        movimiento
      }

      registroInicialSaldosSocio(dataTemp).then(response => {
        const { data } = response
        console.log(data)
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
