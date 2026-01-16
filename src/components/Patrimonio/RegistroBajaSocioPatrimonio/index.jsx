import { getRazonSocial, getPeriodo } from '../../../api/auth'
import {
  registraPatrimonio,
  obtenerFolioActualPatrimonio,
} from '../../../api/patrimonio'

// Realiza el registro inicial de saldos de socios
export function registroPatrimonioInicial (
  fichaSocio,
  patrimonio,
  fecha
) {
  try {
    obtenerFolioActualPatrimonio().then(response => {
      const { data } = response
      const { folio } = data

      const dataTemp = {
        folio,
        fichaSocio,
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        patrimonio,
        createdAt: fecha,
      }

      registraPatrimonio(dataTemp).then(response => {
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
