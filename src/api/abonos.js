import { API_HOST } from '../utils/constants'
import {
  ENDPOINTAbonos,
  ENDPOINTRegistroAbonos,
  ENDPOINTListarAbonos,
  ENDPOINTListarAbonosPeriodo,
  ENDPOINTListarAbono,
  ENDPOINTTotalAbonos,
  ENDPOINTTotalxTipoAbonos,
  ENDPOINTListarPaginandoAbonos,
  ENDPOINTListarPaginandoAbonosxTipo,
  ENDPOINTObtenerFolioAbonos,
  ENDPOINTObtenerAbonos,
  ENDPOINTObtenerxFichaAbonos,
  ENDPOINTActualizarAbonos,
  ENDPOINTObtenerAbonosAcumuladosByRazon,
  ENDPOINTEliminarAbonos,
  ENDPOINTEliminarAbonosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

export const getAbonosBySocio = async (ficha) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return axios.get(`${API_HOST}${ENDPOINTAbonos}/bySocio?ficha=${ficha}`, {
    headers,
  })
}

export const getAbonosAcumuladosByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerAbonosAcumuladosByRazon}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de abonos
export async function registraAbonos(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroAbonos, data, config)
}

// Listar todos los abonos
export async function listarAbonos(razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarAbonos +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todos los abonos
export async function listarAbonosPeriodo(razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarAbonosPeriodo +
      `/?periodo=${periodo}&&tipo=${razonSocial}`,
    config
  )
}

// Listar todos los abonos
export async function listarAbono(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarAbono + `/?tipo=${razonSocial}`,
    config
  )
}

// Obtener el total de registros de abonos
export async function totalAbonos(params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalAbonos, config)
}

// Obtener el total de registros de abonos segun la razon social proporcionada
export async function totalxTipoAbonos(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoAbonos + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar paginando los abonos
export async function listarPaginacionAbonos(pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoAbonos +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar abonos paginandolos, indicando el tipo
export async function listarPaginacionAbonosxTipo(pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoAbonosxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio del abono actual
export async function obtenerFolioActualAbono() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioAbonos, config)
}

// Obtener los datos de un abono por id
export async function obtenerAbono(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerAbonos + `/${id}`, config)
}

// Obtener el listado de abonos de un cliente, indicando ficha del socio
export async function obtenerDatosAbonos(fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaAbonos + `/${fichaSocio}`,
    config
  )
}

// Eliminar abonos -- ENDPOINTEliminarAbonos
export async function eliminaAbonos(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarAbonos + `/${id}`,
    config
  )
}

// Actualiza datos del abonos
export async function actualizaAbonos(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarAbonos + `/${id}`,
    data,
    config
  )
}

export async function eliminaAbonosMasivo(fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarAbonosMasivo + `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
