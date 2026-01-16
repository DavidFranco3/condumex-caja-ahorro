import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroAportaciones,
  ENDPOINTRegistroAportaciones2,
  ENDPOINTListarAportaciones,
  ENDPOINTListarAportacionesPeriodo,
  ENDPOINTListarAportacion,
  ENDPOINTNumeroAportaciones,
  ENDPOINTTotalxTipoAportaciones,
  ENDPOINTListarPaginandoAportaciones,
  ENDPOINTPaginandoxAportacionesTipo,
  ENDPOINTObtenerFolioAportaciones,
  ENDPOINTObtenerAportaciones,
  ENDPOINTObtenerxFichaAportaciones,
  ENDPOINTEliminarAportaciones,
  ENDPOINTActualizarAportaciones,
  ENDPOINTObtenerAportacionesAcumuladasByTipo,
  ENDPOINTObtenerAportacionesAcumuladasByRazon,
  ENDPOINTAportaciones,
  ENDPOINTEliminarAportacionesMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener aportaciones por ficha del socio
export const getAportacionesBySocio = async (ficha, periodo) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(
    `${API_HOST}${ENDPOINTAportaciones}/bySocio?ficha=${ficha}&&periodo=${periodo}`,
    { headers }
  )
}

export const getAportacionesAcumuladasByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerAportacionesAcumuladasByRazon}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// get aportaciones acumuladas by tipo
export const getAportacionesAcumuladasByTipo = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerAportacionesAcumuladasByTipo}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de aportaciones
export async function registraAportacionesSocios (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return axios.post(API_HOST + ENDPOINTRegistroAportaciones, data, config)
}

// Registro de aportaciones
export async function registraAportacionesSocios2 (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return axios.post(API_HOST + ENDPOINTRegistroAportaciones2, data, config)
}

// Listar todas las aportaciones
export async function listarAportaciones (razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarAportaciones +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todas las aportacion
export async function listarAportacion (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarAportacion + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todas las aportacion
export async function listarAportacionesPeriodo (razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarAportacionesPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de las aportaciones
export async function totalAportaciones (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTNumeroAportaciones, config)
}

// Obtener el total de aportaciones segun la razon social proporcionada
export async function totalxTipoAportaciones (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoAportaciones + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar las aportaciones paginandolas
export async function listarPaginacionAportaciones (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoAportaciones +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar paginando las aportaciones paginandolas por tipo
export async function listarPaginacionAportacionesxTipo (pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTPaginandoxAportacionesTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio actual de las aportaciones
export async function obtenerFolioActualAportaciones () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(API_HOST + ENDPOINTObtenerFolioAportaciones, config)
}

// Obtener los datos de la aportación por id
export async function obtenerAportaciones (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerAportaciones + `/${id}`,
    config
  )
}

// Obtener los datos de la aportacion por el numero de ficha del socio --
export async function obtenerDatosAportaciones (ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerxFichaAportaciones + `/${ficha}`,
    config
  )
}

// Eliminar aportaciones
export async function eliminaAportaciones (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarAportaciones + `/${id}`,
    config
  )
}

// Actualizar aportaciones
export async function actualizaAportaciones (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarAportaciones + `/${id}`,
    data,
    config
  )
}

export async function eliminaAportacionesMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarAportacionesMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
