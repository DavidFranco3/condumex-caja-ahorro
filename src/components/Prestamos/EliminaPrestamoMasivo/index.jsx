import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { eliminaPrestamosMasivo } from "../../../api/prestamos";
import { toast } from "react-toastify";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import queryString from "query-string";
import { actualizacionDeudaSocio } from "../../DeudaSocio/RegistroActualizacionDeudaSocio";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from '../../../api/auth';

function EliminaPrestamoMasivo(props) {

    const { listPrestamos2, listaFichas, listaPrestamos2, listaFechas, location, history, setShowModal, setRefreshCheckLogin } = props;

    const [formData, setFormData] = useState(initialFormData());
    //console.log(datos)
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Almacena la razón social, si ya fue elegida
    const [razonSocialElegida, setRazonSocialElegida] = useState("");

    useEffect(() => {
        if (getRazonSocial()) {
            setRazonSocialElegida(getRazonSocial)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.fecha) {
            toast.error("Por favor selecciona una fecha");
            return;
        }

        console.log(listPrestamos2);
        console.log(listaFichas);

        setLoading(true)

        try {
            eliminaPrestamosMasivo(formData.fecha, razonSocialElegida).then(response => {

                for (let i = 0; i < listaFechas.length; i++) {

                    if (formData.fecha == listaFechas[i]) {
                        actualizacionDeudaSocio(parseInt(listaFichas[i]), "0", parseFloat(listaPrestamos2[i]), "Eliminación prestamo", formData.fecha);
                    }
                }

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
                        Esta acción eliminará del sistema los prestamos de los socios.
                    </p>
                </Alert>

                <Form onChange={onChange} onSubmit={onSubmit}>

                    <Form.Group as={Row} controlId="formGridPrestamos">
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

export default EliminaPrestamoMasivo;
