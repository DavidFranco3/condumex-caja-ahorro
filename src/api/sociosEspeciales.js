import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroSociosEspeciales,
  ENDPOINTListarSociosEspeciales,
  ENDPOINTTotalSociosEspeciales,
  ENDPOINTListarPaginandoSociosEspeciales,
  ENDPOINTObtenerFichaSociosEspeciales,
  ENDPOINTObtenerSociosEspeciales,
  ENDPOINTObtenerxFichaSociosEspeciales,
  ENDPOINTEliminarSociosEspeciales,
  ENDPOINTDeshabilitarSociosEspeciales,
  ENDPOINTActualizarSociosEspeciales,
  ENDPOINTObtenerEspecialesByNombre,
  ENDPOINTEliminarEspecialesMasivo
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Obtener socios especiales por nombre
export async function obtenerSociosEspecialesByNombre(nombre) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerEspecialesByNombre + `/?nombre=${nombre}`,
    config
  )
}

// Registro de socios
export async function registraSocioEspecial(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(
    API_HOST + ENDPOINTRegistroSociosEspeciales,
    data,
    config
  )
}

// Listado de todos los registros de socios
export async function listarSocioEspecial(params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTListarSociosEspeciales, config)
}

// Obtener el total de socios registrados
export async function totalRegistroSocioEspecial() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalSociosEspeciales, config)
}

// Listar paginando los socios
export async function listarPaginacionSocioEspecial(pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoSociosEspeciales +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Obtener ficha actual de los socios
export async function obtenerFichaActualSocioEspecial() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerFichaSociosEspeciales,
    config
  )
}

// Obtener los datos de un socio por id
export async function obtenerSocioEspecial(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerSociosEspeciales + `/${id}`,
    config
  )
}

// Obtener los datos de un socio por ficha
export async function obtenerDatosSocioEspecial(ficha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaSociosEspeciales + `/${ficha}`,
    config
  )
}

// Eliminar socios
export async function eliminaSocioEspecial(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarSociosEspeciales + `/${id}`,
    config
  )
}

// Deshabilitar socios
export async function cambiaEstadoSocioEspecial(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTDeshabilitarSociosEspeciales + `/${id}`,
    data,
    config
  )
}

// Actualizar información de socios
export async function actualizaSocioEspecial(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarSociosEspeciales + `/${id}`,
    data,
    config
  )
}

export async function eliminaEspecialesMasivo(fecha) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarEspecialesMasivo + `/${fecha}`,
    config
  )
}