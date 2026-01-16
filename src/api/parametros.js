import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroParametros,
  ENDPOINTListarParametros,
  ENDPOINTTotalParametros,
  ENDPOINTListarPaginandoParametros,
  ENDPOINTEliminarParametros,
  ENDPOINTActualizarParametros
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Registro de parametros
export async function registraParametros (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }

  return await axios.post(API_HOST + ENDPOINTRegistroParametros, data, config)
}

// Listar todos los parametros
export async function listarParametros (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTListarParametros, config)
}

// Obtener el total de parametros
export async function totalParametros (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTTotalParametros, config)
}

// Listar paginando los parametros
export async function listarPaginacionParametros (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTListarPaginandoParametros + `/?pagina=${pagina}&&limite=${limite}`, config)
}

// Eliminar los parametros
export async function eliminaParametros (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }

  return await axios.delete(API_HOST + ENDPOINTEliminarParametros + `/${id}`, config)
}

// Actualizar los datos de los parametros
export async function actualizaParametros (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }

  return await axios.put(API_HOST + ENDPOINTActualizarParametros + `/${id}`, data, config)
}
