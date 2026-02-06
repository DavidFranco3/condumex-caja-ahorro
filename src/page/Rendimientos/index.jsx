import { useState, useEffect, Fragment, Suspense } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useNavigate, useLocation } from 'react-router-dom'

import Swal from 'sweetalert2'
import { Alert, Button, Col, Row, Spinner, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faSackDollar, faTrashCan, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from '../../api/auth'
import {
  obtenerFolioActualRendimientos,
  registraRendimientosSocios,
  totalGeneralBySocios,
  listarRendimientoPeriodo
} from '../../api/rendimientos'
import { registraMovimientoSaldosSocios2 } from '../../components/GestionAutomatica/Saldos/Movimientos'
import Loading from '../../components/Loading'
import BasicModal from '../../components/Modal/BasicModal'
import ListRendimientos from '../../components/Rendimientos/ListRendimientos'
import RegistroRendimientos from '../../components/Rendimientos/RegistroRendimientos'
import CargaMasivaRendimientos from '../../components/Rendimientos/CargaMasivaRendimientos'
import RegistroMonto from '../../components/Rendimientos/RegistroMonto'
import RestaurarRendimientos from '../../components/Rendimientos/RestaurarRendimientos'
import EliminaRendimientosMasivo from '../../components/Rendimientos/EliminaRendimientosMasivo'
import { actualizacionSaldosSocios } from '../../components/GestionAutomatica/Saldos/ActualizacionSaldos'
import { registroSaldoInicial } from '../../components/GestionAutomatica/Saldos/Saldos'
import { map } from 'lodash'
import { listarPeriodo } from '../../api/periodos'

function Rendimientos ({ setRefreshCheckLogin }) {
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate
  // Dialog headlessui
  const [isOpen, setIsOpen] = useState(false)

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)
  // Para almacenar el listado de Rendimientos
  const [listRendimientos, setListRendimientos] = useState(null)
  const [contribuitors, setContribuitors] = useState([])
  const [razon] = useState(getRazonSocial())
  const [periodo] = useState(getPeriodo())
  const [countSave, setCountSave] = useState(0)

  const [reloadRendimientos, setReloadRendimientos] = useState(false)

  const getRendimientos = () => {
    listarRendimientoPeriodo(razon, getPeriodo())
      .then((response) => {
        const { data } = response
        if (listRendimientos && data) {
          setListRendimientos(formatModelRendimientos(data))
        } else {
          const datosRendimientos = formatModelRendimientos(data)
          setListRendimientos(datosRendimientos)
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

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

  useEffect(() => {
    if (reloadRendimientos) {
      getRendimientos()
      setReloadRendimientos(false)
    }
  }, [reloadRendimientos])

  useEffect(() => {
    getRendimientos()
  }, [location])

  const closeModal = () => {
    setIsOpen(false)
    setCountSave(0)
    setReloadRendimientos(true)
  }

  // Para el registro de Rendimientos
  const eliminaRendimientosMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Para el registro de Rendimientos
  const registroRendimiento = (content) => {
    setTitulosModal('Registrar un interés')
    setContentModal(content)
    setShowModal(true)
  }

  const registroRendimientosCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroRendimientosRestaurar = (content) => {
    setTitulosModal('Restaurar')
    setContentModal(content)
    setShowModal(true)
  }

  // For the modal to register a new Monto
  const registroModalMonto = (content) => {
    // setRendimientos([])
    setTitulosModal('Carga por monto')
    setContentModal(content)
    setShowModal(true)
  }

  const handleShowContribuitor = async () => {
    setShowModal(false)
    setIsOpen(true)

    const earningsLocal = localStorage.getItem('earnings')
    const earningsLocalNumber = parseFloat(earningsLocal) || 0
    const totalGeneralLocalNumber = parseFloat(localStorage.getItem('totalGeneral')) || 0

    const earningsDate = localStorage.getItem('earningsDate')

    const rendimientoMes = earningsLocalNumber / totalGeneralLocalNumber

    const response = await totalGeneralBySocios(earningsDate, razon, periodo)

    const {
      data: { data },
    } = response

    const tmpData = data.map(({ id, total }) => ({
      fichaSocio: id,
      rendimiento: Number(total.$numberDecimal) * rendimientoMes,
    }))

    setContribuitors(tmpData)

    // save the rendimientos data in the database
    for (const { fichaSocio, rendimiento } of tmpData) {
      const responseFolio = await obtenerFolioActualRendimientos()
      const {
        data: { folio },
      } = responseFolio

      const dataRendimiento = {
        folio,
        fichaSocio,
        rendimiento,
        periodo,
        tipo: razon,
        createdAt: earningsDate,
      }

      await registraRendimientosSocios(dataRendimiento)
      await registraMovimientoSaldosSocios2(
        fichaSocio,
        '0',
        '0',
        '0',
        '0',
        rendimiento,
        '0',
        '0',
        'Interés'
      )

      await actualizacionSaldosSocios(
        fichaSocio,
        '0',
        '0',
        rendimiento,
        folio,
        'Interés'
      )

      await registroSaldoInicial(
        fichaSocio,
        '0',
        '0',
        rendimiento,
        folio,
        'Interés'
      )

      setCountSave((oldValue) => oldValue + 1)
    }
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog static as='div' className='relative z-10' onClose={() => null}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </TransitionChild>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <DialogTitle
                    as='h3'
                    className='flex justify-center items-center text-lg font-medium leading-6 text-gray-900'
                  >
                    Guardando rendimientos
                  </DialogTitle>
                  <div className='flex justify-center items-center flex-col mt-2'>
                    <p className='text-sm text-gray-500'>
                      {countSave} de {contribuitors.length}
                    </p>
                    {countSave !== contribuitors.length && (
                      <Spinner animation='border' />
                    )}
                  </div>

                  <div className='flex justify-center items-center mt-4'>
                    {countSave === contribuitors.length && (
                      <button
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                      >
                        Aceptar
                      </button>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>Intereses</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroModalMonto(
                    <RegistroMonto
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                      razon={razon}
                      onRepartir={handleShowContribuitor}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faSackDollar} /> Carga por monto
              </Button>

              <Button
                className='btnRegistro'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaRendimientosMasivo(
                    <EliminaRendimientosMasivo
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
                  registroRendimientosCargaMasiva(
                    <CargaMasivaRendimientos
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
                  registroRendimientosRestaurar(
                    <RestaurarRendimientos
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
                  registroRendimiento(
                    <RegistroRendimientos
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar interés
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

      {listRendimientos
        ? (
          <Suspense fallback={<Spinner />}>
            <ListRendimientos
              setRefreshCheckLogin={setRefreshCheckLogin}
              listRendimientos={listRendimientos}
              history={history}
              location={location}
            />
          </Suspense>
          )
        : (
          <Loading />
          )}

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

function formatModelRendimientos (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      rendimiento: data.rendimiento,
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

export default Rendimientos
