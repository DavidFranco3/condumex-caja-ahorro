import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import { getTotalGeneralByRazon } from '../../../api/rendimientos'

const RegistroMonto = ({ setShowModal, onRepartir, razon }) => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm()
  const earningsValue = watch('utilidad')
  const earningsDateValue = watch('fecha')

  const [totalGeneral, setTotalGeneral] = useState(0)
  const [rendimiento, setRendimiento] = useState(0)

  const getGeneral = async (fecha, razonSocial, periodo) => {
    const response = await getTotalGeneralByRazon(fecha, razonSocial, periodo)

    const [result] = response.data.data

    const { total } = result

    setTotalGeneral(Number(total.$numberDecimal))
    localStorage.setItem('totalGeneral', totalGeneral)
  }

  useEffect(() => {
    if (totalGeneral && earningsDateValue) {
      setRendimiento(Number(earningsValue) / totalGeneral)
    }
  }, [totalGeneral, earningsValue])

  useEffect(() => {
    if (earningsDateValue) {
      // set to local storage
      localStorage.setItem('earningsDate', earningsDateValue)
      getGeneral(earningsDateValue, getRazonSocial(), getPeriodo())
    }
  }, [earningsDateValue, getGeneral])

  useEffect(() => {
    if (earningsValue) {
      // set to local storage
      localStorage.setItem('earnings', earningsValue)
    }
  }, [earningsValue])

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <div className='contenidoFormularioPrincipal'>
      <Form>
        <Row className='mb-3'>
          <Form.Group as={Col} controlId='formGridRazonSocial'>
            <Form.Label>Razon social</Form.Label>
            <Form.Control
              type='text'
              placeholder='Razon social'
              name='razonSocial'
              value={razon}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className='mb-3'>
          <Form.Group as={Col} controlId='formGridUtilidad'>
            <Form.Label>Utilidad</Form.Label>
            <Form.Control
              placeholder='1000'
              type='number'
              step='.01'
              isInvalid={!!errors.utilidad}
              {...register('utilidad', { required: 'La utilidad es obligatoria' })}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.utilidad?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId='formGridTotalGeneral'>
            <Form.Label>Total general</Form.Label>
            <Form.Control
              placeholder='100000'
              type='text'
              value={totalGeneral.toFixed(2)}
              disabled
            />
          </Form.Group>
        </Row>

        <Row className='mb-3'>
          <Form.Group as={Col} controlId='formGridInteres'>
            <Form.Label>Interes</Form.Label>
            <Form.Control
              placeholder='100000'
              type='text'
              value={rendimiento}
              disabled
            />
          </Form.Group>

          <Form.Group as={Col} controlId='formGridFechaRegistro'>
            <Form.Label>Fecha de registro:</Form.Label>
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
              type='button'
              variant='success'
              className='registrar'
              onClick={handleSubmit(onRepartir)}
            >
              Repartir
            </Button>
          </Col>
          <Col>
            <Button
              variant='danger'
              className='cancelar'
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}

export default RegistroMonto
