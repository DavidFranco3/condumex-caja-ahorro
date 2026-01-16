import { useState, useEffect, Suspense } from 'react'
import { withRouter } from '../../utils/withRouter'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth'
import Swal from 'sweetalert2'
import { Spinner } from 'react-bootstrap'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import './SaldosSindicalizados.scss'
import { listarPaginacionSaldoSociosxTipo, totalxTipoSaldosSocios } from '../../api/saldosSocios'
import ListSaldos from '../../components/Saldos/ListSaldos'

function SaldosSindicalizados (props) {
  const { setRefreshCheckLogin, location, history } = props

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        Swal.fire({
          title: 'Sesión expirada',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1600,
        })
        Swal.fire({
          title: 'Sesión cerrrada por seguridad',
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
        logoutApi()
        setRefreshCheckLogin(true)
      }
    }
  }, [])
  // Termina cerrado de sesión automatico

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [totalSaldoSociosSindicalizados, setTotalSaldoSociosSindicalizados] = useState(0)

  // Para almacenar el listado de saldos de los socios
  const [listSaldoSociosSindicalizados, setListSaldoSociosSindicalizados] = useState(0)

  useEffect(() => {
    try {
      // Obten el total de registros de saldos de socios empleados
      totalxTipoSaldosSocios(getRazonSocial()).then(response => {
        const { data } = response
        // console.log(data)
        setTotalSaldoSociosSindicalizados(data)
      }).catch(e => {
        if (e.message === 'Network Error') {
          Swal.fire({
            title: 'Conexión al servidor no disponible',
            icon: 'error',
            showConfirmButton: false,
            timer: 1600,
          })
        }
        // console.log(e)
      })

      // Obten el listado de socios empleados
      if (page === 0) {
        setPage(1)
        listarPaginacionSaldoSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
          const { data } = response
          // console.log(data)
          if (!listSaldoSociosSindicalizados && data) {
            setListSaldoSociosSindicalizados(formatModelSaldosSocios(data))
          } else {
            const datos = formatModelSaldosSocios(data)
            setListSaldoSociosSindicalizados(datos)
          }
        }).catch(e => {
          console.log(e)
        })
      } else {
        listarPaginacionSaldoSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
          const { data } = response
          // console.log(data)
          if (!listSaldoSociosSindicalizados && data) {
            setListSaldoSociosSindicalizados(formatModelSaldosSocios(data))
          } else {
            const datos = formatModelSaldosSocios(data)
            setListSaldoSociosSindicalizados(datos)
          }
        }).catch(e => {
          console.log(e)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }, [location, page, rowsPerPage])

  return (
    <>
      {
        listSaldoSociosSindicalizados
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListSaldos
                  listSaldosSocios={listSaldoSociosSindicalizados}
                  history={history}
                  location={location}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  page={page}
                  setPage={setPage}
                  totalSaldosSocios={totalSaldoSociosSindicalizados}
                />
              </Suspense>
            </>
            )
          : (
            <>
              <Lottie
                loop
                play
                animationData={AnimacionLoading}
              />
            </>
            )
      }
    </>
  )
}

function formatModelSaldosSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: data.fichaSocio,
      capital: data.capital,
      prestamo: data.prestamo,
      patrimonio: data.patrimonio,
      folioMovimiento: data.folioMovimiento,
      movimiento: data.movimiento,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

export default withRouter(SaldosSindicalizados)
