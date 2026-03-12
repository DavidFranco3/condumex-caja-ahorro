import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Col, Row, Spinner, Form } from 'react-bootstrap'
import { listarMovimientoSaldosPeriodo } from '../../api/movimientosSaldos'
import ListMovimientos from '../../components/Movimientos/ListMovimientos'
import Loading from '../../components/Loading'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'

function Movimientos(props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

  // Para almacenar las sucursales registradas
  const [periodosRegistrados, setPeriodosRegistrados] = useState(null)
  const [periodoElegido, setPeriodoElegido] = useState(getPeriodo() || '')

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

  const almacenaPeriodo = (periodo) => {
    if (periodo !== 'Elige una opción') {
      const p = periodosRegistrados?.find(x => String(x.folio) === String(periodo))
      if (p) {
        localStorage.setItem('PERIODO_NOMBRE', p.nombre)
      }
      setPeriodo(periodo)
      setPeriodoElegido(periodo)
    }
  }

  useEffect(() => {
    if (periodosRegistrados && periodosRegistrados.length > 0) {
      const storedNombre = localStorage.getItem('PERIODO_NOMBRE')
      if (storedNombre) {
        const found = periodosRegistrados.find(p => p.nombre === storedNombre)
        if (found) {
          setPeriodoElegido(found.folio)
          setPeriodo(found.folio)
        }
      }
    }
  }, [periodosRegistrados])

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

  // Para almacenar el listado de movimentos
  const [listMovimientos, setListMovimientos] = useState(null)

  useEffect(() => {
    if (periodosRegistrados && !periodosRegistrados.find(p => String(p.folio) === String(periodoElegido))) return;

    let isMounted = true;
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarMovimientoSaldosPeriodo(getRazonSocial(), periodoElegido).then(response => {
        if (!isMounted) return;
        const { data } = response
        // console.log(data)
        if (!listMovimientos && data) {
          setListMovimientos(formatModelMovimientosSocio(data))
        } else {
          const datosMovimientos = formatModelMovimientosSocio(data)
          setListMovimientos(datosMovimientos)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
    return () => { isMounted = false; };
  }, [location, periodoElegido])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={8} className='titulo'>
            <h1 className='font-bold'>
              Movimientos
            </h1>
          </Col>
          <Col xs={6} md={4} />
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
        listMovimientos
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListMovimientos
                  listMovimientos={listMovimientos}
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

function formatModelMovimientosSocio(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      ...data,
      id: data._id,
      fichaSocio: String(data.fichaSocio),
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

export default Movimientos
