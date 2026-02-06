import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { actualizaSocioSindicalizado } from '../../../api/sociosSindicalizados'

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return date.toISOString().slice(0, 16)
}

const initialFormData = ({ nombre, tipo, correo, ficha, fechaCreacion }) => ({
  nombre,
  tipo,
  correo,
  ficha,
  createdAt: fechaToCurrentTimezone(fechaCreacion),
})

function ModificaSociosSindicalizados (props) {
  const { datos, setShowModal, history } = props
  const { id, ficha } = datos

  const cancelarModificacion = () => {
    setShowModal(false)
  }

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  // Para almacenar la información
  // const [formData, setFormData] = useState(initialFormData(datos));

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData(datos)
  })

  const onSubmit = (dataa) => {
    // Validation logic can be simplified as we use register with rules

    setLoading(true)
    const dataTemp = {
      ficha: dataa.ficha,
      nombre: dataa.nombre,
      tipo: dataa.tipo,
      correo: dataa.correo,
    }

    try {
      actualizaSocioSindicalizado(id, dataTemp).then(response => {
        const { data } = response
        Swal.fire({
          title: data.mensaje,
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
        setLoading(false)
        history({
          search: queryString.stringify(''),
        })
        setShowModal(false)
      }).catch(e => {
        console.log(e)
        if (e.message === 'Network Error') {
          // console.log("No hay internet")
          Swal.fire({
            title: 'Conexión al servidor no disponible',
            icon: 'error',
            showConfirmButton: false,
            timer: 1600,
          })
          setLoading(false)
        } else {
          if (e.response && e.response.status === 401) {
            const { mensaje } = e.response.data
            Swal.fire({
              title: mensaje,
              icon: 'error',
              showConfirmButton: false,
              timer: 1600,
            })
            setLoading(false)
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className='contenidoFormularioPrincipal'>
        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* Ficha, nombre */}
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFicha'>
              <Form.Label>
                Ficha
              </Form.Label>
              <Form.Control
                type='text'
                defaultValue={ficha} // Keep defaultValue or use react-hook-form value if watched, but here it's static initial
                readOnly
                {...register('ficha')}
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridNombre'>
              <Form.Label>
                Nombre
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Escribe el nombre'
                isInvalid={!!errors.nombre}
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Tipo de socio, correo */}
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFicha'>
              <Form.Label>
                Tipo de socio
              </Form.Label>
              <Form.Control
                as='select'
                disabled
                {...register('tipo')}
              >
                <option>Elige una opción</option>
                <option value='Asociación de Empleados Sector Cables A.C.'>Empleado</option>
                <option value='Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'>Sindicalizado</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId='formGridCorreo'>
              <Form.Label>
                Correo
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Escribe el correo'
                isInvalid={!!errors.correo}
                {...register('correo', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Dirección de correo inválida'
                  }
                })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.correo?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFechaRegistro'>
              <Form.Label>
                Fecha de registro
              </Form.Label>
              <Form.Control
                type='datetime-local'
                placeholder='Fecha'
                isInvalid={!!errors.createdAt}
                {...register('createdAt', { required: 'La fecha es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.createdAt?.message}
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
                {!loading ? 'Actualizar' : <Spinner animation='border' />}
              </Button>
            </Col>
            <Col>
              <Button
                variant='danger'
                className='cancelar'
                onClick={() => {
                  cancelarModificacion()
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

export default ModificaSociosSindicalizados
