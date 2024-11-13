import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { obtenerFichaActualSociosEmpleados, registraSociosEmpleados } from "../../../api/sociosEmpleados";

function RegistroSociosEmpleados (props) {
    const { setShowModal, history, location } = props;

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el numero actual de ficha
    const [noActualFicha, setNoActualFicha] = useState("");

    useEffect(() => {
        try {
            obtenerFichaActualSociosEmpleados().then(response => {
                const { data } = response;
                const { ficha } = data;
                setNoActualFicha(ficha)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate() : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const hora = hoy.getHours() < 10 ? "0" + hoy.getHours() + ':' + hoy.getMinutes() : hoy.getMinutes() < 10 ? hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() < 10 && hoy.getMinutes() < 10 ? "0" + hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() + ':' + hoy.getMinutes();

    const [fechaActual, setFechaActual] = useState(fecha +"T"+ hora);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.ficha || !formData.nombre || !formData.tipo) {
            toast.warning("Completa el formulario")
        } else {
            if (!isEmailValid(formData.correo)) {
                toast.warning("Escriba un correo valido")
            } else {
                setLoading(true)
                const dataTemp = {
                    ficha: formData.ficha,
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    correo: formData.correo,
                    createdAt: formData.fecha == "" ? fechaActual : formData.fecha,
                    estado: "true"
                }

                try {
                    registraSociosEmpleados(dataTemp).then(response => {
                        const { data } = response;
                        toast.success(data.mensaje)
                        setLoading(false)
                        history({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }).catch(e => {
                        console.log(e)
                        if (e.message === 'Network Error') {
                            //console.log("No hay internet")
                            toast.error("Conexión al servidor no disponible");
                            setLoading(false);
                        } else {
                            if (e.response && e.response.status === 401) {
                                const { mensaje } = e.response.data;
                                toast.error(mensaje);
                                setLoading(false);
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Ficha
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la ficha"
                                name="ficha"
                                defaultValue={formData.ficha}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el nombre"
                                name="nombre"
                                defaultValue={formData.nombre}
                            />
                        </Form.Group>
                    </Row>
                    {/* Tipo de socio, correo */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Tipo de socio
                            </Form.Label>
                            <Form.Control as="select"
                                defaultValue={formData.tipo}
                                name="tipo"
                                disabled
                            >
                                <option>Elige una opción</option>
                                <option value="Asociación de Empleados Sector Cables A.C.">Empleado</option>
                                <option value="Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.">Sindicalizado</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCorreo">
                            <Form.Label>
                                Correo
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el correo"
                                name="correo"
                                defaultValue={formData.correo}
                            />
                        </Form.Group>
                    </Row>

                        <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>
                                <Form.Control
                                type="datetime-local"
                                defaultValue={formData.fecha == "" ? fechaActual : formData.fecha}
                                placeholder="Fecha"
                                name="fecha"
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

function initialFormData () {
    return {
        ficha: "",
        nombre: "",
        tipo: "Asociación de Empleados Sector Cables A.C.",
        correo: "",
        fecha: "",
    }

}

export default RegistroSociosEmpleados;
