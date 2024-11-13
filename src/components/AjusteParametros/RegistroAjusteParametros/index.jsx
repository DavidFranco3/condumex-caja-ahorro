import { useState, useEffect } from 'react';
import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {size, values} from "lodash";
import {toast} from "react-toastify";
import {registraParametros} from "../../../api/parametros";
import queryString from "query-string";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "./RegistroAjusteParametros.scss"

function RegistroAjusteParametros(props) {
    const { location, history, setShowModal } = props;

    // Para almacenar la fecha de inicio del periodo
    const [fechaInicio, setFechaInicio] = useState(new Date);

    // Para almacenar la fecha de fin del periodo
    const [finPeriodo, setFinPeriodo] = useState(new Date);

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

    // Cancelar registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

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
            setLoading(false)
            const tempIntereses = formData.tasaInteres / 100
            const tempRendimiento = formData.tasaRendimiento / 100
            const dataTemp = {
                tasaInteres: tempIntereses,
                tasaRendimiento: tempRendimiento,
                inicioPeriodo: fechaInicio,
                finPeriodo: finPeriodo
            }
            // console.log(dataTemp)
            try {
                registraParametros(dataTemp).then(response => {
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
                                    selected={finPeriodo}
                                    onChange={(date) => {setFinPeriodo(date)}}
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
                            <br />
                            {/* Ficha, nombre */}
                            <Row className="mb-3">

                                <Form.Group as={Row} controlId="formGridFicha">
                                    <Form.Label>
                                        Tasa de interés prestamos (Interés anual)
                                    </Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            name="tasaInteres"
                                            defaultValue={formData.tasaInteres}
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
                                {!loading ? "Registrar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarRegistro()
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
        tasaInteres: "",
        tasaRendimiento: ""
    }
}

export default RegistroAjusteParametros;
