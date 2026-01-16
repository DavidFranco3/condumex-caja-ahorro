import { useState, useEffect, Suspense } from 'react'
import { withRouter } from '../../utils/withRouter'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTrashCan, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { listarPrestamoPeriodo } from '../../api/prestamos'
import ListPrestamos from '../../components/Prestamos/ListPrestamos'
import RegistroPrestamos from '../../components/Prestamos/RegistroPrestamos'
import BasicModal from '../../components/Modal/BasicModal'
import CargaMasivaPrestamos from '../../components/Prestamos/CargaMasivaPrestamos'
import EliminaPrestamoMasivo from '../../components/Prestamos/EliminaPrestamoMasivo'
import RestaurarPrestamos from '../../components/Prestamos/RestaurarPrestamos'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import { map } from 'lodash'
import { listarPeriodo } from '../../api/periodos'

function Prestamos (props) {
  const { setRefreshCheckLogin, location, history } = props
  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

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

  // Para el registro de prestamos
  const registroPrestamos = (content) => {
    setTitulosModal('Registrar un préstamo')
    setContentModal(content)
    setShowModal(true)
  }

  const registroPrestamosCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroPrestamosRestaurar = (content) => {
    setTitulosModal('Restaurar')
    setContentModal(content)
    setShowModal(true)
  }

  // Para el registro de Rendimientos
  const eliminaPrestamoMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Almacena los datos de los prestamos
  const [listPrestamos, setListPrestamos] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarPrestamoPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listPrestamos && data) {
          setListPrestamos(formatModelPrestamos(data))
        } else {
          const datosPrestamos = formatModelPrestamos(data)
          setListPrestamos(datosPrestamos)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  const [listaFichas, setListaFichas] = useState([])

  useEffect(() => {
    const listaFichasTemp = []
    map(listPrestamos, (prestamo, index) => {
      const tempFicha = prestamo.fichaSocio.split('T')
      listaFichasTemp.push(tempFicha[0])
    })
    setListaFichas(listaFichasTemp)
  }, [listPrestamos])

  const [listaPrestamos2, setListaPrestamos2] = useState([])

  useEffect(() => {
    const listaPrestamosTemp = []
    map(listPrestamos, (prestamo, index) => {
      const tempPrestamo = prestamo.prestamoTotal.split('T')
      listaPrestamosTemp.push(tempPrestamo[0])
    })
    setListaPrestamos2(listaPrestamosTemp)
  }, [listPrestamos])

  const [listaFechas, setListaFechas] = useState([])

  useEffect(() => {
    const listaFechasTemp = []
    map(listPrestamos, (prestamo, index) => {
      const tempFecha = prestamo.fechaCreacion.split('T')
      listaFechasTemp.push(tempFecha[0])
    })
    setListaFechas(listaFechasTemp)
  }, [listPrestamos])

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
            <h1 className='font-bold'>Préstamos</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>

              <Button
                className='btnMasivo'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaPrestamoMasivo(
                    <EliminaPrestamoMasivo
                      listPrestamos2={listPrestamos}
                      listaFichas={listaFichas}
                      listaPrestamos2={listaPrestamos2}
                      listaFechas={listaFechas}
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} /> Eliminar por fecha
              </Button>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroPrestamosCargaMasiva(
                    <CargaMasivaPrestamos
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registro masivo
              </Button>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroPrestamosRestaurar(
                    <RestaurarPrestamos
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faWindowRestore} /> Restaurar
              </Button>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroPrestamos(
                    <RegistroPrestamos
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar préstamo
              </Button>
            </div>
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
                listPrestamos
                  ? (
                    <>
                      <Suspense fallback={<Spinner />}>
                        <ListPrestamos
                          listPrestamos={listPrestamos}
                          listPrestamos2={listPrestamos}
                          history={history}
                          location={location}
                          setRefreshCheckLogin={setRefreshCheckLogin}
                        />
                      </Suspense>
                    </>
                    )
                  : (
                    <>
                      <Lottie loop play animationData={AnimacionLoading} />
                    </>
                    )
            }

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

function formatModelPrestamos (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      cantidadPagos: data.cantidadPagos,
      abonoPorPago: data.abonoPorPago,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      prestamo: String(data.prestamo),
      prestamoTotal: String(data.prestamoTotal),
      tasaInteres: data.tasaInteres,
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

export default withRouter(Prestamos)
