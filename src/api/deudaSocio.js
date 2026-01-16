import { API_HOST } from '../utils/constants'
import {
  ENDPOINTDeudaSocio,
  ENDPOINTRegistroDeudaSocio,
  ENDPOINTListarDeudaSocio,
  ENDPOINTListarDeudasSociosPeriodo,
  ENDPOINTTotalDeudaSocio,
  ENDPOINTTotalxTipoDeudaSocio,
  ENDPOINTListarPaginandoDeudaSocio,
  ENDPOINTListarPaginandoDeudaSocioxTipo,
  ENDPOINTObtenerFolioDeudaSocio,
  ENDPOINTObtenerDeudaSocio,
  ENDPOINTObtenerxFichaDeudaSocio,
  ENDPOINTEliminarDeudaSocio,
  ENDPOINTActualizarDeudaSocio,
  ENDPOINTObtenerDeudaSocioAcumuladosByRazon,
  ENDPOINTEliminarDeudaSocioMasivo,
  ENDPOINTListarDeudasSocios,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

export const getDeudaSocioBySocio = async (ficha) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return axios.get(`${API_HOST}${ENDPOINTDeudaSocio}/bySocio?ficha=${ficha}`, {
    headers,
  })
}

export const getDeudaSocioAcumuladosByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerDeudaSocioAcumuladosByRazon}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de deuda socio
export async function registraDeudaSocio (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroDeudaSocio, data, config)
}

// Listar todos los deuda socio
export async function listarDeudaSocio (razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarDeudaSocio +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todos los deuda socio
export async function listarDeudasSocios (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarDeudasSocios + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todos los deuda socio
export async function listarDeudasSociosPeriodo (razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarDeudasSociosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de registros de deuda socio
export async function totalDeudaSocio (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalDeudaSocio, config)
}

// Obtener el total de registros de deuda socio segun la razon social proporcionada
export async function totalxTipoDeudaSocio (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoDeudaSocio + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar paginando los deudaSocio
export async function listarPaginacionDeudaSocio (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoDeudaSocio +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar deuda socio paginandolos, indicando el tipo
export async function listarPaginacionDeudaSocioxTipo (pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoDeudaSocioxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio del deuda socio actual
export async function obtenerFolioActualDeudaSocio () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioDeudaSocio, config)
}

// Obtener los datos de un deudaSocio por id
export async function obtenerDeudaSocio (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerDeudaSocio + `/${id}`,
    config
  )
}

// Obtener el listado de deuda socio de un cliente, indicando ficha del socio
export async function obtenerDatosDeudaSocio (fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaDeudaSocio + `/${fichaSocio}`,
    config
  )
}

// Eliminar deuda socio -- ENDPOINTEliminarDeudaSocio
export async function eliminaDeudaSocio (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarDeudaSocio + `/${id}`,
    config
  )
}

// Actualiza datos del deuda Socio
export async function actualizaDeudaSocio (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarDeudaSocio + `/${id}`,
    data,
    config
  )
}

export async function eliminaDeudaSocioMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarDeudaSocioMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
