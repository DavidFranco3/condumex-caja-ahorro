import {
  registraMovimientoSaldos,
  obtenerFolioActualMovimientoSaldos,
} from '../../../api/movimientosSaldos'
import { getRazonSocial, getPeriodo } from '../../../api/auth'

export const registraMovimientoSaldosSocios2 = async (
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

    const responseFolio = await obtenerFolioActualMovimientoSaldos()
    const {
      data: { folio },
    } = responseFolio
    const dataMovimiento = {
      folio,
      fichaSocio,
      tipo: razonSocial,
      periodo,
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
    await obtenerFolioActualMovimientoSaldos()
      .then((response) => {
        const { data } = response
        const { folio } = data

        const dataTemp = {
          folio,
          fichaSocio,
          tipo: getRazonSocial(),
          periodo: getPeriodo(),
          aportacion,
          prestamo: parseFloat(interesGenerado),
          patrimonio,
          rendimiento,
          retiro,
          abono,
          movimiento,
        }

        // console.log(dataTemp)

        // Registra movimientos para conformar el log
        registraMovimientoSaldos(dataTemp)
          .then((response) => {
            const { data } = response
            console.log(data)
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
