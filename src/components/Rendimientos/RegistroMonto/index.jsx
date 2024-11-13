import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import useField from '../../../hooks/useField'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import { getTotalGeneralByRazon } from '../../../api/rendimientos'

const RegistroMonto = ({ setShowModal, onRepartir, razon }) => {
  const earnings = useField({ type: 'number', step: '.01' })
  const earningsDate = useField({ type: 'datetime-local' })
  const [totalGeneral, setTotalGeneral] = useState(0)
  const [rendimiento, setRendimiento] = useState(0)

  const getGeneral = async (fecha, razonSocial, periodo) => {
    const response = await getTotalGeneralByRazon(fecha, razonSocial, periodo);

    const [result] = response.data.data;

    const { total } = result;

    setTotalGeneral(Number(total.$numberDecimal));
    localStorage.setItem('totalGeneral', totalGeneral);
  }

  useEffect(() => {
    if (totalGeneral && earningsDate.value) {
      setRendimiento(Number(earnings.value) / totalGeneral);
    }
  }, [totalGeneral, earnings.value])

  useEffect(() => {
    if (earningsDate.value) {
      // set to local storage
      localStorage.setItem('earningsDate', earningsDate.value)
      getGeneral(earningsDate.value, getRazonSocial(), getPeriodo())
    }
  }, [earningsDate.value, getGeneral])

  useEffect(() => {
    if (earnings.value) {
      // set to local storage
      localStorage.setItem('earnings', earnings.value)
    }
  }, [earnings.value])

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <div className="contenidoFormularioPrincipal">
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridRazonSocial">
            <Form.Label>Razon social</Form.Label>
            <Form.Control
              type="text"
              placeholder="Razon social"
              name="razonSocial"
              value={razon}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridUtilidad">
            <Form.Label>Utilidad</Form.Label>
            <Form.Control placeholder="1000" {...earnings} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridTotalGeneral">
            <Form.Label>Total general</Form.Label>
            <Form.Control
              placeholder="100000"
              type="text"
              value={totalGeneral.toFixed(2)}
              disabled
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridInteres">
            <Form.Label>Interes</Form.Label>
            <Form.Control
              placeholder="100000"
              type="text"
              value={rendimiento}
              disabled
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridFechaRegistro">
            <Form.Label>Fecha de registro:</Form.Label>
            <Form.Control {...earningsDate} placeholder="Fecha" name="fecha" />
          </Form.Group>
        </Row>

        <Form.Group as={Row} className="botones">
          <Col>
            <Button
              type="button"
              variant="success"
              className="registrar"
              onClick={onRepartir}
              disabled={earnings.value === '' || earningsDate.value === ''}
            >
              Repartir
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              className="cancelar"
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

