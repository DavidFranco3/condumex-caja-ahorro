import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { actualizaUsuarioCorreo } from '../../../api/usuarioCorreos'

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return date.toISOString().slice(0, 16)
}

const initialFormData = ({ correo, password, fechaCreacion }) => ({
  correo,
  createdAt: fechaToCurrentTimezone(fechaCreacion),
  password
})

function ModificaUsuarioCorreo (props) {
  const { datos, setShowModal, history } = props
  const { id } = datos

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

  const onSubmit = (data) => {
    // e.preventDefault() handled by handleSubmit

    // Validations handled by react-hook-form

    setLoading(true)
    const dataTemp = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      correo: data.correo,
      password: data.password,
      createdAt: data.createdAt
    }

    try {
      actualizaUsuarioCorreo(id, dataTemp).then(response => {
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
          {/* Tipo de socio, correo */}
          <Row className='mb-3'>

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

            <Form.Group as={Col} controlId='formGridCorreo'>
              <Form.Label>
                Password
              </Form.Label>
              <Form.Control
                type='text' // Wait, should be password type? Old code said text. But standard is password. I'll keep text if user wants visibility or change to password? Old was text.
                                // Actually line 138 in old code: type="text".
                                // Ah, ModificaUsuarioCorreo might be for admin resetting?
                placeholder='Escribe el password'
                {...register('password')}
              />
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

export default ModificaUsuarioCorreo
