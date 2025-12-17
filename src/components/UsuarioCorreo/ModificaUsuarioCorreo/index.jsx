import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { actualizaUsuarioCorreo } from "../../../api/usuarioCorreos";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

const initialFormData = ({correo, password, fechaCreacion }) => ({
    correo,
    createdAt: fechaToCurrentTimezone(fechaCreacion),
    password
});

function ModificaUsuarioCorreo(props) {
    const { datos, setShowModal, history, location } = props;
    const { id } = datos;

    const cancelarModificacion = () => {
        setShowModal(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para almacenar la información
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.correo) {
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
                    password: formData.password,
                    createdAt: formData.createdAt
                }

                try {
                    actualizaUsuarioCorreo(id, dataTemp).then(response => {
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
                                defaultValue={formData.correo !== "No especificado" ? formData.correo : ""}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCorreo">
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el password"
                                name="password"
                                defaultValue={formData.password}
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
                                {!loading ? "Actualizar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarModificacion()
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

export default ModificaUsuarioCorreo;
