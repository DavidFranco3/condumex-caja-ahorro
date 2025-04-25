import { useState, useEffect } from 'react';
import {getTokenApi, isExpiredToken, logoutApi} from "../../../api/auth";
import Swal from "sweetalert2";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaParametros} from "../../../api/parametros";
import queryString from "query-string";

function EliminaAjusteParametros(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    // console.log(datos)
    const { id, tasaInteres, tasaRendimiento, fechaCreacion } = datos;

    // Controlar la animacion
    const [loading, setLoading] = useState(false);

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                Swal.fire({
                    title: "Sesion expirada",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1600,
                });
                Swal.fire({
                    title: "Sesion cerrada por seguridad",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1600,
                });
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        try {
            eliminaParametros(id).then(response => {
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
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminará del sistema la información de los intereses y rendimiento.
                    </p>
                </Alert>

                <Form onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Tasa de rendimiento
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="tasaRendimiento"
                                defaultValue={tasaRendimiento}
                                disabled
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
                                {!loading ? "Eliminar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarEliminacion()
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

export default EliminaAjusteParametros;
