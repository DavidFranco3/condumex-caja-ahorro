import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import Swal from "sweetalert2";
import queryString from "query-string";
import {eliminaSocioEmpleado} from "../../../api/sociosEmpleados";
import {eliminaSocioSindicalizado} from "../../../api/sociosSindicalizados";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaSocioSindicalizado(props) {
    const { datos, setShowModal, history, location } = props;
    //console.log(datos)
    const { id, nombre, ficha, tipo, correo, fechaCreacion, fechaActualizacion } = datos;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaSocioSindicalizado(id).then(response => {
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
                        Esta acción eliminará del sistema la información del socio.
                    </p>
                </Alert>

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
                    
                    <Row>
                    <Form.Group as={Col} controlId="formGridCorreo">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="datetime-local"
                                defaultValue={fechaToCurrentTimezone(fechaCreacion)}
                                placeholder="Fecha"
                                name="createdAt"
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

export default EliminaSocioSindicalizado;
