import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTrashCan, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { listarAbonosPeriodo } from '../../api/abonos'
import ListAbonos from '../../components/Abonos/ListAbonos'
import BasicModal from '../../components/Modal/BasicModal'
import EliminaAbonosMasivo from '../../components/Abonos/EliminaAbonosMasivo'
import CargaMasivaAbonos from '../../components/Abonos/CargaMasivaAbonos'
import RegistroAbonos from '../../components/Abonos/RegistroAbonos'
import RestaurarAbonos from '../../components/Abonos/RestaurarAbonos'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'
import './Abonos.scss'

function Abonos (props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate
  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  // Para el registro de Rendimientos
  const eliminaAbonosMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  const registroAbonosCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroAbonosRestaurar = (content) => {
    setTitulosModal('Restaurar')
    setContentModal(content)
    setShowModal(true)
  }

  // Para la lista de abonos
  const registroAbonos = (content) => {
    setTitulosModal('Registrar un abono')
    setContentModal(content)
    setShowModal(true)
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
  const [listAbonos, setListAbonos] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAbonosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listAbonos && data) {
          setListAbonos(formatModelAbonos(data))
        } else {
          const datosAbonos = formatModelAbonos(data)
          setListAbonos(datosAbonos)
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
    map(listAbonos, (abono, index) => {
      const tempFicha = abono.fichaSocio.split('T')
      listaFichasTemp.push(tempFicha[0])
    })
    setListaFichas(listaFichasTemp)
  }, [listAbonos])

  const [listaAbonos2, setListaAbonos2] = useState([])

  useEffect(() => {
    const listaAbonosTemp = []
    map(listAbonos, (abono, index) => {
      const tempAbono = abono.abono.split('T')
      listaAbonosTemp.push(tempAbono[0])
    })
    setListaAbonos2(listaAbonosTemp)
  }, [listAbonos])

  const [listaFechas, setListaFechas] = useState([])

  useEffect(() => {
    const listaFechasTemp = []
    map(listAbonos, (prestamo, index) => {
      const tempFecha = prestamo.fechaCreacion.split('T')
      listaFechasTemp.push(tempFecha[0])
    })
    setListaFechas(listaFechasTemp)
  }, [listAbonos])

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
            <h1 className='font-bold'>Abonos</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>

              <Button
                className='btnMasivo'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaAbonosMasivo(
                    <EliminaAbonosMasivo
                      listaFichas={listaFichas}
                      listaAbonos2={listaAbonos2}
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
                  registroAbonosCargaMasiva(
                    <CargaMasivaAbonos
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
                  registroAbonosRestaurar(
                    <RestaurarAbonos
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
                  registroAbonos(
                    <RegistroAbonos
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar abono
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
        listAbonos
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListAbonos
                  listAbonos={listAbonos}
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

function formatModelAbonos (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      abono: String(data.abono),
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

export default Abonos
