import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { actualizaPeriodos } from '../../../api/periodos'

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return date.toISOString().slice(0, 16)
}

const initialFormData = ({ id, folio, nombre, fechaInicio, fechaCierre, fechaCreacion }) => (
  {
    id,
    folio,
    nombre,
    fechaInicio,
    fechaCierre,
    createdAt: fechaToCurrentTimezone(fechaCreacion),
  }
)

function ModificaPeriodos ({ datos, setShowModal, history }) {
  // const [formData, setFormData] = useState(initialFormData(datos));
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData(datos)
  })

  const handleCancel = () => setShowModal(false)

  const handleUpdate = async (data) => {
    // event.preventDefault();

    // Validations handled by react-hook-form

    setLoading(true)

    const response = await actualizaPeriodos(data.id, data)

    // Registra movimientos
    const { status, data: { mensaje } } = response

    setLoading(false)

    if (status === 200) {
      Swal.fire({
        title: mensaje,
        icon: 'success',
        showConfirmButton: false,
        timer: 1600,
      })
      history({
        search: queryString.stringify(''),
      })
      setShowModal(false)
    } else {
      Swal.fire({
        title: mensaje,
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
    }
  }

  const Loading = () => (
    !loading ? 'Actualizar' : <Spinner animation='border' />
  )

  return (
    <>
      <div className='contenidoFormularioPrincipal'>
        <Form onSubmit={handleSubmit(handleUpdate)}>

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFechaRegistro'>
              <Form.Label>
                Folio
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='text'
                defaultValue={datos.folio}
                disabled
                {...register('folio')}
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridFechaRegistro'>
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
            <Form.Group as={Col} controlId='formGridFechaRegistro'>
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

            <Form.Group as={Col} controlId='formGridFechaRegistro'>
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
                disabled={Loading}
              >
                <Loading />
              </Button>
            </Col>
            <Col>
              <Button
                variant='danger'
                className='cancelar'
                disabled={Loading}
                onClick={() => {
                  handleCancel()
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

export default ModificaPeriodos
