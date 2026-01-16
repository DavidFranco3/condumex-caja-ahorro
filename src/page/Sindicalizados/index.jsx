import { useState, useEffect, Suspense } from 'react'
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap'
import { withRouter } from '../../utils/withRouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { listarSocioSindicalizado } from '../../api/sociosSindicalizados'
import ListSociosSindicalizados from '../../components/SociosSindicalizados/ListSociosSindicalizados'
import RegistroSociosSindicalizados from '../../components/SociosSindicalizados/RegistroSociosSindicalizados'
import CargaMasivaSociosSindicalizados from '../../components/SociosSindicalizados/CargaMasivaSociosSindicalizados'
import EliminaSociosSindicalizadosMasivo from '../../components/SociosSindicalizados/EliminaSociosSindicalizadosMasivo'
import BasicModal from '../../components/Modal/BasicModal'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import { formatFecha } from '../../components/Generales/FormatFecha'

function Sindicalizados (props) {
  const { setRefreshCheckLogin, location, history } = props

  // Almacena los datos de los abonos
  const [listSociosCSV, setListSociosCSV] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSocioSindicalizado().then(response => {
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
  const registroMasivoSociosSindicalizados = (content) => {
    setTitulosModal('Registro masivo de socios')
    setContentModal(content)
    setShowModal(true)
  }

  // Para la carga masiva de socios
  const eliminaMasivoSociosSindicalizados = (content) => {
    setTitulosModal('Elimina elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Para almacenar el listado de socios
  const [listSociosSindicalizados, setListSociosSindicalizados] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSocioSindicalizado().then(response => {
        const { data } = response
        // console.log(data)
        if (!listSociosSindicalizados && data) {
          setListSociosSindicalizados(formatModelSocios(data))
        } else {
          const datosSociosSindicalizados = formatModelSocios(data)
          setListSociosSindicalizados(datosSociosSindicalizados)
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
            <h1 className='font-bold'>Sindicalizados</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
              <Button
                className='btnMasivo'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaMasivoSociosSindicalizados(
                    <EliminaSociosSindicalizadosMasivo
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
                  registroMasivoSociosSindicalizados(
                    <CargaMasivaSociosSindicalizados
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
                    <RegistroSociosSindicalizados
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
        listSociosSindicalizados
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListSociosSindicalizados
                  listSocios={listSociosSindicalizados}
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
      fechaCreacion: formatFecha(data.createdAt)
    })
  })
  return dataTemp
}

export default withRouter(Sindicalizados)
