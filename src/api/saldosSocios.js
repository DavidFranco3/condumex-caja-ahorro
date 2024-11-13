import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroSaldos,
    ENDPOINTListarSaldos,
    ENDPOINTTotalSaldos,
    ENDPOINTTotalxTipoSaldos,
    ENDPOINTListarPaginandoSaldos,
    ENDPOINTListarPaginandoSaldosxTipo,
    ENDPOINTObtenerFolioActualSaldos,
    ENDPOINTObtenerSaldos,
    ENDPOINTObtenerxFichaSaldos,
    ENDPOINTEliminarSaldos,
    ENDPOINTActualizarSaldos,
    ENDPOINTObtenerFichaSaldos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro inicial de saldos del socio
export async function registroInicialSaldosSocio(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroSaldos, data, config);
}

// Obtener los datos de un socio por ficha
export async function obtenerDatosSaldos(fichaSocio) {
  // console.log("Ficha ", ficha)
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`,
    },
  }
  return axios.get(
    API_HOST + ENDPOINTObtenerFichaSaldos + `/${fichaSocio}`,
    config
  )
}

// Listar todos los saldos de los socios
export async function listarSaldosSocios(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSaldos, config);
}

// Obtener el total de registro de saldos de los socios
export async function totalRegistrosSaldosSocios() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalSaldos, config);
}

// Obtener el total de registros de saldos de socios segun la razon social indicada
export async function totalxTipoSaldosSocios(razonSocial) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalxTipoSaldos + `/${razonSocial}`, config);
}

// Listar paginando los saldos de los socios
export async function listarPaginacionSaldosSocios(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoSaldos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar paginando los saldos de los socios, indicando el tipo
export async function listarPaginacionSaldoSociosxTipo(pagina, limite, tipo) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoSaldosxTipo + `/?pagina=${pagina}&&limite=${limite}&&tipo=${tipo}`, config);
}

// Obtener el folio actual de saldos de los socios
export async function obtenerFolioActualSaldosSocios() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualSaldos, config);
}

// Obtener datos del saldo del socio indicando el id de la bd
export async function obtenerInfoxIDSaldoSocios(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerSaldos + `/${id}`, config);
}

// Obtener datos del saldo del socio indicando la ficha del socio
export async function obtenerInfoxFichaSaldoSocios(fichaSocio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerxFichaSaldos + `/${fichaSocio}`, config);
}

// Actualizar los saldos del socio
export async function actualizaSaldosSocios(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarSaldos + `/${id}`, data, config);
}
