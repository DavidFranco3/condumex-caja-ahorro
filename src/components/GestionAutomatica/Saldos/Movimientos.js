import {
  registraMovimientoSaldos,
  obtenerFolioActualMovimientoSaldos,
} from '../../../api/movimientosSaldos'
import { actualizacionSaldosSocios } from './ActualizacionSaldos'
import { getRazonSocial, getPeriodo } from '../../../api/auth'

export const registraMovimientoSaldosSocios2 = async(
  fichaSocio,
  aportacion,
  prestamo,
  interesGenerado,
  patrimonio,
  rendimiento,
  retiro,
  abono,
  movimiento
) => {
  try {
    const razonSocial = getRazonSocial()
    const periodo = getPeriodo()
    const prestamoTotal = parseFloat(prestamo) + parseFloat(interesGenerado)

    const responseFolio = await obtenerFolioActualMovimientoSaldos()
    const {
      data: { folio },
    } = responseFolio
    const dataMovimiento = {
      folio,
      fichaSocio,
      tipo: razonSocial,
      periodo: periodo,
      aportacion,
      prestamo: parseFloat(interesGenerado),
      patrimonio,
      rendimiento,
      retiro,
      abono,
      movimiento,
    }
    await registraMovimientoSaldos(dataMovimiento)
  } catch (ex) {
    return { status: false, message: ex.message }
  }

  return { status: true, message: 'Movimiento registrado correctamente' }
}

// Registro de movimiento de saldos
export const registroMovimientosSaldosSocios = async (
  fichaSocio,
  aportacion,
  prestamo,
  interesGenerado,
  patrimonio,
  rendimiento,
  retiro,
  abono,
  movimiento
) => {
  try {
    //console.log('Cantidad recibida del prestamo ', prestamo)
    //console.log('Cantidad recibida de intereses ', interesGenerado)
    // console.log(typeof prestamo)
    // console.log(typeof interesGenerado)
    const prestamoTotal = parseFloat(prestamo) + parseFloat(interesGenerado)
    await obtenerFolioActualMovimientoSaldos()
      .then((response) => {
        const { data } = response
        const { folio } = data

        const dataTemp = {
          folio: folio,
          fichaSocio: fichaSocio,
          tipo: getRazonSocial(),
          periodo: getPeriodo(),
          aportacion: aportacion,
          prestamo: parseFloat(interesGenerado),
          patrimonio: patrimonio,
          rendimiento: rendimiento,
          retiro: retiro,
          abono: abono,
          movimiento: movimiento,
        }

        // console.log(dataTemp)

        // Registra movimientos para conformar el log
        registraMovimientoSaldos(dataTemp)
          .then((response) => {
            const { data } = response
            const { datos } = data
            const { folio } = datos
            // console.log("Registro de movimiento")
            //console.log(' ')
            //console.log('Dato del prestamo a enviar ', prestamoTotal)
            //console.log(' ')
          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((e) => {
        console.log(e)
      })
  } catch (e) {
    console.log(e)
  }
}
