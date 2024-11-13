import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroSaldosGlobales,
    ENDPOINTListarSaldosGlobales,
    ENDPOINTTotalSaldosGlobales,
    ENDPOINTListarPaginandoSaldosGlobales,
    ENDPOINTObtenerFolioSaldosGlobales,
    ENDPOINTObtenerxIDSaldosGlobales,
    ENDPOINTObtenerxFolioSaldosGlobales,
    ENDPOINTEliminarSaldosGlobales,
    ENDPOINTActualizarSaldosGlobales
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro de saldos globales
export async function registraSaldosGlobalesSistema(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroSaldosGlobales, data, config);
}

// Listar todos los saldos globales
export async function listarSaldosGlobales(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSaldosGlobales, config);
}

// Obtener el total de registros
export async function totalRegistrosSaldosGlobales() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalSaldosGlobales, config);
}

// Listar paginando los saldos globales
export async function listarPaginacionSaldosGlobales(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoSaldosGlobales + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener el folio actual de los saldos globales
export async function obtenerFolioActualSaldosGlobales() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioSaldosGlobales, config);
}

// Obtener por id un saldo
export async function obtenerXIDSaldosGlobales(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerxIDSaldosGlobales + `/${id}`, config);
}

/// Obtener por folio un saldo
export async function obtenerDatosxFolio(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerxFolioSaldosGlobales + `/${folio}`, config);
}

// Eliminar un saldo
export async function eliminaSaldosGlobales(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarSaldosGlobales + `/${id}`, config);
}

// Actualizar los datos del saldo
export async function actualizaSaldosGlobales(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarSaldosGlobales + `/${id}`, data, config);
}
