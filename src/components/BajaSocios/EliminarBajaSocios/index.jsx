import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaBajaSocios} from "../../../api/bajaSocios";
import {toast} from "react-toastify";
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";
import queryString from "query-string";
import {registroSaldoInicial} from "../../GestionAutomatica/Saldos/Saldos";
import { registroPatrimonioInicial } from "../../Patrimonio/RegistroBajaSocioPatrimonio";
import { registroRendimientoInicial } from "../../Rendimientos/RegistroBajaSocioRendimiento";
import { registroAportacionInicial } from "../../Aportaciones/RegistroBajaSocioAportacion";
import { actualizacionSaldosSocios } from "../../GestionAutomatica/Saldos/ActualizacionSaldos";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaBajaSocios(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const { id, folio, fichaSocio, aportacion, patrimonio, rendimiento, total, fechaCreacion, fechaActualizacion  } = datos;

    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaBajaSocios(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)

                setTimeout(() => {
                    setLoading(false)
                    history.push({
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
                    <Alert.Heading>Atenci??n! Acci??n destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acci??n eliminar?? del sistema la baja del socio.
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
                                Aportaci??n
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
                        <Form.Group as={Col} controlId="formGridPatrimonio">
                            <Form.Label>
                                Patrimonio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="patrimonio"
                                defaultValue={patrimonio}
                                disabled
                            />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridRendimiento">
                            <Form.Label>
                                Inter??s
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="rendimiento"
                                defaultValue={rendimiento}
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

export default EliminaBajaSocios;
