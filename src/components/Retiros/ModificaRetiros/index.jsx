import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import queryString from "query-string";
import { actualizaRetiros } from '../../../api/retiros';
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

const initialFormData = ({ id, folio, fichaSocio, retiro, fechaCreacion }) => (
    {
        id,
        folio,
        fichaSocio,
        retiro,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaRetiros({ datos, setShowModal, history }) {

    const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);


    const handleCancel = () => setShowModal(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    }

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!formData.retiro || !formData.createdAt) {
            Swal.fire({
            title: "Faltan datos",
            icon: "error",
            showConfirmButton: false,
            timer: 1600,
        });
            return;
        }

        setLoading(true);

        const response = await actualizaRetiros(formData.id, formData);
        registroMovimientosSaldosSocios(formData.fichaSocio, "0", "0", "0", "0", "0", formData.retiro, "0", "Modificación retiro");

        const { status, data: { mensaje } } = response

        if (status === 200) {
            Swal.fire({
                title: mensaje,
                icon: "success",
                showConfirmButton: false,
                timer: 1600,
            });
            setTimeout(() => {
                history({
                    search: queryString.stringify(''),
                });
                setShowModal(false);
            }, 2000)
        } else {
            Swal.fire({
            title: mensaje,
            icon: "error",
            showConfirmButton: false,
            timer: 1600,
        });
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

                        <Form.Group as={Col} controlId="formGridRetiro">
                            <Form.Label>
                                Retiro
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Escribe el retiro"
                                    name="retiro"
                                    defaultValue={formData.retiro}
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

export default ModificaRetiros;
