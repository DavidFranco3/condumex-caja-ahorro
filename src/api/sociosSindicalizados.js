import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroSociosSindicalizados,
  ENDPOINTListarSociosSindicalizados,
  ENDPOINTTotalSociosSindicalizados,
  ENDPOINTListarPaginandoSociosSindicalizados,
  ENDPOINTObtenerFichaSociosSindicalizados,
  ENDPOINTObtenerSociosSindicalizados,
  ENDPOINTObtenerxFichaSociosSindicalizados,
  ENDPOINTObtenerNombrexFichaSociosSindicalizados,
  ENDPOINTEliminarSociosSindicalizados,
  ENDPOINTDeshabilitarSociosSindicalizados,
  ENDPOINTActualizarSociosSindicalizados,
  ENDPOINTObtenerSindicalizadosByNombre,
  ENDPOINTEliminarSindicalizadosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener socios sindicalizados por nombre
export async function obtenerSociosSindicalizadosByNombre (nombre) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerSindicalizadosByNombre + `/?nombre=${nombre}`,
    config
  )
}

// Registro de socios
export async function registraSocioSindicalizado (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(
    API_HOST + ENDPOINTRegistroSociosSindicalizados,
    data,
    config
  )
}

// Listado de todos los registros de socios
export async function listarSocioSindicalizado (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTListarSociosSindicalizados, config)
}

// Obtener el total de socios registrados
export async function totalRegistrosSocioSindicalizado () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalSociosSindicalizados, config)
}

// Listar paginando los socios
export async function listarPaginacionSocioSindizalizado (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoSociosSindicalizados +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Obtener ficha actual de los socios
export async function obtenerFichaActualSocioSindicalizado () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerFichaSociosSindicalizados,
    config
  )
}

// Obtener los datos de un socio por id
export async function obtenerSocioSindicalizado (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerSociosSindicalizados + `/${id}`,
    config
  )
}

// Obtener los datos de un socio por ficha
export async function obtenerDatosSocioSindicalizado (ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaSociosSindicalizados + `/${ficha}`,
    config
  )
}

// Obtener los datos de un socio por ficha
export async function obtenerNombreSocioSindicalizado (ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerNombrexFichaSociosSindicalizados + `/${ficha}`,
    config
  )
}

// Eliminar socios
export async function eliminaSocioSindicalizado (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarSociosSindicalizados + `/${id}`,
    config
  )
}

// Deshabilitar socios
export async function cambiaEstadoSocioSindicalizado (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTDeshabilitarSociosSindicalizados + `/${id}`,
    data,
    config
  )
}

// Actualizar información de socios
export async function actualizaSocioSindicalizado (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarSociosSindicalizados + `/${id}`,
    data,
    config
  )
}

export async function eliminaSindicalizadosMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarSindicalizadosMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
