import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegistroMovimientosSaldos,
  ENDPOINTListarMovimientosSaldos,
  ENDPOINTTotalMovimientosSaldos,
  ENDPOINTListarMovimientosSaldosPeriodo,
  ENDPOINTTotalxTipoMovimientosSaldos,
  ENDPOINTListarPaginandoMovimientosSaldos,
  ENDPOINTListarPaginandoMovimientoSaldosxTipo,
  ENDPOINTObtenerFolioMovimientosSaldos,
  ENDPOINTObtenerMovimientosSaldos,
  ENDPOINTObtenerxFichaMovimientosSaldos,
  ENDPOINTEliminarMovimientosSaldos,
  ENDPOINTActualizarMovimientosSaldos,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Registro de movimiento de saldos
export async function registraMovimientoSaldos(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(
    API_HOST + ENDPOINTRegistroMovimientosSaldos,
    data,
    config
  )
}

// Listar todos los movimientos de saldos
export async function listarMovimientoSaldos(razonSocial) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarMovimientosSaldos + `/?tipo=${razonSocial}`,
    config
  )
}

// Listar todos los movimientos de saldos
export async function listarMovimientoSaldosPeriodo(razonSocial, periodo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTListarMovimientosSaldosPeriodo + `/?tipo=${razonSocial}&&periodo=${periodo}`,
    config
  )
}

// Obtener el total de movimientos registrados
export async function totalMovimientoRegistrados(params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalMovimientosSaldos, config)
}

// Obten el total de movimientos registrados segun la razon social indicada
export async function totalxTipoMovimientosSaldos(dato) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTTotalxTipoMovimientosSaldos + `/?tipo=${dato}`,
    config
  )
}

// Listar paginando los movimientos de saldos
export async function listarPaginacionMovimientoSaldos(pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoMovimientosSaldos +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Listar paginando los movimientos de saldos, indicando el tipo
export async function listarPaginacionMovimientosSaldosxTipo(
  pagina,
  limite,
  tipo
) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoMovimientoSaldosxTipo +
      `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
    config
  )
}

// Obtener el folio actual de los movimientos de saldos
export async function obtenerFolioActualMovimientoSaldos() {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerFolioMovimientosSaldos,
    config
  )
}

// Obtener los datos de un movimiento especificando el id
export async function obtenerMovimientoSaldos(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerMovimientosSaldos + `/${id}`,
    config
  )
}

// Obtener los datos de un movimiento especificando la ficha del socio
export async function obtenerDatosMovimientoSaldos(dato) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerxFichaMovimientosSaldos + `/${dato}`,
    config
  )
}

// Eliminar un movimiento
export async function eliminaMovimientoSaldos(id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarMovimientosSaldos + `/${id}`,
    config
  )
}

// Actualizar movimientos de saldos
export async function actualizaMovimientoSaldos(id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarMovimientosSaldos + `/${id}`,
    data,
    config
  )
}
