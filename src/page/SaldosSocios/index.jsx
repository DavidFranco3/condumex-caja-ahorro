import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Col, Row, Spinner, Form } from 'react-bootstrap'
import { listarRendimientoPeriodo } from '../../api/rendimientos'
import { listarPatrimoniosPeriodo } from '../../api/patrimonio'
import { listarAportacionesPeriodo } from '../../api/aportaciones'
import { listarPrestamoPeriodo } from '../../api/prestamos'
import { listarAbonosPeriodo } from '../../api/abonos'
import { listarBajaSocioPeriodo } from '../../api/bajaSocios'
import ListSaldosSocios from '../../components/SaldosSocios/ListSaldosSocios'
import Loading from '../../components/Loading'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'
import './InteresesSocios.scss'

function SaldosSocios (props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

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

  // Para almacenar el listado de bajas de socios
  const [listBajasSocios, setListBajasSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarBajaSocioPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listBajasSocios && data) {
          setListBajasSocios(formatModelBajaSocios(data))
        } else {
          const datosBajas = formatModelBajaSocios(data)
          setListBajasSocios(datosBajas)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  console.log(listBajasSocios)

  // Almacena los datos de los abonos
  const [listInteresesSocios, setListInteresesSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarRendimientoPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listInteresesSocios && data) {
          setListInteresesSocios(formatModelInteresesSocios(data))
        } else {
          const datosInteresesSocios = formatModelInteresesSocios(data)
          setListInteresesSocios(datosInteresesSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  // Almacena los datos de los abonos
  const [listPatrimoniosSocios, setListPatrimoniosSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarPatrimoniosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listPatrimoniosSocios && data) {
          setListPatrimoniosSocios(formatModelPatrimonioSocios(data))
        } else {
          const datosPatrimoniosSocios = formatModelPatrimonioSocios(data)
          setListPatrimoniosSocios(datosPatrimoniosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  // Almacena los datos de los abonos
  const [listAportacionesSocios, setListAportacionesSocios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAportacionesPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listAportacionesSocios && data) {
          setListAportacionesSocios(formatModelAportacionesSocios(data))
        } else {
          const datosAportacionesSocios = formatModelAportacionesSocios(data)
          setListAportacionesSocios(datosAportacionesSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

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
  }, [location])

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
  }, [location])

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

  // Almacena la razón social, si ya fue elegida
  const [periodoElegido, setPeriodoElegido] = useState('')

  // Para almacenar en localstorage la razon social
  const almacenaPeriodo = (periodo) => {
    if (periodo !== 'Elige una opción') {
      setPeriodo(periodo)
    }
    window.location.reload()
  }

  const guardarPeriodoElegido = () => {
    if (getPeriodo()) {
      setPeriodoElegido(getPeriodo)
    }
  }

  useEffect(() => {
    guardarPeriodoElegido()
  }, [])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>Saldos de los socios</h1>
          </Col>
          <Col xs={6} md={8} />
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
            defaultValue={periodoElegido}
            onChange={(e) => {
              almacenaPeriodo(e.target.value)
            }}
          >
            <option>Elige una opción</option>
            {map(periodosRegistrados, (periodo, index) => (
              <option key={index} value={periodo?.folio} selected={parseInt(periodoElegido) === parseInt(periodo?.folio)}>{periodo?.nombre}</option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      {
        listInteresesSocios && listAportacionesSocios && listPatrimoniosSocios && listPrestamosSocios && listAbonosSocios
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListSaldosSocios
                  listInteresesSocios={listInteresesSocios}
                  listAportacionesSocios={listAportacionesSocios}
                  listPatrimoniosSocios={listPatrimoniosSocios}
                  listPrestamosSocios={listPrestamosSocios}
                  listAbonosSocios={listAbonosSocios}
                  listBajasSocios={listBajasSocios}
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

function formatModelBajaSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      total: data.total,
      aportacion: data.aportacion,
      rendimiento: data.rendimiento,
      patrimonio: data.patrimonio,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelInteresesSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      monto: data.rendimiento,
      patrimonio: 0,
      prestamo: 0,
      abono: 0,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelPatrimonioSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      monto: 0,
      patrimonio: data.patrimonio,
      prestamo: 0,
      abono: 0,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelAportacionesSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      monto: data.aportacion,
      patrimonio: 0,
      prestamo: 0,
      abono: 0,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelPrestamosSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      monto: 0,
      patrimonio: 0,
      prestamo: data.prestamo,
      abono: 0,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelAbonosSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      fichaSocio: String(data.fichaSocio),
      monto: 0,
      patrimonio: 0,
      prestamo: 0,
      abono: data.abono,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelPeriodos (data) {
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

export default SaldosSocios
