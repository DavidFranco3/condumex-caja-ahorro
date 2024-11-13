import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaEspecialesMasivo} from "../../../api/sociosEspeciales";
import {toast} from "react-toastify";
import {registroMovimientosSaldosSocios} from "../../GestionAutomatica/Saldos/Movimientos";
import queryString from "query-string";

function EliminaEspecialesMasivo(props) {
    
    const [formData, setFormData] = useState(initialFormData());
    
    const { location, history, setShowModal, setRefreshCheckLogin } = props;
    //console.log(datos)
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        
        if(!formData.fecha){
            toast.error("Por favor selecciona una fecha");
            return;
        }
        
        setLoading(true)

        try {
            eliminaMasivo(formData.fecha).then(response => {
                
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
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminará del sistema los intereses de los socios.
                    </p>
                </Alert>

                <Form onChange={onChange} onSubmit={onSubmit}>
                    
                    <Form.Group as={Row} controlId="formGridEspeciales">
                            <Col sm={4}>
                            <Form.Label>Selecciona una fecha:</Form.Label>
                            </Col>
                            <Col sm={8}>
                            <Form.Control
                                className="mb-3"
                                type="date"
                                defaultValue={formData.fecha}
                                placeholder="Fecha"
                                name="fecha"
                                />
                                </Col>
                        </Form.Group>
                    

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

function initialFormData() {
    return {
        createdAt: ""
    }
}

export default EliminaEspecialesMasivo;
