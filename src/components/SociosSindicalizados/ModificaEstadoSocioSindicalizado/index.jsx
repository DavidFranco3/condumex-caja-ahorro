import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import queryString from "query-string";
import {cambiaEstadoSocioSindicalizado} from "../../../api/sociosSindicalizados";

function ModificaEstadoSocioSindicalizado(props) {
    const { datos, setShowModal, history, location } = props;
    const { id, ficha, nombre, tipo, correo, estado } = datos;

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const cancelarModificacionEstado = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        const dataTemp = {
            estado: estado === "Activo" ? "false" : "true"
        }

        try {
            cambiaEstadoSocioSindicalizado(id, dataTemp).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
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
                <Form onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Ficha
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="ficha"
                                defaultValue={ficha}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                defaultValue={nombre}
                                disabled
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
                                          defaultValue={tipo}
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
                                name="correo"
                                defaultValue={correo}
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
                                {!loading ? "Actualizar estado" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarModificacionEstado()
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

export default ModificaEstadoSocioSindicalizado;
