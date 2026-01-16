import { getRazonSocial, getPeriodo } from '../../../api/auth'
import {
  registraDeudaSocio,
  actualizaDeudaSocio,
  obtenerFolioActualDeudaSocio,
  obtenerDatosDeudaSocio
} from '../../../api/deudaSocio'

// Realiza la modificación de saldos al realizar un movimiento
export const actualizacionDeudaSocio = async (fichaSocio, ingresaAbono, ingresaPrestamo, movimiento, ingresaFecha) => {
  try {
    await obtenerDatosDeudaSocio(fichaSocio).then(response => {
      const { data } = response

      if (!data) {
        // console.log("No se encontraron datos de deuda para el socio");
        return
      }

      const { _id, abonoTotal, prestamoTotal } = data

      // Se recibe solamente lo ingresado, hya que sumar lo ingresado con lo que tiene en ->
      // Aportaciones, prestamos, patrimonio
      let finalAbono = abonoTotal
      let finalPrestamo = prestamoTotal

      // Evaluar caso especial en caso de eliminar a aportación
      if (movimiento === 'Prestamo') {
        finalPrestamo = parseFloat(finalPrestamo) + parseFloat(ingresaPrestamo)
        console.log('se ejecuta la actualizacion de saldos al ingresar un prestamo duplicado')
      } else if (movimiento === 'Eliminación prestamo') {
        finalPrestamo = parseFloat(finalPrestamo) - parseFloat(ingresaPrestamo)
      } else if (movimiento === 'Modificación prestamo') {
        finalPrestamo = parseFloat(finalPrestamo) + parseFloat(ingresaPrestamo)
      } else if (movimiento === 'Abono') {
        finalAbono = parseFloat(finalAbono) + parseFloat(ingresaAbono)
      } else if (movimiento === 'Eliminación abono') {
        finalAbono = parseFloat(finalAbono) - parseFloat(ingresaAbono)
      }

      const dataTemp = {
        abonoTotal: finalAbono,
        prestamoTotal: finalPrestamo,
        movimiento,
        createdAt: ingresaFecha
      }

      // Inicia actualización de saldos de los socios
      actualizaDeudaSocio(_id, dataTemp).then(response => {
        const { data } = response
        console.log(data)
        // console.log("Actualización de saldo personal")
      }).catch(e => {
        // console.log(e)
      })
      // Termina actualización de saldos de los socios
    }).catch(e => {
      console.log(e)
    })
  } catch (e) {
    console.log(e)
  }
}

// Realiza el registro inicial de saldos de socios
export const registroDeudaSocioInicial = async (fichaSocio, abonoTotal, prestamoTotal, movimiento, fecha) => {
  try {
    await obtenerFolioActualDeudaSocio().then(response => {
      const { data } = response
      const { folio } = data
      // console.log("folio generado", folio);
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
    console.log(e)
  }
}
