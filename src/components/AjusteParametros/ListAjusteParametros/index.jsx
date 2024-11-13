import { useState, useEffect } from 'react';
import moment from "moment";
// import BasicModal from "../../Modal/BasicModal";
import { Button, Col, Form, Row, Spinner, Container, Badge, InputGroup } from "react-bootstrap";
import "./ListAjusteParametros.scss"
import DatePicker, { CalendarContainer, registerLocale } from "react-datepicker";
import { actualizaParametros } from "../../../api/parametros";
import { toast } from "react-toastify";
import queryString from "query-string";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../../assets/json/loading.json";

function ListAjusteParametros(props) {
    const { setRefreshCheckLogin, listAjusteParametros, history, location, rowsPerPage, setRowsPerPage, page, setPage, totalSocios, camposHabilitados, setCamposHabilitados, razonSocialElegida } = props;

    console.log(listAjusteParametros[0])
    const { id, inicioPeriodoEmpleados, finPeriodoEmpleados, fechaEnvioEstadosCuentaEmpleados, fechaAporteEmpleados, inicioPeriodoSindicalizados, finPeriodoSindicalizados, fechaEnvioEstadosCuentaSindicalizados, fechaAporteSindicalizados } = listAjusteParametros[0];

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(listAjusteParametros[0]));

    moment.locale("es");

    // Para cancelar la modificación
    const cancelarModificacion = () => {
        setLoading(false)
        setCamposHabilitados(true)
    }

    // Para editar la información
    const editarInformacion = () => {
        setCamposHabilitados(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setCamposHabilitados(true)
        setLoading(true)
        // console.log(date.toUTCString()) --- Procesamiento en UTC
        // Termina procesamiento de fechas, para antes de guadarlas

        const dataTemp = {
            inicioPeriodoEmpleados: formData.inicioPeriodoEmpleados,
            finPeriodoEmpleados: formData.finPeriodoEmpleados,
            fechaEnvioEstadosCuentaEmpleados: formData.fechaEnvioEstadosCuentaEmpleados,
            fechaAporteEmpleados: formData.fechaAporteEmpleados,

            inicioPeriodoSindicalizados: formData.inicioPeriodoSindicalizados,
            finPeriodoSindicalizados: formData.finPeriodoSindicalizados,
            fechaEnvioEstadosCuentaSindicalizados: formData.fechaEnvioEstadosCuentaSindicalizados,
            fechaAporteSindicalizados: formData.fechaAporteSindicalizados,
        }

        console.log(dataTemp)


        // console.log(id)

        // Inicia modificación de parametros
        try {
            actualizaParametros(id, dataTemp).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                setLoading(false)
                history.push({
                    search: queryString.stringify(""),
                });
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
        // Termino de modificación de parametros

    }

    // Configuracion de la animacion
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: AnimacionLoading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            {/* Inicia estructura base para separación de razones sociales */}
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )
                    :
                    (
                        razonSocialElegida === "Asociación de Empleados Sector Cables A.C." ?
                            (
                                <>
                                    {/* Inicia empleados */}
                                    <div className="datosParametros">
                                        <Form onSubmit={onSubmit} onChange={onChange}>

                                            {/* Inicio y Fin periodo sindicalizados y empleados */}
                                            <hr />
                                            <div className="sindicalizadosyEmpleados">
                                                <Badge bg="secondary" className="tituloSeccion">
                                                    <h4>
                                                        Fechas indicativas periodo
                                                    </h4>
                                                </Badge>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formGridFechaInicioPeriodoSyE">
                                                        <Form.Label>Inicio del periodo</Form.Label>
                                                        <Form.Control
                                                            className="mb-3"
                                                            type="datetime-local"
                                                            defaultValue={formData.inicioPeriodoEmpleados}
                                                            placeholder="Fecha"
                                                            name="inicioPeriodoEmpleados"
                                                            disabled={camposHabilitados}
                                                        >
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridFechaFinPeriodoSyE">
                                                        <Form.Label>Fin del periodo</Form.Label>
                                                        <Form.Control
                                                            className="mb-3"
                                                            type="datetime-local"
                                                            defaultValue={formData.finPeriodoEmpleados}
                                                            placeholder="Fecha"
                                                            name="finPeriodoEmpleados"
                                                            disabled={camposHabilitados}
                                                        >
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                            {/* Inicio y Fin periodo Contabilidad */}
                                            <hr />
                                            {/* Fecha de envio de estados de cuenta, fecha de aportaciones de empleados, Fecha de aporte de sindicalizados */}
                                            <hr />
                                            <div className="detallesFinales">
                                                <Badge bg="secondary" className="tituloSeccion">
                                                    <h4>
                                                        Fechas generales
                                                    </h4>
                                                </Badge>

                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formGridFechaEstadosCuenta">
                                                        <Form.Label>Envio de estados de cuenta</Form.Label>
                                                        <Form.Control
                                                            className="mb-3"
                                                            type="datetime-local"
                                                            defaultValue={formData.fechaEnvioEstadosCuentaEmpleados}
                                                            placeholder="Fecha"
                                                            name="fechaEnvioEstadosCuentaEmpleados"
                                                            disabled={camposHabilitados}
                                                        >
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridFechaAportacionesEmpleados">
                                                        <Form.Label>Aportaciones de empleados</Form.Label>
                                                        {/* Seleción -> Semanal, Quincenal */}
                                                        <Form.Control
                                                            as="select"
                                                            defaultValue={formData.fechaAporteEmpleados}
                                                            disabled={camposHabilitados}
                                                            name="fechaAporteEmpleados"
                                                        >
                                                            <option value="" selected>Elige....</option>
                                                            <option value="Semanal" selected={formData.fechaAporteEmpleados === "Semanal"}>Semanal</option>
                                                            <option value="Quincenal" selected={formData.fechaAporteEmpleados === "Quincenal"}>Quincenal</option>
                                                        </Form.Control>
                                                    </Form.Group>

                                                </Row>
                                            </div>
                                            {/* Botones */}
                                            {
                                                camposHabilitados ?
                                                    (
                                                        <>
                                                            <Form.Group as={Row} className="botones">
                                                                <Button
                                                                    onClick={() => {
                                                                        editarInformacion()
                                                                    }}
                                                                    variant="success"
                                                                    className="editaParametros"
                                                                >
                                                                    {camposHabilitados ? "Edita la información" : "Guarda los cambios"}
                                                                </Button>
                                                            </Form.Group>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <Form.Group as={Row} className="botones">
                                                                <Col>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="success"
                                                                        className="registrar"
                                                                    >
                                                                        {!loading ? "Guarda los cambios" : <Spinner animation="border" />}
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
                                                        </>
                                                    )
                                            }
                                        </Form>
                                    </div>
                                    {/* Termina empleados*/}
                                </>
                            )
                            :
                            (
                                razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." ?
                                    (
                                        <>
                                            {/* Inicia empleados */}
                                            <div className="datosParametros">
                                                <Form onSubmit={onSubmit} onChange={onChange}>

                                                    {/* Inicio y Fin periodo sindicalizados y empleados */}
                                                    <hr />
                                                    <div className="sindicalizadosyEmpleados">
                                                        <Badge bg="secondary" className="tituloSeccion">
                                                            <h4>
                                                                Fechas indicativas periodo
                                                            </h4>
                                                        </Badge>
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridFechaInicioPeriodoSyE">
                                                                <Form.Label>Inicio del periodo</Form.Label>
                                                                <Form.Control
                                                                    className="mb-3"
                                                                    type="datetime-local"
                                                                    defaultValue={formData.inicioPeriodoSindicalizados}
                                                                    placeholder="Fecha"
                                                                    name="inicioPeriodoSindicalizados"
                                                                    disabled={camposHabilitados}
                                                                >
                                                                </Form.Control>
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridFechaFinPeriodoSyE">
                                                                <Form.Label>Fin del periodo</Form.Label>
                                                                <Form.Control
                                                                    className="mb-3"
                                                                    type="datetime-local"
                                                                    defaultValue={formData.finPeriodoSindicalizados}
                                                                    placeholder="Fecha"
                                                                    name="finPeriodoSindicalizados"
                                                                    disabled={camposHabilitados}
                                                                >
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </Row>
                                                    </div>
                                                    {/* Inicio y Fin periodo Contabilidad */}
                                                    <hr />
                                                    {/* Fecha de envio de estados de cuenta, fecha de aportaciones de empleados, Fecha de aporte de sindicalizados */}
                                                    <hr />
                                                    <div className="detallesFinales">
                                                        <Badge bg="secondary" className="tituloSeccion">
                                                            <h4>
                                                                Fechas generales
                                                            </h4>
                                                        </Badge>

                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridFechaEstadosCuenta">
                                                                <Form.Label>Envio de estados de cuenta</Form.Label>
                                                                <Form.Control
                                                                    className="mb-3"
                                                                    type="datetime-local"
                                                                    defaultValue={formData.fechaEnvioEstadosCuentaSindicalizados}
                                                                    placeholder="Fecha"
                                                                    name="fechaEnvioEstadosCuentaSindicalizados"
                                                                    disabled={camposHabilitados}
                                                                >
                                                                </Form.Control>
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridFechaAportacionesEmpleados">
                                                                <Form.Label>Aportaciones de empleados</Form.Label>
                                                                {/* Seleción -> Semanal, Quincenal */}
                                                                <Form.Control
                                                                    as="select"
                                                                    defaultValue={formData.fechaAporteSindicalizados}
                                                                    disabled={camposHabilitados}
                                                                    name="fechaAporteSindicalizados"
                                                                >
                                                                    <option value="" selected>Elige....</option>
                                                                    <option value="Semanal" selected={formData.fechaAporteSindicalizados === "Semanal"}>Semanal</option>
                                                                    <option value="Quincenal" selected={formData.fechaAporteSindicalizados === "Quincenal"}>Quincenal</option>
                                                                </Form.Control>
                                                            </Form.Group>

                                                        </Row>
                                                    </div>
                                                    {/* Botones */}
                                                    {
                                                        camposHabilitados ?
                                                            (
                                                                <>
                                                                    <Form.Group as={Row} className="botones">
                                                                        <Button
                                                                            onClick={() => {
                                                                                editarInformacion()
                                                                            }}
                                                                            variant="success"
                                                                            className="editaParametros"
                                                                        >
                                                                            {camposHabilitados ? "Edita la información" : "Guarda los cambios"}
                                                                        </Button>
                                                                    </Form.Group>
                                                                </>
                                                            )
                                                            :
                                                            (
                                                                <>
                                                                    <Form.Group as={Row} className="botones">
                                                                        <Col>
                                                                            <Button
                                                                                type="submit"
                                                                                variant="success"
                                                                                className="registrar"
                                                                            >
                                                                                {!loading ? "Guarda los cambios" : <Spinner animation="border" />}
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
                                                                </>
                                                            )
                                                    }
                                                </Form>
                                            </div>
                                            {/* Termina sindicalizados */}
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Lottie
                                                loop={true}
                                                play={true}
                                                animationData={AnimacionLoading}
                                            />
                                        </>
                                    )
                            )
                    )

            }
            {/* Termina estructura base para separación de razones sociales */}
        </>
    );
}

function initialFormData(data) {

    return {
        inicioPeriodoEmpleados: data.inicioPeriodoEmpleados,
        finPeriodoEmpleados: data.finPeriodoEmpleados,
        fechaEnvioEstadosCuentaEmpleados: data.fechaEnvioEstadosCuentaEmpleados,
        fechaAporteEmpleados: data.fechaAporteEmpleados,

        inicioPeriodoSindicalizados: data.inicioPeriodoSindicalizados,
        finPeriodoSindicalizados: data.finPeriodoSindicalizados,
        fechaEnvioEstadosCuentaSindicalizados: data.fechaEnvioEstadosCuentaSindicalizados,
        fechaAporteSindicalizados: data.fechaAporteSindicalizados,
    }
}

export default ListAjusteParametros;

