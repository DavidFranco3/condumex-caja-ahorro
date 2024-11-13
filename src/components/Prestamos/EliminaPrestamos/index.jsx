import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaPrestamos} from "../../../api/prestamos";
import {toast} from "react-toastify";
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";
import {actualizacionDeudaSocio} from "../../DeudaSocio/RegistroActualizacionDeudaSocio";
import queryString from "query-string";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaPrestamos(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const { id, folio, fichaSocio, prestamo, prestamoTotal,  cantidadPagos, abonoPorPago, fechaCreacion, fechaActualizacion, tasaInteres} = datos;

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
                eliminaPrestamos(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)

                // Revierte saldos para eliminar el prestamo correspondiente
                registroMovimientosSaldosSocios(parseInt(fichaSocio), "0", "0", parseFloat(prestamoTotal), "0", "0", "0", "0", "Eliminación prestamo");
                
                actualizacionDeudaSocio(parseInt(fichaSocio), "0", parseFloat(prestamoTotal), "Eliminación prestamo", fechaCreacion);
               
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
                        Esta acción eliminará del sistema el prestamo del socio.
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

                        <Form.Group as={Col} controlId="formGridPrestamo">
                            <Form.Label>
                                Prestamo
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="prestamo"
                                defaultValue={prestamo}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    
                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>
                                Interes
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="tasaInteres"
                                defaultValue={tasaInteres}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFichaSocio">
                            <Form.Label>
                                Total
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="prestamoTotal"
                                defaultValue={prestamoTotal}
                                disabled
                            />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridPrestamo">
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

export default EliminaPrestamos;

