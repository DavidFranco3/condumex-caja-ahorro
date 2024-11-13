import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaDeudaSocio} from "../../../api/deudaSocio";
import {toast} from "react-toastify";
import queryString from "query-string";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaDeudaSocio(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const { id, folio, fichaSocio, abonoTotal, prestamoTotal, saldoActual, fechaCreacion, fechaActualizacion} = datos;

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
                eliminaDeudaSocio(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)

                setTimeout(() => {
                    setLoading(false)
                    history({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }, 3000)

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
                        Esta acción eliminará del sistema la deuda del socio.
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

                        <Form.Group as={Col} controlId="formGridAbono">
                            <Form.Label>
                                Abono
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="abono"
                                defaultValue={abonoTotal}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row>
                    
                            <Form.Group as={Col} controlId="formGridPrestamo">
                                <Form.Label>
                                    Prestamo
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prestamo"
                                    defaultValue={prestamoTotal}
                                    disabled
                                />
                            </Form.Group>
                            
                            <Form.Group as={Col} controlId="formGridTotal">
                                <Form.Label>
                                    Total
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="total"
                                    defaultValue={saldoActual}
                                    disabled
                                />
                            </Form.Group>
                    
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

export default EliminaDeudaSocio;

