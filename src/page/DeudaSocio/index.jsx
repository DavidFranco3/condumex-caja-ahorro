import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Col, Row, Spinner, Form } from 'react-bootstrap'
import ListDeudaSocio from '../../components/DeudaSocio/ListDeudaSocio'
import { listarPrestamoPeriodo } from '../../api/prestamos'
import { listarAbonosPeriodo } from '../../api/abonos'
import Loading from '../../components/Loading'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'

function DeudaSocio(props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

  // Almacena la razón social, si ya fue elegida
  const [periodoElegido, setPeriodoElegido] = useState(getPeriodo() || '')

  // Para almacenar en localstorage el periodo
  const almacenaPeriodo = (periodo) => {
    if (periodo !== 'Elige una opción') {
      setPeriodo(periodo)
      setPeriodoElegido(periodo)
    }
  }

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

  // Almacena los datos de los abonos
  const [listPrestamosSocios, setListPrestamosSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarPrestamoPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listPrestamosSocios && data) {
          setListPrestamosSocios(formatModelPrestamosSocios(data))
        } else {
          const datosPrestamosSocios = formatModelPrestamosSocios(data)
          setListPrestamosSocios(datosPrestamosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location, periodoElegido])

  // Almacena los datos de los abonos
  const [listAbonosSocios, setListAbonosSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAbonosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listAbonosSocios && data) {
          setListAbonosSocios(formatModelAbonosSocios(data))
        } else {
          const datosAbonosSocios = formatModelAbonosSocios(data)
          setListAbonosSocios(datosAbonosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location, periodoElegido])

  // Para almacenar las sucursales registradas
  const [periodosRegistrados, setPeriodosRegistrados] = useState(null)

  const cargarListaPeriodos = () => {
    try {
      listarPeriodo(getRazonSocial()).then(response => {
        const { data } = response
        // console.log(data)
        const dataTemp = formatModelPeriodos(data)
        // console.log(data)
        setPeriodosRegistrados(dataTemp)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    cargarListaPeriodos()
  }, [])


  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>Deudas de socios</h1>
          </Col>
        </Row>
      </Alert>

      <Row>
        <Col xs={6} md={4} />
        <Col xs={6} md={4}>
          <Form.Control
            as='select'
            aria-label='indicadorPeriodo'
            name='periodo'
            className='periodo'
            value={periodoElegido}
            onChange={(e) => {
              almacenaPeriodo(e.target.value)
            }}
          >
            <option value=''>Elige una opción</option>
            {map(periodosRegistrados, (periodo, index) => (
              <option key={index} value={periodo?.folio}>{periodo?.nombre}</option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      {
        listPrestamosSocios && listAbonosSocios
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListDeudaSocio
                  listAbonos={listAbonosSocios}
                  listPrestamos={listPrestamosSocios}
                  history={history}
                  location={location}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                />
              </Suspense>
            </>
          )
          : (
            <>
              <Loading />
            </>
          )
      }
    </>
  )
}

function formatModelPrestamosSocios(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      prestamo: data.prestamo,
      abono: 0,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelAbonosSocios(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      prestamo: 0,
      abono: data.abono,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelPeriodos(data) {
  // console.log(data)
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      nombre: data.nombre,
      tipo: data.tipo,
      fechaInicio: data.fechaInicio,
      fechaCierre: data.fechaCierre,
      fechaRegistro: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

export default DeudaSocio
