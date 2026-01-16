import { API_HOST } from '../utils/constants'
import {
  ENDPOINTPrestamos,
  ENDPOINTRegistroPrestamos,
  ENDPOINTListarPrestamos,
  ENDPOINTListarPrestamo,
  ENDPOINTTotalPrestamos,
  ENDPOINTListarPrestamosPeriodo,
  ENDPOINTTotalxTipoPrestamos,
  ENDPOINTListarPaginandoPrestamos,
  ENDPOINTListarPaginandoPrestamosxTipo,
  ENDPOINTObtenerFolioPrestamos,
  ENDPOINTObtenerPrestamos,
  ENDPOINTObtenerxFichaPrestamos,
  ENDPOINTObtenerxFechaPrestamos,
  ENDPOINTActualizarPrestamos,
  ENDPOINTObtenerPrestamosAcumuladosByRazon,
  ENDPOINTEliminarPrestamos,
  ENDPOINTEliminarPrestamosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

export const getPrestamosBySocio = async (ficha) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return await axios.get(
    `${API_HOST}${ENDPOINTPrestamos}/bySocio?ficha=${ficha}`,
    {
      headers,
    }
  )
}

export const getPrestamosAcumuladosByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerPrestamosAcumuladosByRazon}/?tipo=${tipo}`
  return await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de prestamos
export async function registraPrestamos (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroPrestamos, data, config)
}

// Listar todos los abonos
export async function listarPrestamos (razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPrestamos +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todos los abonos
export async function listarPrestamo (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarPrestamo + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todos los abonos
export async function listarPrestamoPeriodo (razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarPrestamosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de registros de prestamos
export async function totalPrestamos (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalPrestamos, config)
}

// Obtener el total de registros de prestamos segun la razon social proporcionada
export async function totalxTipoPrestamos (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoPrestamos + `/?tipo=${razonSocial}`,
    config
  )
}

// Obtener el total de registros de prestamos segun la razon social proporcionada
export async function totalxTipoSocioPrestamos (razonSocial, ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTTotalxTipoPrestamos +
      `/?tipo=${razonSocial}` +
      `/?fichaSocio=${ficha}`,
    config
  )
}

// Listar paginando los prestamos
export async function listarPaginacionPrestamos (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoPrestamos +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar prestamos paginandolos, indicando el tipo
export async function listarPaginacionPrestamosxTipo (pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoPrestamosxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio del prestamo actual
export async function obtenerFolioActualPrestamo () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioPrestamos, config)
}

// Obtener los datos de un prestamo por id
export async function obtenerPrestamo (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerPrestamos + `/${id}`, config)
}

// Obtener el listado de prestamos de un cliente, indicando ficha del socio
export async function obtenerDatosPrestamos (fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaPrestamos + `/${fichaSocio}`,
    config
  )
}

// Eliminar prestamos -- ENDPOINTEliminarPrestamos
export async function eliminaPrestamos (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarPrestamos + `/${id}`,
    config
  )
}

// Actualiza datos del prestamo
export async function actualizaPrestamos (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarPrestamos + `/${id}`,
    data,
    config
  )
}

export async function eliminaPrestamosMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarPrestamosMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}

// Obtener datos del saldo del socio indicando la ficha del socio
export async function obtenerInfoxPrestamos (fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaPrestamos + `/${fichaSocio}`,
    config
  )
}

// Obtener datos del saldo del socio indicando la ficha del socio
export async function obtenerInfoxFechaPrestamos (fecha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFechaPrestamos + `/?fecha=${fecha}`,
    config
  )
}
