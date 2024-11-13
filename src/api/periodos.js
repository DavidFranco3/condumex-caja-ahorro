import { API_HOST } from '../utils/constants'
import {
    ENDPOINTRegistroPeriodos,
    ENDPOINTListarPeriodo,
    ENDPOINTTotalPeriodos,
    ENDPOINTTotalxTipoPeriodos,
    ENDPOINTListarPaginandoPeriodos,
    ENDPOINTListarPaginandoPeriodosxTipo,
    ENDPOINTObtenerFolioPeriodos,
    ENDPOINTObtenerPeriodos,
    ENDPOINTEliminarPeriodos,
    ENDPOINTActualizarPeriodos
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Registro de abonos
export async function registraPeriodos(data) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }

    return await axios.post(API_HOST + ENDPOINTRegistroPeriodos, data, config)
}

// Listar todos los abonos
export async function listarPeriodo(razonSocial) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(
        API_HOST + ENDPOINTListarPeriodo + `/?tipo=${razonSocial}`,
        config
    )
}

// Obtener el total de registros de abonos
export async function totalPeriodos(params) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(API_HOST + ENDPOINTTotalPeriodos, config)
}

// Obtener el total de registros de abonos segun la razon social proporcionada
export async function totalxTipoAbonos(razonSocial) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(
        API_HOST + ENDPOINTTotalxTipoPeriodos + `/?tipo=${razonSocial}`,
        config
    )
}

// Listar paginando los abonos
export async function listarPaginacionPeriodos(pagina, limite) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(
        API_HOST +
        ENDPOINTListarPaginandoPeriodos +
        `/?pagina=${pagina}&&limite=${limite}`,
        config
    )
}

// Listar abonos paginandolos, indicando el tipo
export async function listarPaginacionPeriodosxTipo(pagina, limite, tipo) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(
        API_HOST +
        ENDPOINTListarPaginandoPeriodosxTipo +
        `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`,
        config
    )
}

// Obtener el folio del abono actual
export async function obtenerFolioActualPeriodo() {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(API_HOST + ENDPOINTObtenerFolioPeriodos, config)
}

// Obtener los datos de un abono por id
export async function obtenerPeriodo(id) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }
    return await axios.get(API_HOST + ENDPOINTObtenerPeriodos + `/${id}`, config)
}

// Eliminar abonos -- ENDPOINTEliminarAbonos
export async function eliminaPeriodos(id) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }

    return await axios.delete(
        API_HOST + ENDPOINTEliminarPeriodos + `/${id}`,
        config
    )
}

// Actualiza datos del abonos
export async function actualizaPeriodos(id, data) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`,
        },
    }

    return await axios.put(
        API_HOST + ENDPOINTActualizarPeriodos + `/${id}`,
        data,
        config
    )
}

