import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroRendimientos,
  ENDPOINTRegistroRendimientos2,
  ENDPOINTListarRendimientos,
  ENDPOINTListarRendimiento,
  ENDPOINTListarRendimientosPeriodo,
  ENDPOINTNumeroRendimientos,
  ENDPOINTTotalxTipoRendimientos,
  ENDPOINTListarPaginandoRendimientos,
  ENDPOINTPaginandoxRendimientosTipo,
  ENDPOINTObtenerFolioRendimientos,
  ENDPOINTObtenerRendimientos,
  ENDPOINTObtenerxFichaRendimientos,
  ENDPOINTEliminarRendimientos,
  ENDPOINTActualizarRendimientos,
  ENDPOINTObtenerRendimientosAcumuladosByRazon,
  ENDPOINTObtenerRendimientoxFichaSaldos,
  ENDPOINTRendimientos,
  ENDPOINTEliminarRendimientosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener datos del saldo del socio indicando la ficha del socio
export async function obtenerRendimientoxFicha(fichaSocio) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerRendimientoxFichaSaldos + `/${fichaSocio}`,
    config
  )
}

export async function getTotalGeneralByRazon(fecha, razonSocial, periodo) {
  const token = getTokenApi()
  const url = `${API_HOST}/rendimientos/totalGeneralByRazon?fecha=${fecha}&&razonSocial=${razonSocial}&&periodo=${periodo}`

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function totalGeneralBySocios(fecha, razonSocial, periodo) {
  const token = getTokenApi()
  const url = `${API_HOST}/rendimientos/totalGeneralBySocios?fecha=${fecha}&&razonSocial=${razonSocial}&&periodo=${periodo}`

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Obtener rendimientos por ficha del socio
export async function getRendimientosBySocio(ficha, periodo) {
  const token = getTokenApi()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(
    `${API_HOST}${ENDPOINTRendimientos}/bySocio?ficha=${ficha}&&periodo=${periodo}`,
    { headers }
  )
}

export async function getRendimientoAcumuladosByRazon(tipo) {
  const token = getTokenApi()
  const url = `${API_HOST}${ENDPOINTObtenerRendimientosAcumuladosByRazon}/?tipo=${tipo}`
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

// Registro de Rendimientos
export async function registraRendimientosSocios(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistroRendimientos, data, config)
}

// Registro de Rendimientos
export async function registraRendimientosSocios2(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return axios.post(API_HOST + ENDPOINTRegistroRendimientos2, data, config)
}

// Listar todas las Rendimientos
export async function listarRendimientos(razonSocial, inicio, fin) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST +
      ENDPOINTListarRendimientos +
      `/?tipo=${razonSocial}&&inicio=${inicio}&&fin=${fin}`,
    config
  )
}

// Listar todas las Rendimientos
export async function listarRendimiento(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTListarRendimiento + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todas las Rendimientos
export async function listarRendimientoPeriodo(razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTListarRendimientosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de las Rendimientos
export async function totalRendimientos() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(API_HOST + ENDPOINTNumeroRendimientos, config)
}

// Obtener el total de Rendimientos segun la razon social proporcionada
export async function totalxTipoRendimientos(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoRendimientos + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar las Rendimientos paginandolas
export async function listarPaginacionRendimientos(pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoRendimientos +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar paginando las Rendimientos paginandolas por tipo
export async function listarPaginacionRendimientosxTipo(pagina, limite, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTPaginandoxRendimientosTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio actual de las Rendimientos
export async function obtenerFolioActualRendimientos() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFolioRendimientos, config)
}

// Obtener los datos de la aportación por id
export async function obtenerRendimientos(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerRendimientos + `/${id}`,
    config
  )
}

// Obtener los datos de la aportacion por el numero de ficha del socio --
export async function obtenerDatosRendimientos(ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaRendimientos + `/${ficha}`,
    config
  )
}

// Eliminar Rendimientos
export async function eliminaRendimientos(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarRendimientos + `/${id}`,
    config
  )
}

// Actualizar Rendimientos
export async function actualizaRendimientos(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return axios.put(
    API_HOST + ENDPOINTActualizarRendimientos + `/${id}`,
    data,
    config
  )
}

export async function eliminaRendimientosMasivo(fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarRendimientosMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
