import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { obtenerFichaActualSocioSindicalizado, registraSocioSindicalizado } from "../../../api/sociosSindicalizados";

function RegistroSociosSindicalizados(props) {
    const { setShowModal, history, location } = props;

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el numero actual de ficha
    const [noActualFicha, setNoActualFicha] = useState("");

    useEffect(() => {
        try {
            obtenerFichaActualSocioSindicalizado().then(response => {
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

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.ficha || !formData.nombre || !formData.tipo) {
            Swal.fire({
                title: "Completa el formulario",
                icon: "warning",
                showConfirmButton: false,
                timer: 1600,
            });
        } else {
            if (!isEmailValid(formData.correo)) {
                Swal.fire({
                    title: "Escriba un correo valido",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1600,
                });
            } else {
                setLoading(true)
                const dataTemp = {
                    ficha: formData.ficha,
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    correo: formData.correo,
                    createdAt: formData.fecha,
                    estado: "true"
                }
                try {
                    registraSocioSindicalizado(dataTemp).then(response => {
                        const { data } = response;
                        Swal.fire({
                            title: data.mensaje,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1600,
                        });
                        setLoading(false)
                        history({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
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
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Ficha
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la ficha"
                                name="ficha"
                                defaultValue={formData.ficha}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el nombre"
                                name="nombre"
                                defaultValue={formData.nombre}
                            />
                        </Form.Group>
                    </Row>
                    {/* Tipo de socio, correo */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Tipo de socio
                            </Form.Label>
                            <Form.Control as="select"
                                defaultValue={formData.tipo}
                                name="tipo"
                                disabled
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
                                name="correo"
                                defaultValue={formData.correo}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={formData.fecha}
                                placeholder="Fecha"
                                name="fecha"
                            />
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
        tipo: "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.",
        correo: "",
        fecha: `${fecha}T${hora}`
    }
}

export default RegistroSociosSindicalizados;
