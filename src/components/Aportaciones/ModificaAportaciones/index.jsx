import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import queryString from "query-string";
import { actualizaAportaciones } from '../../../api/aportaciones';
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

const initialFormData = ({ id, folio, fichaSocio, aportacion, fechaCreacion }) => (
    {
        id,
        folio,
        fichaSocio,
        aportacion,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
    }
)

function ModificaAportaciones({ datos, setShowModal, history }) {

    // const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialFormData(datos)
    });

    const handleCancel = () => setShowModal(false);

    const handleUpdate = async (data) => {
        // event.preventDefault();

        // Validations handled by react-hook-form

        setLoading(true);

        const response = await actualizaAportaciones(data.id, data);
        registroMovimientosSaldosSocios(parseInt(data.fichaSocio), data.aportacion, "0", "0", "0", "0", "0", "0", "Modificacion aportación")

        // Registra Saldos
        registroSaldoInicial(parseInt(data.fichaSocio), data.aportacion, "0", "0", data.folio, "Modificacion aportación")

        const { status, data: { mensaje } } = response
        console.log(status)
        console.log(mensaje)
        if (status === 200) {
            history({
                search: queryString.stringify(''),
            });
            setShowModal(false);

            Swal.fire({
                title: "Actualizado correctamente",
                icon: "success",
                showConfirmButton: false,
                timer: 1600,
            });
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
                <Form onSubmit={handleSubmit(handleUpdate)}>

                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Folio"
                                name="folio"
                                defaultValue={datos.folio}
                                disabled
                                {...register("folio")}
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
                                defaultValue={datos.fichaSocio}
                                disabled
                                {...register("fichaSocio")}
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
                                    placeholder="Fecha"
                                    isInvalid={!!errors.createdAt}
                                    {...register("createdAt", { required: "La fecha es obligatoria" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.createdAt?.message}
                                </Form.Control.Feedback>
                            </InputGroup>

                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAportacion">
                            <Form.Label>
                                Aportación
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step=".0.01"
                                    placeholder="Escribe la aportación"
                                    isInvalid={!!errors.aportacion}
                                    {...register("aportacion", { required: "La aportación es obligatoria" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.aportacion?.message}
                                </Form.Control.Feedback>
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

export default ModificaAportaciones;
