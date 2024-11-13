import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { isEmailValid } from "../../../utils/validations";
import queryString from "query-string";
import { actualizaSocioSindicalizado } from "../../../api/sociosSindicalizados";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

const initialFormData = ({ nombre, tipo, correo, ficha, fechaCreacion }) => ({
    nombre,
    tipo,
    correo,
    ficha,
    createdAt: fechaToCurrentTimezone(fechaCreacion),
});

function ModificaSociosSindicalizados(props) {
    const { datos, setShowModal, history, location } = props;
    const { id, ficha, nombre, tipoSocio, correo, estado } = datos;

    const cancelarModificacion = () => {
        setShowModal(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para almacenar la información
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()
console.log(formData)
        if (!formData.nombre || !formData.ficha || !formData.createdAt) {
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
                }

                try {
                    actualizaSocioSindicalizado(id, dataTemp).then(response => {
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
                            <Form.Control
                                as="select"
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
                                defaultValue={formData.correo !== "No especificado" ? formData.correo : ""}
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
                                defaultValue={formData.createdAt}
                                placeholder="Fecha"
                                name="createdAt"
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
                                {!loading ? "Actualizar" : <Spinner animation="border" />}
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

export default ModificaSociosSindicalizados;
