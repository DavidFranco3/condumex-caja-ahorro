import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroRetiros,
  ENDPOINTListarRetiros,
  ENDPOINTListarRetiro,
  ENDPOINTListarRetirosPeriodo,
  ENDPOINTTotalRetiros,
  ENDPOINTTotalxTipoRetiros,
  ENDPOINTListarPaginandoRetiros,
  ENDPOINTListarPaginandoRetirosxTipo,
  ENDPOINTObtenerFolioRetiros,
  ENDPOINTObtenerRetiros,
  ENDPOINTObtenerxFichaRetiros,
  ENDPOINTEliminarRetiros,
  ENDPOINTActualizarRetiros,
  ENDPOINTObtenerRetirosAcumuladasByRazon,
  ENDPOINTRetiros,
  ENDPOINTEliminarRetirosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener retiros por ficha de socio
export const getRetirosBySocio = async (ficha) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return axios.get(`${API_HOST}${ENDPOINTRetiros}/bySocio?ficha=${ficha}`, {
    headers,
  })
}

export const getRetirosAcumuladasByRazon = async (tipo) => {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerRetirosAcumuladasByRazon}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de retiros
export async function registraRetiros(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroRetiros, data, config)
}

// Listar todos los retiros
export async function listarRetiros(razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarRetiros +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todos los retiros
export async function listarRetiro(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarRetiro + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todos los retiros
export async function listarRetiroPeriodo(razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarRetirosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de retiros
export async function totalRetiros(params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalRetiros, config)
}

// Obtener el total de retiros segun la razon social proporcionada
export async function totalxTipoRetiros(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoRetiros + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar paginando los retiros
export async function listarPaginacionRetiros(pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoRetiros +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar paginando los retiros, indicando el tipo
export async function listarPaginacionRetirosxTipo(pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoRetirosxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio actual de los retiros
export async function obtenerFolioActualRetiros() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioRetiros, config)
}

// Obtener la informacion de un retiro indicando el id
export async function obtenerRetiro(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerRetiros + `/${id}`, config)
}

// Obtener la informacion de un retiro indicando la ficha del socio
export async function obtenerDatos(ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaRetiros + `/${ficha}`,
    config
  )
}

// Eliminar retiros
export async function eliminaRetiros(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarRetiros + `/${id}`,
    config
  )
}

// Actualizar retiros
export async function actualizaRetiros(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarRetiros + `/${id}`,
    data,
    config
  )
}

export async function eliminaRetirosMasivo(fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarRetirosMasivo + `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
