import { API_HOST } from '../utils/constants'
import {
  ENDPOINTPatrimonio,
  ENDPOINTRegistroPatrimonio,
  ENDPOINTTotalPatrimonio,
  ENDPOINTListarPatrimonio,
  ENDPOINTListarPatrimonios,
  ENDPOINTTotalxTipoPatrimonio,
  ENDPOINTListarPatrimonioPeriodo,
  // ENDPOINTTotalxTipoSocioPatrimonio,
  ENDPOINTListarPaginandoPatrimonio,
  ENDPOINTListarPaginandoPatrimonioxTipo,
  ENDPOINTObtenerFolioPatrimonio,
  ENDPOINTObtenerPatrimonio,
  ENDPOINTObtenerxFichaPatrimonio,
  ENDPOINTActualizarPatrimonio,
  ENDPOINTObtenerPatrimoniosAcumuladosByRazon,
  ENDPOINTEliminarPatrimonio,
  ENDPOINTEliminarPatrimoniosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

export const getPatrimonioBySocio = async (ficha, periodo) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return await axios.get(
    `${API_HOST}${ENDPOINTPatrimonio}/bySocio?ficha=${ficha}&&periodo=${periodo}`,
    {
      headers,
    }
  )
}

export const getPatrimonioAcumuladosByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerPatrimoniosAcumuladosByRazon}/?tipo=${tipo}`
  return await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de patrimonios
export async function registraPatrimonio (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroPatrimonio, data, config)
}

export async function listarPatrimonio (razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPatrimonio +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

export async function listarPatrimoniosPeriodo (razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarPatrimonioPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

export async function listarPatrimonios (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarPatrimonios + `/?tipo=${razonSocial}`,
    config
  )
}

// Obtener el total de registros de patrimonios
export async function totalPatrimonio (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalPatrimonio, config)
}

// Obtener el total de registros de patrimonios segun la razon social proporcionada
export async function totalxTipoPatrimonio (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoPatrimonio + `/?tipo=${razonSocial}`,
    config
  )
}

// Obtener el total de registros de patrimonios segun la razon social proporcionada
export async function totalxTipoSocioPatrimonio (razonSocial, ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTTotalxTipoPatrimonio +
      `/?tipo=${razonSocial}` +
      `/?fichaSocio=${ficha}`,
    config
  )
}

// Listar paginando los patrimonio
export async function listarPaginacionPatrimonio (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoPatrimonio +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar patrimonios paginandolos, indicando el tipo
export async function listarPaginacionPatrimonioxTipo (pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoPatrimonioxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio del patrimonio actual
export async function obtenerFolioActualPatrimonio () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioPatrimonio, config)
}

// Obtener los datos de un prestamo por id
export async function obtenerPatrimonio (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerPatrimonio + `/${id}`,
    config
  )
}

// Obtener el listado de prestamos de un cliente, indicando ficha del socio
export async function obtenerDatosPatrimonio (fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaPatrimonio + `/${fichaSocio}`,
    config
  )
}

// Eliminar patrimonio -- ENDPOINTEliminarPatrimonio
export async function eliminaPatrimonio (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarPatrimonio + `/${id}`,
    config
  )
}

// Actualiza datos del patrimonio
export async function actualizaPatrimonio (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarPatrimonio + `/${id}`,
    data,
    config
  )
}

export async function eliminaPatrimonioMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarPatrimoniosMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}

// Obtener datos del saldo del socio indicando la ficha del socio
export async function obtenerInfoxPatrimonio (fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaPatrimonio + `/${fichaSocio}`,
    config
  )
}
