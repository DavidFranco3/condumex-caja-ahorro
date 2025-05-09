import { useState, useEffect } from 'react';
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { obtenerFolioActualRetiros, registraRetiros } from "../../../api/retiros";
import BusquedaSocios from "../../Socios/BusquedaSocios";
import BasicModal from "../../Modal/BasicModal";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import Swal from "sweetalert2";
import { getRazonSocial, getPeriodo } from "../../../api/auth";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";
import { actualizacionSaldosSocios } from "../../GestionAutomatica/Saldos/ActualizacionSaldos";
import { registroAportacionInicial } from "../../Aportaciones/RegistroBajaSocioAportacion";
import { registroRendimientoInicial } from '../../Rendimientos/RegistroBajaSocioRendimiento';

function RegistroRetiros(props) {
    const { setShowModal, location, history } = props;

    // Para controlar el modal de busqueda de socios
    const [showModalBusqueda, setShowModalBusqueda] = useState(false);
    const [contentModalBusqueda, setContentModalBusqueda] = useState(null);
    const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null);

    // Para el modal de busqueda
    const registroRetiros = (content) => {
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
            obtenerFolioActualRetiros().then(response => {
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
            if (!formData.retiro || !formData.tipo) {
                Swal.fire({
            title: "Faltan datos",
            icon: "warning",
            showConfirmButton: false,
            timer: 1600,
        });
            } else {

                setLoading(true)
                // Realiza registro de la aportación
                obtenerFolioActualRetiros().then(response => {
                    const { data } = response;
                    const { folio } = data;
                    // console.log(data)

                    let retiro = formData.retiro * parseInt("-1");

                    const dataTemp = {
                        folio: folio,
                        fichaSocio: fichaSocioElegido,
                        tipo: getRazonSocial(),
                        periodo: getPeriodo(),
                        retiro: formData.retiro,
                        createdAt: formData.fecha == "" ? fechaActual : formData.fecha
                    }

                    registraRetiros(dataTemp).then(response => {
                        const { data } = response;

                        // Registra movimientos
                        registroMovimientosSaldosSocios(fichaSocioElegido, "0", "0", "0", "0", "0", formData.retiro, "0", "Retiro")

                        actualizacionSaldosSocios(fichaSocioElegido, formData.retiro, "0", "0", folio, "Retiro")

                        if (formData.tipo == "aportaciones") {
                            registroAportacionInicial(fichaSocioElegido, retiro, formData.fecha);
                        } else if (formData.tipo == "intereses"){
                            registroRendimientoInicial(fichaSocioElegido, retiro, formData.fecha);
                        }

                        Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                        setTimeout(() => {
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
                                                name="nombre"
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
                                                        registroRetiros(
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

                        <Form.Group as={Col} controlId="formGridRetiro">
                            <Form.Label>
                                Cantidad a retirar
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="Escribe la cantidad de retiro"
                                    name="retiro"
                                    step="0.01"
                                    defaultValue={formData.retiro}
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                            </InputGroup>

                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaRegistro">
                            <Form.Label>
                                Tipo de retiro
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                as="select"
                                defaultValue={formData.tipo}
                                name="tipo"
                            >
                                <option>Elige una opción</option>
                                <option value="aportaciones">Aportaciones</option>
                                <option value="intereses">Intereses</option>
                            </Form.Control>
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
        retiro: "",
        fecha: "",
        tipo: ""
    }
}

export default RegistroRetiros;
