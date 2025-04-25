import { useState, useEffect } from 'react';
import "./RegistroAportaciones.scss"
import { Button, Col, Form, Row, Spinner, InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { obtenerFolioActualAportaciones, registraAportacionesSocios } from "../../../api/aportaciones";
import BusquedaSocios from "../../Socios/BusquedaSocios";
import BasicModal from "../../Modal/BasicModal";
import Swal from "sweetalert2";
import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";
import { actualizacionSaldosSocios } from "../../GestionAutomatica/Saldos/ActualizacionSaldos";
import { registroAportacionInicial } from "../../Aportaciones/RegistroBajaSocioAportacion";
import queryString from "query-string";

function RegistroAportaciones(props) {
    const { setShowModal, location, history } = props;

    // Para controlar el modal de busqueda de socios
    const [showModalBusqueda, setShowModalBusqueda] = useState(false);
    const [contentModalBusqueda, setContentModalBusqueda] = useState(null);
    const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null);

    // Para el modal de busqeuda
    const registroAportaciones = (content) => {
        setTitulosModalBusqueda("Búsqueda de socio");
        setContentModalBusqueda(content);
        setShowModalBusqueda(true);
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualAportaciones().then(response => {
                const { data } = response;
                // console.log(data)
                const { folio } = data;
                setFolioActual(folio)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el id, ficha y nombre del socio elegido
    const [idSocioElegido, setIdSocioElegido] = useState("");
    const [fichaSocioElegido, setFichaSocioElegido] = useState("");
    const [nombreSocioElegido, setNombreSocioElegido] = useState("");

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate() : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const hora = hoy.getHours() < 10 ? "0" + hoy.getHours() + ':' + hoy.getMinutes() : hoy.getMinutes() < 10 ? hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() < 10 && hoy.getMinutes() < 10 ? "0" + hoy.getHours() + ':' + "0" + hoy.getMinutes() : hoy.getHours() + ':' + hoy.getMinutes();

    const [fechaActual, setFechaActual] = useState(fecha + "T" + hora);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!fichaSocioElegido) {
            Swal.fire({
            title: "Debe elegir un socio",
            icon: "warning",
            showConfirmButton: false,
            timer: 1600,
        });
        } else {
            if (!formData.aportacion) {
                Swal.fire({
            title: "Faltan datos",
            icon: "warning",
            showConfirmButton: false,
            timer: 1600,
        });
            } else {

                setLoading(true)
                // Realiza registro de la aportación
                obtenerFolioActualAportaciones().then(response => {
                    const { data } = response;
                    const { folio } = data;

                    const dataTemp = {
                        folio: folio,
                        fichaSocio: fichaSocioElegido,
                        tipo: getRazonSocial(),
                        periodo: getPeriodo(),
                        aportacion: formData.aportacion,
                        createdAt: formData.fecha == "" ? fechaActual : formData.fecha
                    }

                    registraAportacionesSocios(dataTemp).then(response => {
                        const { data } = response;

                        // Registra movimientos
                        registroMovimientosSaldosSocios(fichaSocioElegido, formData.aportacion, "0", "0", "0", "0", "0", "0", "Aportación")

                        // Registra Saldos
                        registroSaldoInicial(fichaSocioElegido, formData.aportacion, "0", "0", folio, "Aportación")

                        actualizacionSaldosSocios(fichaSocioElegido, formData.aportacion, "0", "0", folio, "Aportación")

                        Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                        setTimeout(() => {
                            setLoading(false)
                            history({
                                search: queryString.stringify(""),
                            });
                            setShowModal(false)
                        }, 2000)

                    }).catch(e => {
                        console.log(e)
                    })

                }).catch(e => {
                    console.log(e)
                })

            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const eliminaBusqueda = () => {
        setFichaSocioElegido("")
        setNombreSocioElegido("")
        setIdSocioElegido("")
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="folio"
                                defaultValue={folioActual}
                                disabled
                            />
                        </Form.Group>

                        {
                            fichaSocioElegido ?
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridFicha">
                                            <Form.Label>
                                                Ficha <FontAwesomeIcon className="eliminaBusqueda" icon={faTrashCan} onClick={() => { eliminaBusqueda() }} />
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ficha del socio"
                                                name="ficha"
                                                defaultValue={fichaSocioElegido}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridFicha">
                                                <Form.Label>
                                                    Nombre <FontAwesomeIcon className="eliminaBusqueda" icon={faTrashCan} onClick={() => { eliminaBusqueda() }} />
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre del socio"
                                                    name="nombre"
                                                    defaultValue={nombreSocioElegido}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Row>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridBusqueda">
                                            <Form.Label>
                                                Socio
                                            </Form.Label>
                                            <Col>
                                                <Button
                                                    type="button"
                                                    className="busquedaSocio"
                                                    onClick={() => {
                                                        registroAportaciones(
                                                            <BusquedaSocios
                                                                setShowModal={setShowModalBusqueda}
                                                                setIdSocioElegido={setIdSocioElegido}
                                                                setFichaSocioElegido={setFichaSocioElegido}
                                                                setNombreSocioElegido={setNombreSocioElegido}
                                                                idSocioElegido={idSocioElegido}
                                                                fichaSocioElegido={fichaSocioElegido}
                                                                nombreSocioElegido={nombreSocioElegido}
                                                            />
                                                        )
                                                    }}
                                                >
                                                    Busca el socio
                                                </Button>
                                            </Col>

                                        </Form.Group>

                                    </>
                                )
                        }
                    </Row>
                    {/* Tipo de socio, correo */}

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Fecha de registro
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    className="mb-3"
                                    type="datetime-local"
                                    defaultValue={formData.fecha == "" ? fechaActual : formData.fecha}
                                    placeholder="Fecha"
                                    name="fecha"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAportacion">
                            <Form.Label>
                                Aportación
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"

                                    step="0.01"
                                    placeholder="Escribe la aportación"
                                    name="aportacion"
                                    defaultValue={formData.aportacion}
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                            </InputGroup>

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

            <BasicModal show={showModalBusqueda} setShow={setShowModalBusqueda} title={titulosModalBusqueda}>
                {contentModalBusqueda}
            </BasicModal>
        </>
    );
}

function initialFormData() {
    return {
        fichaSocio: "",
        aportacion: "",
        fecha: ""
    }

}

export default RegistroAportaciones;
