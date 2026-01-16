import { API_HOST } from '../utils/constants'
import {
  ENDPOINTRegitroSociosEmpleados,
  ENDPOINTListarSociosEmpleados,
  ENDPOINTTotalSociosEmpleados,
  ENDPOINTListarPaginandoSociosEmpleados,
  ENDPOINTObtenerFichaSociosEmpleados,
  ENDPOINTObtenerSociosEmpleados,
  ENDPOINTObtenerxFichaSociosEmpleados,
  ENDPOINTObtenerNombrexFichaSociosEmpleados,
  ENDPOINTEliminarSociosEmpleados,
  ENDPOINTDeshabilitarSociosEmpleados,
  ENDPOINTActualizarSociosEmpleados,
  ENDPOINTObtenerEmpleadosByNombre,
  ENDPOINTEliminarEmpleadosMasivo,
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Registro de socios
export async function registraSociosEmpleados (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.post(
    API_HOST + ENDPOINTRegitroSociosEmpleados,
    data,
    config
  )
}

// Listado de todos los registros de socios
export async function listarSociosEmpleados (params) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTListarSociosEmpleados, config)
}

// Obtener el total de socios registrados
export async function totalRegistrosSociosEmpleados () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTTotalSociosEmpleados, config)
}

// Listar paginando los socios
export async function listarPaginacionSociosEmpleados (pagina, limite) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoSociosEmpleados +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  )
}

// Obtener ficha actual de los socios
export async function obtenerFichaActualSociosEmpleados () {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(API_HOST + ENDPOINTObtenerFichaSociosEmpleados, config)
}

// Obtener los datos de un socio por id
export async function obtenerSocioEmpleado (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return await axios.get(
    API_HOST + ENDPOINTObtenerSociosEmpleados + `/${id}`,
    config
  )
}

// Obtener los datos de un socio por ficha
export async function obtenerDatosSocioEmpleado (ficha) {
  // console.log("Ficha ", ficha)
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerxFichaSociosEmpleados + `/${ficha}`,
    config
  )
}

// Obtener los datos de un socio por ficha
export async function obtenerNombreSocioEmpleado (ficha) {
  // console.log("Ficha ", ficha)
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerNombrexFichaSociosEmpleados + `/${ficha}`,
    config
  )
}

// Obtener empleados por nombre
export async function obtenerEmpleadosPorNombre (nombre) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerEmpleadosByNombre + `/?nombre=${nombre}`,
    config
  )
}

// Eliminar socios
export async function eliminaSocioEmpleado (id) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST + ENDPOINTEliminarSociosEmpleados + `/${id}`,
    config
  )
}

// Deshabilitar socios
export async function cambiaEstadoSocioEmpleado (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTDeshabilitarSociosEmpleados + `/${id}`,
    data,
    config
  )
}

// Actualizar información de socios
export async function actualizaSocioEmpleado (id, data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.put(
    API_HOST + ENDPOINTActualizarSociosEmpleados + `/${id}`,
    data,
    config
  )
}

export async function eliminaEmpleadosMasivo (fecha, tipo) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }

  return await axios.delete(
    API_HOST +
      ENDPOINTEliminarEmpleadosMasivo +
      `/?fecha=${fecha}&&tipo=${tipo}`,
    config
  )
}
