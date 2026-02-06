import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faSackDollar, faTrashCan, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import BasicModal from '../../components/Modal/BasicModal'
import { listarAportacionesPeriodo } from '../../api/aportaciones'
import ListAportaciones from '../../components/Aportaciones/ListAportaciones'
import RegistroAportaciones from '../../components/Aportaciones/RegistroAportaciones'
import CargaMasivaAportaciones from '../../components/Aportaciones/CargaMasivaAportaciones'
import RestaurarAportaciones from '../../components/Aportaciones/RestaurarAportaciones'
import Loading from '../../components/Loading'
import EliminaAportacionMasivo from '../../components/Aportaciones/EliminaAportacionMasivo'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'

function Aportaciones (props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

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
          title: 'Sesión cerrada por seguridad',
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

  // Para almacenar el listado de aportaciones
  const [listAportaciones, setListAportaciones] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAportacionesPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listAportaciones && data) {
          setListAportaciones(formatModelAportaciones(data))
        } else {
          const datosAportaciones = formatModelAportaciones(data)
          setListAportaciones(datosAportaciones)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  // Para el registro de Rendimientos
  const eliminaAportacionMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Para el registro de aportaciones
  const registroAportaciones = (content) => {
    setTitulosModal('Registrar una aportación')
    setContentModal(content)
    setShowModal(true)
  }

  const registroAportacionesCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroAportacionesRestaurar = (content) => {
    setTitulosModal('Restaurar')
    setContentModal(content)
    setShowModal(true)
  }

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
            <h1 className='font-bold'>Aportaciones</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaAportacionMasivo(
                    <EliminaAportacionMasivo
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
                  registroAportacionesCargaMasiva(
                    <CargaMasivaAportaciones
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faSackDollar} /> Registro masivo
              </Button>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroAportacionesRestaurar(
                    <RestaurarAportaciones
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
                  registroAportaciones(
                    <RegistroAportaciones
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar aportación
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

      {listAportaciones
        ? (
          <>
            <Suspense fallback={<Spinner />}>
              <ListAportaciones
                setRefreshCheckLogin={setRefreshCheckLogin}
                listAportaciones={listAportaciones}
                history={history}
                location={location}
              />
            </Suspense>
          </>
          )
        : (
          <>
            <Loading />
          </>
          )}

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

function formatModelAportaciones (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      aportacion: data.aportacion,
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

export default Aportaciones
