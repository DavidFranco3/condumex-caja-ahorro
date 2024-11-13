import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { obtenerFolioActualPeriodo, registraPeriodos } from "../../../api/periodos";
import { toast } from "react-toastify";
import { getRazonSocial } from "../../../api/auth";
import queryString from "query-string";

function RegistroPeriodos(props) {
    const { setShowModal, location, history } = props;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualPeriodo().then(response => {
                const { data } = response;
                // console.log(data)
                const { folio } = data;
                setFolioActual(folio)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el id, ficha y nombre del socio elegido
    const [idSocioElegido, setIdSocioElegido] = useState("");
    const [fichaSocioElegido, setFichaSocioElegido] = useState("");
    const [nombreSocioElegido, setNombreSocioElegido] = useState("");

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const hoy = new Date();

    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate() : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const hora = hoy.getHours() < 10 ? "0" + hoy.getHours() + ':' + hoy.getMinutes() : hoy.getMinutes() < 10 ? hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() < 10 && hoy.getMinutes() < 10 ? "0" + hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() + ':' + hoy.getMinutes();

    const [fechaActual, setFechaActual] = useState(fecha + "T" + hora);

    const onSubmit = (e) => {
        e.preventDefault()

            if (!formData.nombre || !formData.fechaInicio || !formData.fechaCierre) {
                toast.warning("Faltan datos")
            } else {

                setLoading(true)
                // Realiza registro de la aportación
                obtenerFolioActualPeriodo().then(response => {
                    const { data } = response;
                    const { folio } = data;
                    // console.log(data)

                    const dataTemp = {
                        folio: folio,
                        nombre: formData.nombre,
                        tipo: getRazonSocial(),
                        fechaInicio: formData.fechaInicio,
                        fechaCierre: formData.fechaCierre,
                    }

                    registraPeriodos(dataTemp).then(response => {
                        const { data } = response;

                        toast.success(data.mensaje);
                        setTimeout(() => {
                            setLoading(false)
                            history({
                                search: queryString.stringify(""),
                            });
                            setShowModal(false)
                        }, 2000)

                    }).catch(e => {
                        console.log(e)
                    })

                }).catch(e => {
                    console.log(e)
                })

            }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="text"
                                value={folioActual}
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
        fechaInicio: "",
        fechaCierre: ""
    }

}

export default RegistroPeriodos;
