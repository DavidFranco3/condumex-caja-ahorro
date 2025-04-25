import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import queryString from "query-string";
import { actualizaAbonos } from '../../../api/abonos';
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


  return date.toISOString().slice(0, 16);
}

const initialFormData = ({ id, folio, fichaSocio, abono, fechaCreacion }) => (
    {
        id,
        folio,
        fichaSocio,
        abono,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaAbonos ({ datos, setShowModal, history }) {

    const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);


    const handleCancel = () => setShowModal(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    }

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!formData.createdAt || !formData.abono) {
            Swal.fire({
            title: "Faltan datos",
            icon: "error",
            showConfirmButton: false,
            timer: 1600,
        });
            return;
        }

        setLoading(true);

        const response = await actualizaAbonos(formData.id, formData);
        
        // Registra movimientos
        registroMovimientosSaldosSocios(formData.fichaSocio, "0", "0", "0", "0", "0", "0", formData.abono, "Modificación abono")
        
        const { status, data: { mensaje } } = response;

        setLoading(false);

        if (status === 200) {
            Swal.fire({
                        title: mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
            history({
                search: queryString.stringify(''),
            });
            setShowModal(false);
        } else {
             Swal.fire({
                        title: mensaje,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1600,
                    });;
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

                        <Form.Group as={Col} controlId="formGridAbono">
                            <Form.Label>
                                Aportación
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step=".0.01"
                                    placeholder="Escribe el abono"
                                    name="abono"
                                    defaultValue={formData.abono}
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

export default ModificaAbonos;
