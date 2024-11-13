import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaAportaciones} from "../../../api/aportaciones";
import {toast} from "react-toastify";
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";
import queryString from "query-string";
import {registroSaldoInicial} from "../../GestionAutomatica/Saldos/Saldos";
import {actualizacionSaldosSocios} from "../../GestionAutomatica/Saldos/ActualizacionSaldos";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaAportaciones(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const { id, folio, fichaSocio, aportacion, fechaCreacion, fechaActualizacion } = datos;

    const cancelarEliminacion = () => {
        setShowModal(false)
        }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaAportaciones(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)

                // Revierte saldos para eliminar la aportacion correspondiente
                registroMovimientosSaldosSocios(parseInt(fichaSocio), aportacion, "0", "0", "0", "0", "0", "0", "Eliminación aportación")
                
                // Registra Saldos
                registroSaldoInicial(parseInt(fichaSocio), aportacion, "0", "0", folio, "Eliminación aportación")
                
                actualizacionSaldosSocios(parseInt(fichaSocio), aportacion, "0", "0", folio, "Eliminación aportación")

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
                        Esta acción eliminará del sistema la aportación del socio.
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

                        <Form.Group as={Col} controlId="formGridAportacion">
                            <Form.Label>
                                Aportacion
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="aportacion"
                                defaultValue={aportacion}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row>
                    <Form.Group as={Col} controlId="formGridAportacion">
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
                    
                    <br/>

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

export default EliminaAportaciones;
