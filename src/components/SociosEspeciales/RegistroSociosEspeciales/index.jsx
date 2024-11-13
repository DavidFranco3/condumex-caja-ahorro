import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map, size, values } from "lodash";
import { toast } from "react-toastify";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { obtenerFichaActualSocioEspecial, registraSocioEspecial } from "../../../api/sociosEspeciales";

function RegistroSociosEspeciales (props) {
    const { setShowModal, history, location } = props;

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el numero actual de ficha
    const [noActualFicha, setNoActualFicha] = useState("");

    useEffect(() => {
        try {
            obtenerFichaActualSocioEspecial().then(response => {
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

    const onSubmit = (e) => {
        e.preventDefault()

        // console.log(formData)
        let validCount = 0
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (size(formData) !== validCount || !formData.fecha) {
            toast.warning("Completa el formulario")
        } else {
            if (!isEmailValid(formData.correo)) {
                toast.warning("Escriba un correo valido")
            } else {
                setLoading(true)
                const dataTemp = {
                    ficha: noActualFicha,
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    correo: formData.correo,
                    createdAt: formData.fecha,
                    estado: "true"
                }

                try {
                    registraSocioEspecial(dataTemp).then(response => {
                        const { data } = response;
                        toast.success(data.mensaje)
                        setLoading(false)
                        history({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
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
                                name="ficha"
                                defaultValue={noActualFicha}
                                disabled
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
                                <option value="" selected>Elige una opción</option>
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
                                defaultValue={formData.fecha}
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
        nombre: "",
        tipo: "CONDUMEX S.A. DE C.V.",
        correo: ""
    }

}

export default RegistroSociosEspeciales;


