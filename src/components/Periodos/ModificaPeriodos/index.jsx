import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import queryString from "query-string";
import { actualizaPeriodos } from '../../../api/periodos';

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


  return date.toISOString().slice(0, 16);
}

const initialFormData = ({ id, folio, nombre, fechaInicio, fechaCierre, fechaCreacion }) => (
    {
        id,
        folio,
        nombre,
        fechaInicio,
        fechaCierre,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaPeriodos ({ datos, setShowModal, history }) {

    const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);


    const handleCancel = () => setShowModal(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    }

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!formData.nombre || !formData.fechaInicio || !formData.fechaCierre) {
            toast.error('Faltan datos');
            return;
        }

        setLoading(true);

        const response = await actualizaPeriodos(formData.id, formData);
        
        // Registra movimientos        
        const { status, data: { mensaje } } = response;

        setLoading(false);

        if (status === 200) {
            toast.success(mensaje);
            history({
                search: queryString.stringify(''),
            });
            setShowModal(false);
        } else {
            toast.error(mensaje);
        }
    };

    const Loading = () => (
        !loading ? 'Actualizar' : <Spinner animation='border' />
    )

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={handleChange} onSubmit={handleUpdate}>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="text"
                                value={formData.folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="text"
                                defaultValue={formData.nombre}
                                placeholder="Nombre"
                                name="nombre"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de incio
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="datetime-local"
                                defaultValue={formData.fechaInicio}
                                placeholder="Fecha de inicio"
                                name="fechaInicio"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de cierre
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="datetime-local"
                                defaultValue={formData.fechaCierre}
                                placeholder="Fecha de cierre"
                                name="fechaCierre"
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={Loading}
                            >
                                <Loading />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                disabled={Loading}
                                onClick={() => {
                                    handleCancel()
                                }}
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

export default ModificaPeriodos;
