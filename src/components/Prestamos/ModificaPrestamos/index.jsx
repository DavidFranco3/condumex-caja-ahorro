import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
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

    // const [formData, setFormData] = useState(initialFormData(datos));
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: initialFormData(datos)
    });

    const prestamoValue = watch("prestamo");
    const tasaInteresValue = watch("tasaInteres");

    // Calculate total dynamically
    let totalPagar = 0;
    if (prestamoValue && tasaInteresValue) {
        const tempInteres = parseFloat(tasaInteresValue) / 100;
        const tempInteresGenerado = parseFloat(prestamoValue) * tempInteres;
        totalPagar = parseFloat(prestamoValue) + tempInteresGenerado;
    }

    const handleCancel = () => setShowModal(false);

    // console.log(formData.createdAt)

    const handleUpdate = async (data) => {
        // event.preventDefault();

        // Validations handled by react-hook-form

        setLoading(true);
        // Recalculate based on current data
        const currentInteres = parseFloat(data.tasaInteres) / 100;
        const currentInteresGenerado = parseFloat(data.prestamo) * currentInteres;
        const currentTotal = parseFloat(data.prestamo) + currentInteresGenerado;

        const total = currentTotal - data.prestamoTotal; // I assume data.prestamoTotal is from initial data? No, it should be the old total? 
        // Wait, logic in original code: const total = interesGenerado - formData.prestamoTotal;
        // formData.prestamoTotal comes from initialFormData(datos), so it is the previous total.
        // So we need to access the original data or keep it. 'datos' prop is available.

        const oldTotal = datos.prestamoTotal;
        const diffTotal = currentTotal - oldTotal;

        const dataTemp = {
            fichaSocio: data.fichaSocio,
            prestamo: data.prestamo,
            prestamoTotal: currentTotal,
            tasaInteres: data.tasaInteres,
            createdAt: data.createdAt
        }

        const response = await actualizaPrestamos(data.id, dataTemp);
        const { status, data: { mensaje } } = response;

        registroMovimientosSaldosSocios(data.fichaSocio, "0", "0", data.prestamo, "0", "0", "0", "0", "Modificación Prestamo");

        actualizacionDeudaSocio(data.fichaSocio, "0", diffTotal, "Modificación prestamo", data.createdAt);

        if (status === 200) {
            history({
                search: queryString.stringify(''),
            });
            setShowModal(false);

            Swal.fire({
                title: mensaje,
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
                                Cantidad del prestamo solicitado
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="Escribe el monto del prestamo"
                                    id="prestamo"
                                    isInvalid={!!errors.prestamo}
                                    {...register("prestamo", { required: "El prestamo es obligatorio" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.prestamo?.message}
                                </Form.Control.Feedback>
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
                                    min="0"
                                    placeholder="Escribe la tasa de interes"
                                    id="tasaInteres"
                                    isInvalid={!!errors.tasaInteres}
                                    {...register("tasaInteres", { required: "La tasa es obligatoria" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.tasaInteres?.message}
                                </Form.Control.Feedback>
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
                                    value={totalPagar ? totalPagar.toFixed(2) : ""}
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
