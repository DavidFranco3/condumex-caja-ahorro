import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTrashCan, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { listarRetiroPeriodo } from '../../api/retiros'
import ListRetiros from '../../components/Retiros/ListRetiros'
import BasicModal from '../../components/Modal/BasicModal'
import CargaMasivaRetiros from '../../components/Retiros/CargaMasivaRetiros'
import RegistroRetiros from '../../components/Retiros/RegistroRetiros'
import RestaurarRetiros from '../../components/Retiros/RestaurarRetiros'
import EliminaRetiroMasivo from '../../components/Retiros/EliminaRetiroMasivo'
import Loading from '../../components/Loading'
import { map } from 'lodash'
import { listarPeriodo } from '../../api/periodos'

function Retiros(props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

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

  // Almacena el listado de retiros
  const [listRetiros, setListRetiros] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarRetiroPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response
        // console.log(data)
        if (!listRetiros && data) {
          setListRetiros(formatModelRetiros(data))
        } else {
          const datosRetiros = formatModelRetiros(data)
          setListRetiros(datosRetiros)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location, periodoElegido])

  // Para el registro manual de retiros
  const registroRetiros = (content) => {
    setTitulosModal('Registrar un retiro')
    setContentModal(content)
    setShowModal(true)
  }

  // Para el registro de Rendimientos
  const eliminaRetiroMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  const registroRetirosCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroRetirosRestaurar = (content) => {
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


  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>
              Retiros
            </h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
              <Button
                className='btnMasivo'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaRetiroMasivo(
                    <EliminaRetiroMasivo
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
                  registroRetirosCargaMasiva(
                    <CargaMasivaRetiros
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
                  registroRetirosRestaurar(
                    <RestaurarRetiros
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
                  registroRetiros(
                    <RegistroRetiros
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar retiro
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
        listRetiros
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListRetiros
                  listRetiros={listRetiros}
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

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

function formatModelRetiros(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      retiro: data.retiro,
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

export default Retiros
