import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistraUsuarioCorreo,
  ENDPOINTTotalUsuarioCorreos,
  ENDPOINTListarUsuarioCorreos,
  ENDPOINTObtenerUsuarioCorreo,
  ENDPOINTEliminarUsuarioCorreo,
  ENDPOINTActualizarUsuarioCorreo,
  ENDPOINTDeshabilitaUsuarioCorreo,
  ENDPOINTListarUsuarioCorreosPaginacion,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Registra UsuarioCorreos
export async function registraUsuarioCorreo (data) {
  // console.log(data)

  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(API_HOST + ENDPOINTRegistraUsuarioCorreo, data, config)
}

// Para obtener todos los datos del usuario
export async function obtenerUsuarioCorreo (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerUsuarioCorreo + `/${params}`,
    config
  )
}

// Para listar todos los UsuarioCorreos
export async function listarUsuarioCorreos (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTListarUsuarioCorreos, config)
}

// Listar los UsuarioCorreos paginandolos
export async function listarUsuarioCorreosPaginacion (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarUsuarioCorreosPaginacion +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Elimina cliente fisicamente de la bd
export async function eliminarUsuarioCorreo (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarUsuarioCorreo + `/${id}`,
    config
  )
}

// Deshabilita el usuario
export async function deshabilitaUsuarioCorreo (id, data) {
  // console.log(data)
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTDeshabilitaUsuarioCorreo + `/${id}`,
    data,
    config
  )
}

// Modifica datos del usuario
export async function actualizaUsuarioCorreo (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarUsuarioCorreo + `/${id}`,
    data,
    config
  )
}

// Obtener el total de socios registrados
export async function totalRegistrosUsuarioCorreos () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalUsuarioCorreos, config)
}
