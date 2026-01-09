import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { obtenerFichaActualSociosEmpleados, registraSociosEmpleados } from "../../../api/sociosEmpleados";

function RegistroSociosEmpleados(props) {
    const { setShowModal, history, location } = props;

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el numero actual de ficha
    const [noActualFicha, setNoActualFicha] = useState("");

    useEffect(() => {
        try {
            obtenerFichaActualSociosEmpleados().then(response => {
                const { data } = response;
                const { ficha } = data;
                setNoActualFicha(ficha)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialFormData()
    });

    const onSubmit = (data) => {
        setLoading(true)
        const dataTemp = {
            ficha: data.ficha,
            nombre: data.nombre,
            tipo: data.tipo,
            correo: data.correo,
            createdAt: data.fecha,
            estado: "true"
        }

        try {
            registraSociosEmpleados(dataTemp).then(response => {
                const { data } = response;
                setLoading(false)
                history({
                    search: queryString.stringify(""),
                });
                setShowModal(false)
                Swal.fire({
                    title: data.mensaje,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1600,
                });
            }).catch(e => {
                console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    Swal.fire({
                        title: "Conexión al servidor no disponible",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    setLoading(false);
                } else {
                    if (e.response && e.response.status === 401) {
                        const { mensaje } = e.response.data;
                        Swal.fire({
                            title: mensaje,
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1600,
                        });;
                        setLoading(false);
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Ficha
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la ficha"
                                isInvalid={!!errors.ficha}
                                {...register("ficha", { required: "La ficha es obligatoria" })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.ficha?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el nombre"
                                isInvalid={!!errors.nombre}
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nombre?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {/* Tipo de socio, correo */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Tipo de socio
                            </Form.Label>
                            <Form.Control as="select"
                                disabled
                                {...register("tipo")}
                            >
                                <option>Elige una opción</option>
                                <option value="Asociación de Empleados Sector Cables A.C.">Empleado</option>
                                <option value="Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.">Sindicalizado</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCorreo">
                            <Form.Label>
                                Correo
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el correo"
                                isInvalid={!!errors.correo}
                                {...register("correo", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Dirección de correo inválida"
                                    }
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.correo?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                placeholder="Fecha"
                                isInvalid={!!errors.fecha}
                                {...register("fecha", { required: "La fecha es obligatoria" })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fecha?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Registrar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarRegistro()
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

const hoy = new Date();

const fecha = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
].join("-");

const hora = [
    String(hoy.getHours()).padStart(2, "0"),
    String(hoy.getMinutes()).padStart(2, "0"),
].join(":");

function initialFormData() {
    return {
        ficha: "",
        nombre: "",
        tipo: "Asociación de Empleados Sector Cables A.C.",
        correo: "",
        fecha: `${fecha}T${hora}`,
    }
}

export default RegistroSociosEmpleados;
