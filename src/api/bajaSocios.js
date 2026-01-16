import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroBajaSocios,
  ENDPOINTListarBajaSocios,
  ENDPOINTListarBajasSocios,
  ENDPOINTListarBajaSociosPeriodo,
  ENDPOINTTotalBajaSocios,
  ENDPOINTTotalxTipoBajaSocios,
  ENDPOINTListarPaginandoBajaSocios,
  ENDPOINTListarPaginandoBajaSociosxTipo,
  ENDPOINTObtenerFolioBajaSocios,
  ENDPOINTObtenerBajaSocios,
  ENDPOINTObtenerxFichaBajaSocios,
  ENDPOINTEliminarBajaSocios,
  ENDPOINTBajaSocios,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener baja socios por ficha del socio
export const getBajaSociosBySocio = async (ficha) => {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(`${API_HOST}${ENDPOINTBajaSocios}/bySocio/?ficha=${ficha}`, {
    headers,
  })
}

// Registro de las bajas de socios
export async function registraBajaSocios (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroBajaSocios, data, config)
}

// Listar todas las bajas de socios
export async function listarBajaSocios (razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarBajaSocios +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

export async function listarBajaSocio (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarBajasSocios + `/?tipo=${razonSocial}`,
    config
  )
}

export async function listarBajaSocioPeriodo (razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarBajaSociosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de baja de socios
export async function totalBajaSocios (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalBajaSocios, config)
}

// Obtener el total de las bajas de socios segun la razon social indicada
export async function totalxTipoBajaSocios (razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoBajaSocios + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar paginando las bajas de socios
export async function listarPaginacionBajaSocios (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoBajaSocios +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar paginando las bajas de socios, indicando el tipo
export async function listarPaginacionBajaSociosxTipo (pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoBajaSociosxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio actual de las bajas de socios
export async function obtenerFolioActualBajaSocios () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioBajaSocios, config)
}

// Obtener los datos de una baja de socio indicando id
export async function obtenerBajaSocios (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerBajaSocios + `/${id}`,
    config
  )
}

// Obtener los datos de una baja de socio indicando ficha del socio
export async function obtenerDatosBajaSocios (dato) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaBajaSocios + `/${dato}`,
    config
  )
}

// Eliminar una baja de socio
export async function eliminaBajaSocios (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarBajaSocios + `/${id}`,
    config
  )
}
