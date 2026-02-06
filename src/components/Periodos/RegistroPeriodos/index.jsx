import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { obtenerFolioActualPeriodo, registraPeriodos } from '../../../api/periodos'
import Swal from 'sweetalert2'
import { getRazonSocial } from '../../../api/auth'
import queryString from 'query-string'

function RegistroPeriodos (props) {
  const { setShowModal, history } = props

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
      obtenerFolioActualPeriodo().then(response => {
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData()
  })

  const onSubmit = (dataa) => {
    setLoading(true)
    // Realiza registro de la aportación
    obtenerFolioActualPeriodo().then(response => {
      const { data: dataFolio } = response
      const { folio } = dataFolio
      // console.log(data)

      const dataTemp = {
        folio,
        nombre: dataa.nombre,
        tipo: getRazonSocial(),
        fechaInicio: dataa.fechaInicio,
        fechaCierre: dataa.fechaCierre,
      }

      registraPeriodos(dataTemp).then(response => {
        const { data } = response

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

  return (
    <>
      <div className='contenidoFormularioPrincipal'>
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFolio'>
              <Form.Label>
                Folio
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='text'
                value={folioActual}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridNombre'>
              <Form.Label>
                Nombre
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='text'
                placeholder='Nombre'
                isInvalid={!!errors.nombre}
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFechaInicio'>
              <Form.Label>
                Fecha de incio
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='datetime-local'
                placeholder='Fecha de inicio'
                isInvalid={!!errors.fechaInicio}
                {...register('fechaInicio', { required: 'La fecha de inicio es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.fechaInicio?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId='formGridFechaCierre'>
              <Form.Label>
                Fecha de cierre
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='datetime-local'
                placeholder='Fecha de cierre'
                isInvalid={!!errors.fechaCierre}
                {...register('fechaCierre', { required: 'La fecha de cierre es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.fechaCierre?.message}
              </Form.Control.Feedback>
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
    </>
  )
}

function initialFormData () {
  return {
    nombre: '',
    fechaInicio: '',
    fechaCierre: ''
  }
}

export default RegistroPeriodos
