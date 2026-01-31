import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { registraUsuarios } from '../../../api/usuarios'

function RegistroUsuarios(props) {
  const { setShowModal, history } = props

  const cancelarRegistro = () => {
    setShowModal(false)
  }

  // Para controlar la animación
  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData()
  })

  const onSubmit = (dataa) => {
    setLoading(true)
    const dataTemp = {
      nombre: dataa.nombre,
      apellidos: dataa.apellidos,
      correo: dataa.correo,
      telefonoCelular: dataa.telefonoCelular,
      password: dataa.password,
      createdAt: dataa.fecha,
      estado: 'true'
    }

    try {
      registraUsuarios(dataTemp).then(response => {
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

          {/* Ficha, nombre */}
          <Row className='mb-3'>
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
            <Form.Group as={Col} controlId='formGridApellidos'>
              <Form.Label>
                Apellidos
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Escribe el apellidos'
                isInvalid={!!errors.apellidos}
                {...register('apellidos', { required: 'El apellido es obligatorio' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.apellidos?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
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
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Basic email regex
                    message: 'Correo no válido'
                  }
                })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.correo?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId='formGridPassword'>
              <Form.Label>
                Password
              </Form.Label>
              <Form.Control
                type='password'
                placeholder='Escribe el password'
                isInvalid={!!errors.password}
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.password?.message}
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
                isInvalid={!!errors.fecha}
                {...register('fecha', { required: 'La fecha es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.fecha?.message}
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
    nombre: '',
    apellidos: '',
    correo: '',
    fecha: `${fecha}T${hora}`,
  }
}

export default RegistroUsuarios
