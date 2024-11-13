import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import queryString from "query-string";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import { actualizaPrestamos } from '../../../api/prestamos';
import { actualizacionDeudaSocio } from "../../DeudaSocio/RegistroActualizacionDeudaSocio";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha);

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


    return date.toISOString().slice(0, 16);
};

const initialFormData = ({ id, folio, fichaSocio, prestamo, prestamoTotal, tasaInteres, fechaCreacion }) => (
    {
        id,
        folio,
        fichaSocio,
        prestamo,
        prestamoTotal,
        tasaInteres,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaPrestamos({ datos, setShowModal, history }) {

    const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);

    const [interesGenerado, setInteresGenerado] = useState(0);

    const calcularIntereses = () => {
        const prestamo = document.getElementById("prestamo").value;
        const tasaInteres = document.getElementById("tasaInteres").value;
        const tempInteres = parseFloat(tasaInteres) / 100;
        const tempInteresGenerado = parseFloat(prestamo) * tempInteres;
        const aPagar = parseFloat(prestamo) + tempInteresGenerado;
        setInteresGenerado(aPagar);
    }

    const handleCancel = () => setShowModal(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    }

    console.log(formData.createdAt)

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!formData.prestamo || !formData.createdAt || !formData.tasaInteres) {
            toast.error("Faltan datos");
            return;
        }

        setLoading(true);
        const total = interesGenerado - formData.prestamoTotal;
        const dataTemp = {
            fichaSocio: formData.fichaSocio,
            prestamo: formData.prestamo,
            prestamoTotal: interesGenerado,
            tasaInteres: formData.tasaInteres,
            createdAt: formData.createdAt
        }

        const response = await actualizaPrestamos(formData.id, dataTemp);
        const { status, data: { mensaje } } = response;

        registroMovimientosSaldosSocios(formData.fichaSocio, "0", "0", formData.prestamo, "0", "0", "0", "0", "Modificación Prestamo");

        actualizacionDeudaSocio(formData.fichaSocio, "0", total, "Modificación prestamo", formData.createdAt);

        if (status === 200) {
            toast.success(mensaje);
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
                <Form onChange=
                    {handleChange}>

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
                                Cantidad del prestamo solicitado
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Escribe el monto del prestamo"
                                    name="prestamo"
                                    id="prestamo"
                                    onChange={(e) => { calcularIntereses(e.target.value) }}
                                    defaultValue={formData.prestamo}
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridTasaInteres">
                            <Form.Label>
                                Tasa Interes
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Escribe la tasa de interes"
                                    name="tasaInteres"
                                    id="tasaInteres"
                                    onChange={(e) => { calcularIntereses(e.target.value) }}
                                    defaultValue={formData.tasaInteres}
                                />
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAportacion">

                            <Form.Label>
                                Debera pagar a la caja de ahorro
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    placeholder="Escribe el total a pagar"
                                    name="totalpagar"
                                    id="totalPagar"
                                    step="0.01"
                                    value={interesGenerado}
                                    onChange={(e) => { calcularAbono(e.target.value) }}
                                    disabled
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

export default ModificaPrestamos;
