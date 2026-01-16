import { getRazonSocial, getPeriodo } from '../../../api/auth'
import {
  registraRendimientosSocios,
  obtenerFolioActualRendimientos,
} from '../../../api/rendimientos'

// Realiza el registro inicial de saldos de socios
export function registroRendimientoInicial (
  fichaSocio,
  rendimiento,
  fecha
) {
  try {
    obtenerFolioActualRendimientos().then(response => {
      const { data } = response
      const { folio } = data

      const dataTemp = {
        folio,
        fichaSocio,
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        rendimiento,
        createdAt: fecha,
      }

      registraRendimientosSocios(dataTemp).then(response => {
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
