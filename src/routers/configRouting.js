// Importación de páginas principales
import Dashboard from '../page/Dashboard'
import Socios from '../page/Socios'
import Aportaciones from '../page/Aportaciones'
import Prestamos from '../page/Prestamos'
import Retiros from '../page/Retiros'
import BajaSocios from '../page/BajaSocios'
import Movimientos from '../page/Movimientos'
import EstadosCuenta from '../page/EstadosCuenta'
import Rendimientos from '../page/Rendimientos'
import Patrimonio from '../page/Patrimonio'
import Abonos from '../page/Abonos'
import DeudaSocio from '../page/DeudaSocio'
import Periodos from '../page/Periodos'
import InteresesSocios from '../page/InteresesSocios'
import SaldosSocios from '../page/SaldosSocios'
import Usuarios from '../page/Usuarios'
import UsuarioCorreos from '../page/UsuarioCorreos'

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
    path: '/socios',
    page: Socios,
  },
  {
    path: '/usuarios',
    page: Usuarios,
  },
  {
    path: '/usuarioCorreos',
    page: UsuarioCorreos,
  },
  {
    path: '/',
    page: Dashboard,
    default: true,
  },
]

export default configRouting
