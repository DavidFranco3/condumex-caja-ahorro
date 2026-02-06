import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { obtenerFolioActualPrestamo, registraPrestamos } from '../../../api/prestamos'
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import BusquedaSocios from '../../Socios/BusquedaSocios'
import BasicModal from '../../Modal/BasicModal'
import Swal from 'sweetalert2'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import queryString from 'query-string'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'
import { registroDeudaSocioInicial, actualizacionDeudaSocio } from '../../DeudaSocio/RegistroActualizacionDeudaSocio'

function RegistroPrestamos (props) {
  const { setShowModal, history } = props
  // Para controlar el modal de busqueda de socios
  // Para hacer uso del modal
  const [showModalBusqueda, setShowModalBusqueda] = useState(false)
  const [contentModalBusqueda, setContentModalBusqueda] = useState(null)
  const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null)
  // Para el modal de busqueda
  const registroPrestamo = (content) => {
    setTitulosModalBusqueda('Búsqueda de socio')
    setContentModalBusqueda(content)
    setShowModalBusqueda(true)
  }

  // Para controlar la animación
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
      obtenerFolioActualPrestamo().then(response => {
        const { data } = response
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

  const { register, handleSubmit, watch, setValue, formState: { errors }, clearErrors } = useForm({
    defaultValues: initialFormData()
  })

  const prestamoValue = watch('prestamo')
  const tasaInteresValue = watch('tasaInteres')
  const [interesGenerado, setInteresGenerado] = useState(0)

  // Calculate interest whenever prestamo or tasaInteres changes
  useEffect(() => {
    const p = parseFloat(prestamoValue) || 0
    const t = parseFloat(tasaInteresValue) || 0
    const tempInteres = t / 100
    const tempInteresGenerado = p * tempInteres
    const aPagar = p + tempInteresGenerado
    setInteresGenerado(aPagar)
  }, [prestamoValue, tasaInteresValue])

  // Update form value when fichaSocioElegido changes
  useEffect(() => {
    if (fichaSocioElegido) {
      setValue('fichaSocio', fichaSocioElegido)
      clearErrors('fichaSocio')
    } else {
      setValue('fichaSocio', '')
    }
  }, [fichaSocioElegido, setValue, clearErrors])

  const onSubmit = (dataa) => {
    setLoading(true)

    // Realiza el registro del prestamo
    obtenerFolioActualPrestamo().then(response => {
      const { data: dataFolio } = response
      const { folio } = dataFolio
      const dataTemp = {
        folio,
        fichaSocio: fichaSocioElegido,
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        prestamo: dataa.prestamo,
        prestamoTotal: interesGenerado,
        tasaInteres: dataa.tasaInteres,
        createdAt: dataa.fecha
      }

      registraPrestamos(dataTemp).then(response => {
        const { data } = response
        // Registro de movimientos
        registroMovimientosSaldosSocios(fichaSocioElegido, '0', dataa.prestamo, interesGenerado.toString(), '0', '0', '0', '0', 'Prestamo')

        registroDeudaSocioInicial(fichaSocioElegido, '0', interesGenerado, 'Prestamo', data.fecha)

        actualizacionDeudaSocio(fichaSocioElegido, '0', interesGenerado, 'Prestamo', data.fecha)

        setLoading(false)
        history({
          search: queryString.stringify(''),
        })
        setShowModal(false)

        Swal.fire({
          title: data.mensaje,
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
      }).catch(e => {
        console.log(e)
        setLoading(false)
      })
    }).catch(e => {
      console.log(e)
      setLoading(false)
    })
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
                            registroPrestamo(
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

            <Form.Group as={Col} controlId='formGridPrestamo'>
              <Form.Label>
                Cantidad del prestamo solicitado
              </Form.Label>

              <InputGroup className='mb-3'>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type='number'
                  min='0'
                  step='0.01'
                  placeholder='Escribe el monto del prestamo'
                  isInvalid={!!errors.prestamo}
                  {...register('prestamo', { required: 'El prestamo es obligatorio' })}
                />
                <InputGroup.Text>.00 MXN</InputGroup.Text>
                <Form.Control.Feedback type='invalid'>
                  {errors.prestamo?.message}
                </Form.Control.Feedback>
              </InputGroup>

            </Form.Group>

          </Row>

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridTasaInteres'>
              <Form.Label>
                Tasa Interes
              </Form.Label>
              <InputGroup className='mb-3'>
                <Form.Control
                  type='number'
                  min='0'
                  placeholder='Escribe la tasa de interes'
                  isInvalid={!!errors.tasaInteres}
                  {...register('tasaInteres', { required: 'La tasa de interes es obligatoria' })}
                />
                <InputGroup.Text>%</InputGroup.Text>
                <Form.Control.Feedback type='invalid'>
                  {errors.tasaInteres?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId='formTotalPagar'>

              <Form.Label>
                Debera pagar a la caja de ahorro
              </Form.Label>

              <InputGroup className='mb-3'>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  placeholder='Escribe el total a pagar'
                  name='totalpagar'
                  value={interesGenerado.toFixed(2)} // Formatting for display
                  disabled
                />
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

const hoy = new Date()

const fecha = [
  hoy.getFullYear(),
  String(hoy.getMonth() + 1).padStart(2, '0'),
  String(hoy.getDate()).padStart(2, '0'),
].join('-')

const hora = [
  String(hoy.getHours()).padStart(2, '0'),
  String(hoy.getMinutes()).padStart(2, '0'),
].join(':')

function initialFormData () {
  return {
    prestamo: '',
    fecha: `${fecha}T${hora}`
  }
}

export default RegistroPrestamos
