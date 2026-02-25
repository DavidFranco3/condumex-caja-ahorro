import { API_HOST, TOKEN, PERIODO, RAZON_SOCIAL } from '../utils/constants'
import { ENDPOINTLoginAdministrador } from './endpoints'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export async function login(data) {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const dataTemp = {
    ...data,
    correo: data.correo.toLowerCase()
  }

  return await axios.post(API_HOST + ENDPOINTLoginAdministrador, dataTemp, config)
}

export function setPeriodo(periodo) {
  const razonSocial = getRazonSocial()
  if (razonSocial) {
    localStorage.setItem(`${PERIODO}_${razonSocial}`, periodo)
  }
  localStorage.setItem(PERIODO, periodo)
}

export function getPeriodo() {
  const razonSocial = getRazonSocial()
  if (razonSocial) {
    return localStorage.getItem(`${PERIODO}_${razonSocial}`)
  }
  return localStorage.getItem(PERIODO)
}

function eliminaPeriodo() {
  const razonSocial = getRazonSocial()
  if (razonSocial) {
    localStorage.removeItem(`${PERIODO}_${razonSocial}`)
  }
  return localStorage.removeItem(PERIODO)
}

export function setRazonSocial(razonSocial) {
  localStorage.setItem(RAZON_SOCIAL, razonSocial)
}

export function setTokenApi(token) {
  localStorage.setItem(TOKEN, token)
}

export function getRazonSocial() {
  return localStorage.getItem(RAZON_SOCIAL)
}

export function getTokenApi() {
  return localStorage.getItem(TOKEN)
}

function eliminaRazonSocial() {
  return localStorage.removeItem(RAZON_SOCIAL)
}

export function logoutApi() {
  eliminaPeriodo()
  eliminaRazonSocial()
  return localStorage.removeItem(TOKEN)
}

export function isUserLogedApi() {
  const token = getTokenApi()
  if (!token) {
    logoutApi()
    return null
  }
  if (isExpired(token)) {
    logoutApi()
  }
  return jwtDecode(token)
}

function isExpired(token) {
  const { exp } = jwtDecode(token)
  const expire = exp * 1000
  const timeout = expire - Date.now()

  if (timeout < 0) {
    return true
  }
  return false
}

export function isExpiredToken(token) {
  const { exp } = jwtDecode(token)
  const expire = exp * 1000
  const timeout = expire - Date.now()

  if (timeout < 0) {
    return true
  }
  return false
}

export function obtenidusuarioLogueado(token) {
  const { _ } = jwtDecode(token)

  return _
}
