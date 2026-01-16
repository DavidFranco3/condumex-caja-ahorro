import { useState, useEffect, Suspense } from 'react'
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap'
import { withRouter } from '../../utils/withRouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { listarSociosEmpleados } from '../../api/sociosEmpleados'
import ListSociosEmpleados from '../../components/SociosEmpleados/ListSociosEmpleados'
import Swal from 'sweetalert2'
import RegistroSociosEmpleados from '../../components/SociosEmpleados/RegistroSociosEmpleados'
import CargaMasivaSociosEmpleados from '../../components/SociosEmpleados/CargaMasivaSociosEmpleados'
import EliminaSociosEmpleadosMasivo from '../../components/SociosEmpleados/EliminaSociosEmpleadosMasivo'
import BasicModal from '../../components/Modal/BasicModal'
import { getTokenApi, isExpiredToken, logoutApi } from '../../api/auth'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import moment from 'moment'

function Empleados (props) {
  const { setRefreshCheckLogin, location, history } = props

  // Almacena los datos de los abonos
  const [listSociosCSV, setListSociosCSV] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSociosEmpleados().then(response => {
        const { data } = response
        // console.log(data)
        if (!listSociosCSV && data) {
          setListSociosCSV(formatModelSocios2(data))
        } else {
          const datosSocios = formatModelSocios2(data)
          setListSociosCSV(datosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

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

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  // Para el registro de socios
  const registroSocios = (content) => {
    setTitulosModal('Registrando Socio')
    setContentModal(content)
    setShowModal(true)
  }

  // Para la carga masiva de socios
  const registroMasivoSociosEmpleados = (content) => {
    setTitulosModal('Registro masivo de socios')
    setContentModal(content)
    setShowModal(true)
  }

  // Para la carga masiva de socios
  const eliminaMasivoSociosEmpleados = (content) => {
    setTitulosModal('Elimina elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Para almacenar el listado de socios
  const [listSociosEmpleados, setListSociosEmpleados] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSociosEmpleados().then(response => {
        const { data } = response
        // console.log(data)
        if (!listSociosEmpleados && data) {
          setListSociosEmpleados(formatModelSocios(data))
        } else {
          const datosSociosEmpleados = formatModelSocios(data)
          setListSociosEmpleados(datosSociosEmpleados)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>Empleados</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
              <Button
                className='btnMasivo'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaMasivoSociosEmpleados(
                    <EliminaSociosEmpleadosMasivo
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
                  registroMasivoSociosEmpleados(
                    <CargaMasivaSociosEmpleados
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registro Masivo
              </Button>
              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroSocios(
                    <RegistroSociosEmpleados
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar socio
              </Button>
            </div>
          </Col>
        </Row>
      </Alert>

      {
                listSociosEmpleados
                  ? (
                    <>
                      <Suspense fallback={<Spinner />}>
                        <ListSociosEmpleados
                          listSocios={listSociosEmpleados}
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

function formatModelSocios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      ficha: String(data.ficha),
      nombre: data.nombre,
      tipo: data.tipo,
      correo: data.correo ? data.correo : 'No especificado',
      estado: data.estado === 'true' ? 'Activo' : 'Inactivo',
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelSocios2 (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      ficha: parseInt(data.ficha),
      nombre: data.nombre,
      correo: data.correo ? data.correo : 'No especificado',
      fechaCreacion: moment(data.createdAt).format('LL')
    })
  })
  return dataTemp
}

export default withRouter(Empleados)
