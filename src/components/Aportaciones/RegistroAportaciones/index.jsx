import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './RegistroAportaciones.scss'
import { Button, Col, Form, Row, Spinner, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { obtenerFolioActualAportaciones, registraAportacionesSocios } from '../../../api/aportaciones'
import BusquedaSocios from '../../Socios/BusquedaSocios'
import BasicModal from '../../Modal/BasicModal'
import Swal from 'sweetalert2'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'
import { registroSaldoInicial } from '../../GestionAutomatica/Saldos/Saldos'
import { actualizacionSaldosSocios } from '../../GestionAutomatica/Saldos/ActualizacionSaldos'
import queryString from 'query-string'
import { getCurrentDate } from '../../Generales/FormatFecha'

function RegistroAportaciones (props) {
  const { setShowModal, history } = props

  // Para controlar el modal de busqueda de socios
  const [showModalBusqueda, setShowModalBusqueda] = useState(false)
  const [contentModalBusqueda, setContentModalBusqueda] = useState(null)
  const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null)

  // Para el modal de busqeuda
  const registroAportaciones = (content) => {
    setTitulosModalBusqueda('Búsqueda de socio')
    setContentModalBusqueda(content)
    setShowModalBusqueda(true)
  }

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  // Para cancelar el registro
  const cancelarRegistro = () => {
    setShowModal(false)
  }

  // Para almacenar el folio actual
  const [folioActual, setFolioActual] = useState('')

  useEffect(() => {
    try {
      obtenerFolioActualAportaciones().then(response => {
        const { data } = response
        // console.log(data)
        const { folio } = data
        setFolioActual(folio)
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [])

  // Para almacenar el id, ficha y nombre del socio elegido
  const [idSocioElegido, setIdSocioElegido] = useState('')
  const [fichaSocioElegido, setFichaSocioElegido] = useState('')
  const [nombreSocioElegido, setNombreSocioElegido] = useState('')

  // Para almacenar los datos del formulario
  // const [formData, setFormData] = useState(initialFormData());

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData()
  })

  const onSubmit = (dataa) => {
    // e.preventDefault() handled by RHF

    // e.preventDefault() handled by RHF

    // RHF handles validation for required fields like aportacion via register rules
    // But if we want to keep the manual check structure:
    if (!dataa.aportacion) {
      Swal.fire({
        title: 'Faltan datos',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
    } else {
      setLoading(true)
      // Realiza registro de la aportación
      obtenerFolioActualAportaciones().then(response => {
        const { data: dataFolio } = response
        const { folio } = dataFolio

        const dataTemp = {
          folio,
          fichaSocio: fichaSocioElegido,
          tipo: getRazonSocial(),
          periodo: getPeriodo(),
          aportacion: dataa.aportacion,
          createdAt: dataa.fecha
        }

        registraAportacionesSocios(dataTemp).then(response => {
          const { data: responseData } = response

          // Registra movimientos
          registroMovimientosSaldosSocios(fichaSocioElegido, dataa.aportacion, '0', '0', '0', '0', '0', '0', 'Aportación')

          // Registra Saldos
          registroSaldoInicial(fichaSocioElegido, dataa.aportacion, '0', '0', folio, 'Aportación')

          actualizacionSaldosSocios(fichaSocioElegido, dataa.aportacion, '0', '0', folio, 'Aportación')

          setLoading(false)
          history({
            search: queryString.stringify(''),
          })
          setShowModal(false)

          Swal.fire({
            title: responseData.mensaje,
            icon: 'success',
            showConfirmButton: false,
            timer: 1600,
          })
        }).catch(e => {
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }

  const eliminaBusqueda = () => {
    setFichaSocioElegido('')
    setNombreSocioElegido('')
    setIdSocioElegido('')
  }

  return (
    <>
      <div className='contenidoFormularioPrincipal'>
        <Form onSubmit={(e) => {
          e.preventDefault()
          if (!fichaSocioElegido) {
            Swal.fire({
              title: 'Debe elegir un socio',
              icon: 'warning',
              showConfirmButton: false,
              timer: 1600,
            })
            return
          }
          handleSubmit(onSubmit)(e)
        }}
        >

          {/* Ficha, nombre */}
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFicha'>
              <Form.Label>Folio</Form.Label>
              <Form.Control type='text' name='folio' defaultValue={folioActual} disabled />
            </Form.Group>

            {/* Hidden input for validation of socio selection - Removed to use Swal in onSubmit */}

            {
              fichaSocioElegido
                ? (
                  <>
                    <Form.Group as={Col} controlId='formGridFicha'>
                      <Form.Label>
                        Ficha <FontAwesomeIcon className='eliminaBusqueda' icon={faTrashCan} onClick={() => { eliminaBusqueda() }} />
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Ficha del socio'
                        name='ficha'
                        defaultValue={fichaSocioElegido}
                        disabled
                      />
                    </Form.Group>

                    <Row className='mb-3'>
                      <Form.Group as={Col} controlId='formGridFicha'>
                        <Form.Label>
                          Nombre <FontAwesomeIcon className='eliminaBusqueda' icon={faTrashCan} onClick={() => { eliminaBusqueda() }} />
                        </Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Nombre del socio'
                          name='nombre'
                          defaultValue={nombreSocioElegido}
                          disabled
                        />
                      </Form.Group>
                    </Row>
                  </>
                  )
                : (
                  <>
                    <Form.Group as={Col} controlId='formGridBusqueda'>
                      <Form.Label>
                        Socio
                      </Form.Label>
                      <Col>
                        <Button
                          type='button'
                          className='busquedaSocio'
                          onClick={() => {
                            registroAportaciones(
                              <BusquedaSocios
                                setShowModal={setShowModalBusqueda}
                                setIdSocioElegido={setIdSocioElegido}
                                setFichaSocioElegido={setFichaSocioElegido}
                                setNombreSocioElegido={setNombreSocioElegido}
                                idSocioElegido={idSocioElegido}
                                fichaSocioElegido={fichaSocioElegido}
                                nombreSocioElegido={nombreSocioElegido}
                              />
                            )
                          }}
                        >
                          Busca el socio
                        </Button>
                      </Col>

                    </Form.Group>

                  </>
                  )
            }
          </Row>
          {/* Tipo de socio, correo */}

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFechaRegistro'>
              <Form.Label>
                Fecha de registro
              </Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control
                  className='mb-3'
                  type='datetime-local'
                  placeholder='Fecha'
                  isInvalid={!!errors.fecha}
                  {...register('fecha', { required: 'La fecha es obligatoria' })}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.fecha?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId='formGridAportacion'>
              <Form.Label>
                Aportación
              </Form.Label>
              <InputGroup className='mb-3'>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type='number'
                  step='0.01'
                  placeholder='Escribe la aportación'
                  isInvalid={!!errors.aportacion}
                  {...register('aportacion', { required: 'La aportación es obligatoria' })}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.aportacion?.message}
                </Form.Control.Feedback>
                <InputGroup.Text>.00 MXN</InputGroup.Text>
              </InputGroup>

            </Form.Group>
          </Row>

          <Form.Group as={Row} className='botones'>
            <Col>
              <Button
                type='submit'
                variant='success'
                className='registrar'
              >
                {!loading ? 'Registrar' : <Spinner animation='border' />}
              </Button>
            </Col>
            <Col>
              <Button
                variant='danger'
                className='cancelar'
                onClick={() => {
                  cancelarRegistro()
                }}
              >
                Cancelar
              </Button>
            </Col>
          </Form.Group>

        </Form>
      </div>

      <BasicModal show={showModalBusqueda} setShow={setShowModalBusqueda} title={titulosModalBusqueda}>
        {contentModalBusqueda}
      </BasicModal>
    </>
  )
}

function initialFormData () {
  return {
    fichaSocio: '',
    aportacion: '',
    fecha: getCurrentDate()
  }
}

export default RegistroAportaciones
