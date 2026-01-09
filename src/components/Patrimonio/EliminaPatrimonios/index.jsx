import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { eliminaPatrimonio } from "../../../api/patrimonio";
import Swal from "sweetalert2";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import queryString from "query-string";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";
import { actualizacionSaldosSocios } from "../../GestionAutomatica/Saldos/ActualizacionSaldos";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

function EliminaPatrimonios(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const { id, folio, fichaSocio, patrimonio, fechaCreacion, fechaActualizacion } = datos;

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaPatrimonio(id).then(response => {
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
                        Esta acción eliminará del sistema el patrimonio del socio.
                    </p>
                </Alert>

                <Form onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="folio"
                                defaultValue={folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFichaSocio">
                            <Form.Label>
                                Ficha del socio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="fichaSocio"
                                defaultValue={fichaSocio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPatrimonio">
                            <Form.Label>
                                Pratrimonio
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="pratrimonio"
                                defaultValue={patrimonio}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFecha">
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

export default EliminaPatrimonios;

