import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

    const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm({
        defaultValues: initialFormData()
    });

    // Update form value when fichaSocioElegido changes
    useEffect(() => {
        if (fichaSocioElegido) {
            setValue("fichaSocio", fichaSocioElegido);
            clearErrors("fichaSocio");
        } else {
            setValue("fichaSocio", "");
        }
    }, [fichaSocioElegido, setValue, clearErrors]);

    const onSubmit = (data) => {


        setLoading(true)

        // Realiza registro de la aportación
        obtenerFolioActualRetiros().then(response => {
            const { data: dataFolio } = response;
            const { folio } = dataFolio;

            let retiro = data.retiro * parseInt("-1");

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocioElegido,
                tipo: getRazonSocial(),
                periodo: getPeriodo(),
                retiro: data.retiro,
                createdAt: data.fecha
            }

            registraRetiros(dataTemp).then(response => {
                const { data } = response;

                // Registra movimientos
                registroMovimientosSaldosSocios(fichaSocioElegido, "0", "0", "0", "0", "0", data.retiro, "0", "Retiro")

                actualizacionSaldosSocios(fichaSocioElegido, data.retiro, "0", "0", folio, "Retiro")

                if (data.tipo == "aportaciones") {
                    registroAportacionInicial(fichaSocioElegido, retiro, data.fecha);
                } else if (data.tipo == "intereses") {
                    registroRendimientoInicial(fichaSocioElegido, retiro, data.fecha);
                }

                history({
                    search: queryString.stringify(""),
                });
                setShowModal(false)

                Swal.fire({
                    title: data.mensaje,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1600,
                });

            }).catch(e => {
                console.log(e)
                setLoading(false)
            })

        }).catch(e => {
            console.log(e)
            setLoading(false)
        })
    }

    const eliminaBusqueda = () => {
        setFichaSocioElegido("")
        setNombreSocioElegido("")
        setIdSocioElegido("")
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    if (!fichaSocioElegido) {
                        Swal.fire({
                            title: "Debe elegir un socio",
                            icon: "warning",
                            showConfirmButton: false,
                            timer: 1600,
                        });
                        return;
                    }
                    handleSubmit(onSubmit)(e);
                }}>

                    {/* Ficha, nombre */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFicha">
                            <Form.Label>Folio</Form.Label>
                            <Form.Control type="text" name="folio" defaultValue={folioActual} disabled />
                        </Form.Group>

                        {/* Hidden input for validation of socio selection - Removed to use Swal in onSubmit */}

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
                                Tipo de retiro
                            </Form.Label>
                            <Form.Control
                                className="mb-3"
                                as="select"
                                isInvalid={!!errors.tipo}
                                {...register("tipo", { required: "Selecciona un tipo" })}
                            >
                                <option value="">Elige una opción</option>
                                <option value="aportaciones">Aportaciones</option>
                                <option value="intereses">Intereses</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.tipo?.message}
                            </Form.Control.Feedback>
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
                                    step="0.01"
                                    isInvalid={!!errors.retiro}
                                    {...register("retiro", { required: "El retiro es obligatorio" })}
                                />
                                <InputGroup.Text>.00 MXN</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.retiro?.message}
                                </Form.Control.Feedback>
                            </InputGroup>

                        </Form.Group>
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
                                    placeholder="Fecha"
                                    isInvalid={!!errors.fecha}
                                    {...register("fecha", { required: "La fecha es obligatoria" })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fecha?.message}
                                </Form.Control.Feedback>
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

const hoy = new Date();

const fecha = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
].join("-");

const hora = [
    String(hoy.getHours()).padStart(2, "0"),
    String(hoy.getMinutes()).padStart(2, "0"),
].join(":");

function initialFormData() {
    return {
        fichaSocio: "",
        retiro: "",
        fecha: `${fecha}T${hora}`,
        tipo: ""
    }
}

export default RegistroRetiros;
