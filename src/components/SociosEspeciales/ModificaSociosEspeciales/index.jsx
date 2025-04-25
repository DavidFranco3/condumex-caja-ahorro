import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "./ModificaSociosEspeciales.scss"
import { size, values } from "lodash";
import Swal from "sweetalert2";
import { isEmailValid } from "../../../utils/validations";
import { actualizaSocioEspecial } from "../../../api/sociosEspeciales";
import queryString from "query-string";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

const initialFormData = ({ ficha, nombre, correo, fechaCreacion }) => ({
        nombre,
        tipo: "CONDUMEX S.A. DE C.V.",
        correo,
        ficha,
        createdAt: fechaToCurrentTimezone(fechaCreacion),
});

function ModificaSociosEspeciales (props) {
    const { datos, setShowModal, history, location } = props;
    const { id, ficha, nombre, tipoSocio, correo, createdAt, estado } = datos;

    const cancelarModificacion = () => {
        setShowModal(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para almacenar la información
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()

        let validCount = 0
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (size(formData) !== validCount || !formData.createdAt) {
            Swal.fire({
                    title: "Completa el formulario",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1600,
                });
        } else {
            if (!isEmailValid(formData.correo)) {
                Swal.fire({
                    title: "Escriba un correo valido",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1600,
                });
            } else {
                setLoading(true)

                const dataTemp = {
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    correo: formData.correo,
                    ficha: formData.ficha,
                    createdAt: fechaToCurrentTimezone(formData.createdAt)
                }

                // Inicia prooceso de actualización de datos
                try {
                    actualizaSocioEspecial(id, dataTemp).then(response => {
                        const { data } = response;
                        Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
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
                // Termina proceso de actualización de datos
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
                                defaultValue={ficha}
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

export default ModificaSociosEspeciales;
