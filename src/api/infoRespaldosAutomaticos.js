import { API_HOST } from '../utils/constants'
import {
  ENDPOINTTotalInfoRespaldoAutomatico,
  ENDPOINTListarPaginandoInfoRespaldoAutomatico,
  ENDPOINTObtenerInfoRespaldoAutomatico
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Total de registros de respaldos automáticos realizados
export async function totalInfoRespaldoAutomatico () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTTotalInfoRespaldoAutomatico, config)
}

// Listar paginando los respaldos automáticos
export async function listarPaginacionInfoRespaldosAutomaticos (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTListarPaginandoInfoRespaldoAutomatico + `/?pagina=${pagina}&&limite=${limite}`, config)
}

// Obtener los datos de un respaldo por id del registro
export async function obtenerInfoRespaldoAutomatico (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + ENDPOINTObtenerInfoRespaldoAutomatico + `/${id}`, config)
}

// Obtener los datos de un respaldo por folio del registro
export async function obtenerDatosInfoRespaldosAutomaticos (dato) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }
  return await axios.get(API_HOST + obtenerDatosInfoRespaldosAutomaticos + `/${dato}`, config)
}
