import { useState, useEffect } from 'react';
import {getTokenApi, isExpiredToken, logoutApi} from "../../../api/auth";
import {toast} from "react-toastify";
import { Alert, Button, Col, Form, Row, Spinner, InputGroup } from "react-bootstrap";
import {size, values} from "lodash";
import {actualizaParametros} from "../../../api/parametros";
import queryString from "query-string";
import DatePicker, {CalendarContainer} from "react-datepicker";

function ModificaAjusteParametros(props) {
    const { datos, location, history, setShowModal, setRefreshCheckLogin } = props;

    const { id, tasaInteres, tasaRendimiento, inicioPeriodo, finPeriodo, fechaCreacion } = datos;

    // Para almacenar la fecha de inicio del periodo
    const [fechaInicio, setFechaInicio] = useState(new Date);

    // Para almacenar la fecha de fin del periodo
    const [fechaFinPeriodo, setFechaFinPeriodo] = useState(new Date);

    const contenedorFechas = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ background: "#f0f0f0" }}>
                        Seleccione la fecha
                    </div>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

    // Controlar la animacion
    const [loading, setLoading] = useState(false);

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    const cancelarModificacion = () => {
        setShowModal(false)
    }

    // Para almacenar la información del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()

        let validCount = 0
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if(size(formData) !== validCount){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            const tempIntereses = formData.tasaInteres / 100
            const tempRendimiento = formData.tasaRendimiento / 100
            const dataTemp = {
                tasaInteres: tempIntereses,
                tasaRendimiento: tempRendimiento,
                inicioPeriodo: fechaInicio,
                finPeriodo: fechaFinPeriodo
            }
            // console.log(dataTemp)

            try {
                actualizaParametros(id, dataTemp).then(response => {
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
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">

                <Form onSubmit={onSubmit} onChange={onChange}>

                    <div className="datosFormulario">
                        {/* Fecha de inicio del periodo, fecha de fin del periodo */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFechaInicioPeriodo">
                                <Form.Label>Inicio del periodo</Form.Label>
                                <DatePicker
                                    locale="es"
                                    selected={fechaInicio}
                                    onChange={(date) => {setFechaInicio(date)}}
                                    calendarContainer={contenedorFechas}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    todayButton="Fecha actual"
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridFechaInicioPeriodo">
                                <Form.Label>Fin del periodo</Form.Label>
                                <DatePicker
                                    locale="es"
                                    selected={fechaFinPeriodo}
                                    onChange={(date) => {setFechaFinPeriodo(date)}}
                                    calendarContainer={contenedorFechas}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    todayButton="Fecha actual"
                                />
                            </Form.Group>
                        </Row>

                        <div className="porcentajes">
                            {/* Ficha, nombre */}
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridNombre">
                                    <Form.Label>
                                        Tasa de rendimiento
                                    </Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            name="tasaRendimiento"
                                            defaultValue={formData.tasaRendimiento}
                                        />
                                        <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                            </Row>
                        </div>
                    </div>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Modificar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarModificacion()
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

function initialFormData(datos) {
    const { tasaInteres, tasaRendimiento } = datos;

    return {
        tasaInteres: parseFloat(tasaInteres) * 100,
        tasaRendimiento: parseFloat(tasaRendimiento) * 100
    }
}

export default ModificaAjusteParametros;
