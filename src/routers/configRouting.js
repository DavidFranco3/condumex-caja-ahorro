// Importación de páginas principales
import Dashboard from '../page/Dashboard'
import Socios from '../page/Socios'
import AjusteParametros from '../page/AjusteParametros'
import Aportaciones from '../page/Aportaciones'
import Prestamos from '../page/Prestamos'
import Retiros from '../page/Retiros'
import BajaSocios from '../page/BajaSocios'
import CalculadoraInteres from '../page/CalculadoraInteres'
import Movimientos from '../page/Movimientos'
import EstadosCuenta from '../page/EstadosCuenta'
import Rendimientos from '../page/Rendimientos'
import Saldos from '../page/Saldos'
import Patrimonio from '../page/Patrimonio'
import Abonos from '../page/Abonos'
import DeudaSocio from '../page/DeudaSocio'
import Periodos from '../page/Periodos'
import InteresesSocios from '../page/InteresesSocios'
import SaldosSocios from '../page/SaldosSocios'
import Usuarios from '../page/Usuarios'

const configRouting = [
  {
    path: '/interesesSocios',
    page: InteresesSocios,
  },
  {
    path: '/saldosSocios',
    page: SaldosSocios,
  },
  {
    path: '/patrimonio',
    page: Patrimonio,
  },
  {
    path: '/intereses',
    page: Rendimientos,
  },
  {
    path: '/periodos',
    page: Periodos,
  },
  {
    path: '/estados-de-cuenta',
    page: EstadosCuenta,
  },
  {
    path: '/movimientos',
    page: Movimientos,
  },
  {
    path: '/calculadora-de-intereses',
    page: CalculadoraInteres,
  },
  {
    path: '/saldos',
    page: Saldos,
  },
  {
    path: '/abonos',
    page: Abonos,
  },
  {
    path: '/deudaSocio',
    page: DeudaSocio,
  },
  {
    path: '/baja-de-socios',
    page: BajaSocios,
  },
  {
    path: '/retiros',
    page: Retiros,
  },
  {
    path: '/prestamos',
    page: Prestamos,
  },
  {
    path: '/aportaciones',
    page: Aportaciones,
  },
  {
    path: '/ajuste-de-parametros',
    page: AjusteParametros,
  },
  {
    path: '/socios',
    page: Socios,
  },
  {
    path: '/usuarios',
    page: Usuarios,
  },
  {
    path: '/',
    page: Dashboard,
    default: true,
  },
]

export default configRouting
