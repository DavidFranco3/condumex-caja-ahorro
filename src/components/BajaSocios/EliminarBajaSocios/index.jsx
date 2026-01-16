import { useState, useEffect } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { eliminaBajaSocios } from '../../../api/bajaSocios'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { getRazonSocial } from '../../../api/auth'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'
import { actualizacionSaldosSocios } from '../../GestionAutomatica/Saldos/ActualizacionSaldos'

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return date.toISOString().slice(0, 16)
}

function EliminaBajaSocios (props) {
  const { datos, history, setShowModal } = props
  // console.log(datos)
  const { id, folio, fichaSocio, aportacion, patrimonio, rendimiento, fechaCreacion } = datos

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, [])

  const cancelarEliminacion = () => {
    setShowModal(false)
  }

  // Para controlar la animacion
  const [loading, setLoading] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      eliminaBajaSocios(id).then(response => {
        const { data } = response
        setLoading(false)
        history({
          search: queryString.stringify(''),
        })
        setShowModal(false)

        registroMovimientosSaldosSocios(fichaSocio, aportacion, '0', '0', patrimonio, rendimiento, '0', '0', 'Eliminación Baja Socio')

        actualizacionSaldosSocios(fichaSocio, aportacion, patrimonio, rendimiento, folio, 'Eliminación Baja Socio')

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
            Esta acción eliminará del sistema la baja del socio.
          </p>
        </Alert>

        <Form onSubmit={onSubmit}>

          {/* Ficha, nombre */}
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridFolio'>
              <Form.Label>
                Folio
              </Form.Label>
              <Form.Control
                type='text'
                name='folio'
                defaultValue={folio}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridFichaSocio'>
              <Form.Label>
                Ficha del socio
              </Form.Label>
              <Form.Control
                type='text'
                name='fichaSocio'
                defaultValue={fichaSocio}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridAportacion'>
              <Form.Label>
                Aportación
              </Form.Label>
              <Form.Control
                type='text'
                name='aportacion'
                defaultValue={aportacion}
                disabled
              />
            </Form.Group>
          </Row>

          <Row>
            {
              razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.' &&
              (
                <>
                  <Form.Group as={Col} controlId='formGridPatrimonio'>
                    <Form.Label>
                      Patrimonio
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='patrimonio'
                      defaultValue={patrimonio}
                      disabled
                    />
                  </Form.Group>
                </>
              )
            }

            <Form.Group as={Col} controlId='formGridRendimiento'>
              <Form.Label>
                Interés
              </Form.Label>
              <Form.Control
                type='text'
                name='rendimiento'
                defaultValue={rendimiento}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridFecha'>
              <Form.Label>
                Fecha de registro
              </Form.Label>
              <Form.Control
                className='mb-3'
                type='datetime-local'
                defaultValue={fechaToCurrentTimezone(fechaCreacion)}
                placeholder='Fecha'
                name='createdAt'
                disabled
              />
            </Form.Group>
          </Row>

          <br />

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

export default EliminaBajaSocios
