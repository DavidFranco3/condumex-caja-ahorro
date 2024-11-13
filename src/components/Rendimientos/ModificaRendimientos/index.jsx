import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import queryString from "query-string";
import { actualizaRendimientos } from '../../../api/rendimientos';
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";
import {registroSaldoInicial} from "../../GestionAutomatica/Saldos/Saldos";
import {actualizacionSaldosSocios} from "../../GestionAutomatica/Saldos/ActualizacionSaldos";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


  return date.toISOString().slice(0, 16);
}

const initialFormData = ({ id, folio, fichaSocio, rendimiento, fechaCreacion }) => (
    {
        id,
        folio,
        fichaSocio,
        rendimiento,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaRendimientos ({ datos, setShowModal, history }) {

    const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);


    const handleCancel = () => setShowModal(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    }

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!formData.rendimiento || !formData.createdAt) {
            toast.error('Faltan datos');
            return;
        }

        setLoading(true);

        const response = await actualizaRendimientos(formData.id, formData);
        const { status, data: { mensaje } } = response
        registroMovimientosSaldosSocios(formData.fichaSocio, "0", "0", "0", "0", formData.rendimiento, "0", "0", "Modificación interés")
        
        // Registra Saldos
        registroSaldoInicial(formData.fichaSocio, "0", "0", formData.rendimiento, formData.folio, "Modificación interés")
        
        actualizacionSaldosSocios(formData.fichaSocio, "0", "0", formData.rendimiento, formData.folio, "Modificación interés")

        if (status === 200) {
            toast.success(mensaje)
            setTimeout(() => {
            history({
                search: queryString.stringify(''),
            });
            setShowModal(false);
        }, 2000);
        } else {
            toast.error(mensaje);
        }
    };

    const Loading = () => (
        !loading ? 'Actualizar' : <Spinner animation='border' />
    )

    return (
        <>
            <div className='contenidoFormularioPrincipal'>
                <Form onChange={handleChange}>

                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Folio"
                                name="folio"
                                defaultValue={formData.folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Ficha
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ficha del socio"
                                name="fichaSocio"
                                defaultValue={formData.fichaSocio}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">

                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <Form.Control
                                className="mb-3"
                                type="datetime-local"
                                defaultValue={formData.createdAt}
                                placeholder="Fecha"
                                name="createdAt"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAportacion">
                            <Form.Label>
                                Rendimiento
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Rendimiento"
                                    name="rendimiento"
                                    defaultValue={formData.rendimiento}
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                            </InputGroup>

                        </Form.Group>
                    </Row>
                    <Form.Group as={Row} className='botones'>
                        <Col>
                            <Button
                                type='submit'
                                variant='success'
                                className='registrar'
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                <Loading />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant='danger'
                                className='cancelar'
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
}

export default ModificaRendimientos;
