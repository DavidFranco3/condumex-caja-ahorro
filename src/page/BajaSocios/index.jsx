import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { listarBajaSocioPeriodo } from '../../api/bajaSocios'
import ListBajaSocios from '../../components/BajaSocios/ListBajaSocios'
import RegistroBajaSocios from '../../components/BajaSocios/RegistroBajaSocios'
import BasicModal from '../../components/Modal/BasicModal'
import Loading from '../../components/Loading'
import { listarPeriodo } from '../../api/periodos'
import { map } from 'lodash'

function BajaSocios (props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  // Para el registro manual de baja de socios
  const registroSocios = (content) => {
    setTitulosModal('Registrar una baja')
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
      setPeriodoElegido(getPeriodo())
    }
  }

  useEffect(() => {
    guardarPeriodoElegido()
  }, [])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={8} className='titulo'>
            <h1 className='font-bold'>
              Baja de socios
            </h1>
          </Col>

          <Col xs={6} md={4}>
            <Col align='right'>
              <Button
                className='btnRegistro'
                onClick={() => {
                  registroSocios(
                    <RegistroBajaSocios
                      periodoElegido={periodoElegido}
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una baja de socios
              </Button>
            </Col>
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
        listBajasSocios
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListBajaSocios
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

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
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

export default BajaSocios
