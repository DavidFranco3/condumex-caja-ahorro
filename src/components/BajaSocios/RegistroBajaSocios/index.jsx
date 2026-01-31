import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import queryString from 'query-string'
import { Button, Col, Form, Row, Spinner, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { obtenerFolioActualBajaSocios, registraBajaSocios } from '../../../api/bajaSocios'
import BusquedaSocios from '../../Socios/BusquedaSocios'
import BasicModal from '../../Modal/BasicModal'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import Swal from 'sweetalert2'
import { registroPatrimonioInicial } from '../../Patrimonio/RegistroBajaSocioPatrimonio'
import { registroRendimientoInicial } from '../../Rendimientos/RegistroBajaSocioRendimiento'
import { registroAportacionInicial } from '../../Aportaciones/RegistroBajaSocioAportacion'
import { actualizacionSaldosSocios } from '../../GestionAutomatica/Saldos/ActualizacionSaldos'
import { getPatrimonioBySocio } from '../../../api/patrimonio'
import { getRendimientosBySocio } from '../../../api/rendimientos'
import { getAportacionesBySocio } from '../../../api/aportaciones'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'

function RegistroBajaSocios(props) {
  const { setShowModal, history, periodoElegido } = props

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, [])

  // Para controlar el modal de busqueda de socios
  const [showModalBusqueda, setShowModalBusqueda] = useState(false)
  const [contentModalBusqueda, setContentModalBusqueda] = useState(null)
  const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null)

  // Para el modal de busqueda
  const busquedaSocios = (content) => {
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
      obtenerFolioActualBajaSocios().then(response => {
        const { data } = response
        const { folio } = data
        // console.log(folio)
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

  // Para almacenar el rendimiento, prestamo, patrimonio y total a entregar del socio elegido
  // Para almacenar el rendimiento, prestamo, patrimonio y total a entregar del socio elegido
  const [rendimientoSocioElegido, setRendimientoSocioElegido] = useState(0)
  const [aportacionSocioElegido, setAportacionSocioElegido] = useState(0)
  const [patrimonioSocioElegido, setPatrimonioSocioElegido] = useState(0)

  const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm({
    defaultValues: initialFormData()
  })

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
    // Realiza registro de la aportación
    obtenerFolioActualBajaSocios().then(response => {
      const { data: dataFolio } = response
      const { folio } = dataFolio

      const total = parseFloat(aportacionSocioElegido) + parseFloat(patrimonioSocioElegido) + parseFloat(rendimientoSocioElegido)
      // console.log(data)

      const dataTemp = {
        folio,
        fichaSocio: fichaSocioElegido,
        tipo: getRazonSocial(),
        periodo: getPeriodo(),
        aportacion: aportacionSocioElegido,
        patrimonio: patrimonioSocioElegido,
        rendimiento: rendimientoSocioElegido,
        total,
        createdAt: dataa.fecha,
      }

      registraBajaSocios(dataTemp).then(response => {
        const { data } = response
        const aportacion2 = (aportacionSocioElegido * parseInt('-1'))
        const patrimonio2 = (patrimonioSocioElegido * parseInt('-1'))
        const rendimiento2 = (rendimientoSocioElegido * parseInt('-1'))

        registroAportacionInicial(fichaSocioElegido, aportacion2, data.fecha)

        registroPatrimonioInicial(fichaSocioElegido, patrimonio2, data.fecha)

        registroRendimientoInicial(fichaSocioElegido, rendimiento2, data.fecha)

        actualizacionSaldosSocios(fichaSocioElegido, aportacionSocioElegido, patrimonioSocioElegido, rendimientoSocioElegido, folio, 'Baja Socio')

        registroMovimientosSaldosSocios(fichaSocioElegido, aportacionSocioElegido, '0', '0', patrimonioSocioElegido, rendimientoSocioElegido, '0', '0', 'Baja Socio')

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

  // Para la busqueda de saldos del socio y calculos de cuanto se debe de entregar
  useEffect(() => {
    if (fichaSocioElegido) {
      // Busqueda de saldos del socio
      try {
        // Búsqueda de los saldos del socio
        getPatrimonioBySocio(parseInt(fichaSocioElegido), periodoElegido).then(response => {
          const { data } = response
          // console.log(data)
          const { total } = data
          setPatrimonioSocioElegido(total)
        }).catch(e => {
          console.log(e)
        })
      } catch (e) {
        console.log(e)
      }

      try {
        // Búsqueda de los saldos del socio
        getRendimientosBySocio(parseInt(fichaSocioElegido), periodoElegido).then(response => {
          const { data } = response
          // console.log(data)
          const { total } = data
          setRendimientoSocioElegido(total)
        }).catch(e => {
          console.log(e)
        })
      } catch (e) {
        console.log(e)
      }

      try {
        // Búsqueda de los saldos del socio
        getAportacionesBySocio(parseInt(fichaSocioElegido), periodoElegido).then(response => {
          const { data } = response
          // console.log(data)
          const { total } = data
          setAportacionSocioElegido(total)
        }).catch(e => {
          console.log(e)
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [fichaSocioElegido])

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
            <Form.Group as={Col} controlId='formGridFolio'>
              <Form.Label>
                Folio
              </Form.Label>
              <Form.Control
                type='text'
                name='folio'
                defaultValue={folioActual}
                disabled
              />
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
                      <Form.Group as={Col} controlId='formGridNombre'>
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

                    {/* Saldos y total a entregar */}
                    <Row className='mb-3'>

                      {/* rendimiento */}
                      <Form.Group as={Col} controlId='formGridRendimiento'>
                        <Form.Label>
                          Interés
                        </Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type='number'
                            placeholder='Rendimiento'
                            name='rendimiento'
                            value={rendimientoSocioElegido}
                            disabled
                          />
                          <InputGroup.Text>.00 MXN</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {/* rendimiento */}
                      <Form.Group as={Col} controlId='formGridRendimiento'>
                        <Form.Label>
                          Aportaciones
                        </Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type='number'
                            placeholder='Aportacion'
                            name='aportacion'
                            value={aportacionSocioElegido}
                            disabled
                          />
                          <InputGroup.Text>.00 MXN</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                    </Row>

                    <Row className='mb-3'>
                      {
                        razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.' &&
                        (
                          <>
                            {/* Patrimonio */}
                            <Form.Group as={Col} controlId='formGridPatrimonio'>
                              <Form.Label>
                                Patrimonio
                              </Form.Label>
                              <InputGroup className='mb-3'>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                  type='number'
                                  placeholder='Patriminio'
                                  name='patrimonio'
                                  value={patrimonioSocioElegido}
                                  disabled
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                              </InputGroup>
                            </Form.Group>
                          </>
                        )
                      }

                      <Form.Group as={Col} controlId='formGridPatrimonio'>
                        <Form.Label>
                          Total a entregar
                        </Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type='number'
                            placeholder='Total a entregar'
                            name='totalEntregar'
                            value={(rendimientoSocioElegido + aportacionSocioElegido + patrimonioSocioElegido)}
                            disabled
                          />
                          <InputGroup.Text>.00 MXN</InputGroup.Text>
                        </InputGroup>
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
                            busquedaSocios(
                              <BusquedaSocios
                                setShowModal={setShowModalBusqueda}
                                setIdSocioElegido={setIdSocioElegido}
                                setFichaSocioElegido={setFichaSocioElegido}
                                setNombreSocioElegido={setNombreSocioElegido}
                                idSocioElegido={idSocioElegido}
                                fichaSocioElegido={fichaSocioElegido}
                                nombreSocioElegido={nombreSocioElegido}
                                setRendimientoSocioElegido={setRendimientoSocioElegido}
                                setPatrimonioSocioElegido={setPatrimonioSocioElegido}
                                setAportacionSocioElegido={setAportacionSocioElegido}
                                rendimientoSocioElegido={rendimientoSocioElegido}
                                patrimonioSocioElegido={patrimonioSocioElegido}
                                aportacionSocioElegido={aportacionSocioElegido}
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

          <Row>
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

function initialFormData() {
  return {
    fecha: `${fecha}T${hora}`
  }
}

export default RegistroBajaSocios
