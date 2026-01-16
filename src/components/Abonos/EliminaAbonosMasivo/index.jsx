import { useState, useEffect } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { eliminaAbonosMasivo } from '../../../api/abonos'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { actualizacionDeudaSocio } from '../../DeudaSocio/RegistroActualizacionDeudaSocio'
import { getRazonSocial } from '../../../api/auth'

function EliminaAbonosMasivo (props) {
  const [formData, setFormData] = useState(initialFormData())

  const { listaFichas, listaAbonos2, listaFechas, history, setShowModal } = props
  // console.log(datos)
  const cancelarEliminacion = () => {
    setShowModal(false)
  }

  // Para controlar la animacion
  const [loading, setLoading] = useState(false)

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    if (!formData.fecha) {
      Swal.fire({
        title: 'Por favor selecciona una fecha',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
      return
    }

    setLoading(true)

    try {
      eliminaAbonosMasivo(formData.fecha, razonSocialElegida).then(response => {
        for (let i = 0; i < listaFechas.length; i++) {
          if (formData.fecha === listaFechas[i]) {
            actualizacionDeudaSocio(parseInt(listaFichas[i]), parseFloat(listaAbonos2[i]), '0', 'Eliminación abono', formData.fecha)
          }
        }

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

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className='contenidoFormularioPrincipal'>

        <Alert variant='danger'>
          <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
          <p className='mensaje'>
            Esta acción eliminará del sistema los abonos de los socios.
          </p>
        </Alert>

        <Form onChange={onChange} onSubmit={onSubmit}>

          <Form.Group as={Row} controlId='formGridAbonos'>
            <Col sm={4}>
              <Form.Label>Selecciona una fecha:</Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                className='mb-3'
                type='date'
                defaultValue={formData.fecha}
                placeholder='Fecha'
                name='fecha'
              />
            </Col>
          </Form.Group>

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

function initialFormData () {
  return {
    createdAt: ''
  }
}

export default EliminaAbonosMasivo
