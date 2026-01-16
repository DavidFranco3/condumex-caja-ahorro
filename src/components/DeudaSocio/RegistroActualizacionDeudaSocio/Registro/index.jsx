import { getRazonSocial, getPeriodo } from '../../../../api/auth'
import {
  registraDeudaSocio,
  obtenerFolioActualDeudaSocio,
} from '../../../../api/deudaSocio'

// Realiza el registro inicial de saldos de socios
export function registroDeudaSocioInicial (fichaSocio, abonoTotal, prestamoTotal, movimiento, fecha) {
  console.log('ficha recibida', fichaSocio)
  try {
    obtenerFolioActualDeudaSocio().then(response => {
      const { data } = response
      const { folio } = data
      console.log('folio generado', folio)
      const dataTemp = {
        folio,
        fichaSocio: parseInt(fichaSocio),
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        abonoTotal,
        prestamoTotal,
        movimiento,
        createdAt: fecha,
      }

      registraDeudaSocio(dataTemp).then(response => {
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
