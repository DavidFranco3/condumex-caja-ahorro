import { getRazonSocial, getPeriodo } from '../../../api/auth'
import {
  registraAportacionesSocios,
  obtenerFolioActualAportaciones,
} from '../../../api/aportaciones'

// Realiza el registro inicial de saldos de socios
export const registroAportacionInicial = async (
  fichaSocio,
  aportacion,
  fecha
) => {
  try {
    await obtenerFolioActualAportaciones().then(response => {
      const { data } = response
      const { folio } = data

      const dataTemp = {
        folio,
        fichaSocio,
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        aportacion,
        createdAt: fecha,
      }

      registraAportacionesSocios(dataTemp).then(response => {
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
