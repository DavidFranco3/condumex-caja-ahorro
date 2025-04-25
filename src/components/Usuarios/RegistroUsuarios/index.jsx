import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { registraUsuarios } from "../../../api/usuarios";

function RegistroUsuarios(props) {
    const { setShowModal, history, location } = props;

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate() : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const hora = hoy.getHours() < 10 ? "0" + hoy.getHours() + ':' + hoy.getMinutes() : hoy.getMinutes() < 10 ? hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() < 10 && hoy.getMinutes() < 10 ? "0" + hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() + ':' + hoy.getMinutes();

    const [fechaActual, setFechaActual] = useState(fecha + "T" + hora);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.nombre || !formData.correo) {
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
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    correo: formData.correo,
                    telefonoCelular: formData.telefonoCelular,
                    password: formData.password,
                    createdAt: formData.fecha == "" ? fechaActual : formData.fecha,
                    estado: "true"
                }

                try {
                    registraUsuarios(dataTemp).then(response => {
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
                        <Form.Group as={Col} controlId="formGridApellidos">
                            <Form.Label>
                                Apellidos
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el apellidos"
                                name="apellidos"
                                defaultValue={formData.apellidos}
                            />
                        </Form.Group>
                    </Row>
                    {/* Tipo de socio, correo */}
                    <Row className="mb-3">
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
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Escribe el password"
                                name="password"
                                defaultValue={formData.password}
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
                                defaultValue={formData.fecha == "" ? fechaActual : formData.fecha}
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

function initialFormData() {
    return {
        nombre: "",
        apellidos: "",
        correo: "",
        fecha: "",
    }

}

export default RegistroUsuarios;
