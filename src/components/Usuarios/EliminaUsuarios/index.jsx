import { useState } from 'react'
import { Button, Col, Form, Row, Spinner, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { eliminaUsuario } from '../../../api/usuarios'

function EliminaUsuario (props) {
  const { datos, setShowModal, history } = props
  // console.log(datos)
  const { id, nombre, apellidos, correo } = datos

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  const cancelarEliminacion = () => {
    setShowModal(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      eliminaUsuario(id).then(response => {
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
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className='contenidoFormularioPrincipal'>

        <Alert variant='danger'>
          <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
          <p className='mensaje'>
            Esta acción eliminará del sistema la información del usuario.
          </p>
        </Alert>

        <Form onSubmit={onSubmit}>

          {/* Ficha, nombre */}
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFicha'>
              <Form.Label>
                Nombre
              </Form.Label>
              <Form.Control
                type='text'
                name='nombre'
                defaultValue={nombre + ' ' + apellidos}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridNombre'>
              <Form.Label>
                Correo
              </Form.Label>
              <Form.Control
                type='text'
                name='nombre'
                defaultValue={correo}
                disabled
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
                {!loading ? 'Eliminar' : <Spinner animation='border' />}
              </Button>
            </Col>
            <Col>
              <Button
                variant='danger'
                className='cancelar'
                onClick={() => {
                  cancelarEliminacion()
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

export default EliminaUsuario
