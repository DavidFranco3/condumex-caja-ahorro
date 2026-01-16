import { API_HOST } from '../utils/constants'
import {
  ENDPOINTEnviarCorreos,
  ENDPOINTEnviarEspecialCorreos
} from './endpoints'
import axios from 'axios'
import { getTokenApi } from './auth'

// Enviar correo indicando destinatario
export async function enviaCorreo (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }

  return await axios.post(API_HOST + ENDPOINTEnviarCorreos, data, config)
}

// Enviar correo indicando remitente y destinatario
export async function enviarCorreoDetallado (data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenApi()}`
    }
  }

  return await axios.post(API_HOST + ENDPOINTEnviarEspecialCorreos, data, config)
}
