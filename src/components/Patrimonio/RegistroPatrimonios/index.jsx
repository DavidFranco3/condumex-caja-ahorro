import { useState, useEffect } from 'react';
import { obtenerFolioActualPatrimonio, registraPatrimonio } from "../../../api/patrimonio";
import { Button, Col, Form, InputGroup, Row, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import BusquedaSocios from "../../Socios/BusquedaSocios";
import BasicModal from "../../Modal/BasicModal";
import { toast } from "react-toastify";
import { getRazonSocial, getPeriodo } from "../../../api/auth";
import queryString from "query-string";
import { registroMovimientosSaldosSocios } from "../../GestionAutomatica/Saldos/Movimientos";
import { registroPatrimonioInicial } from "../RegistroBajaSocioPatrimonio";
import { registroSaldoInicial } from "../../GestionAutomatica/Saldos/Saldos";
import { actualizacionSaldosSocios } from "../../GestionAutomatica/Saldos/ActualizacionSaldos";

function RegistroPatrimonios(props) {
    const { setShowModal, location, history } = props;
    // Para controlar el modal de busqueda de socios
    // Para hacer uso del modal
    const [showModalBusqueda, setShowModalBusqueda] = useState(false);
    const [contentModalBusqueda, setContentModalBusqueda] = useState(null);
    const [titulosModalBusqueda, setTitulosModalBusqueda] = useState(null);
    // Para el modal de busqueda
    const registroPatrimonio = (content) => {
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
            obtenerFolioActualPatrimonio().then(response => {
                const { data } = response;
                const { folio } = data;
                setFolioActual(folio)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);
    // Para almacenar y calcular lo que se debe pagar

    // Para almacenar el id, ficha y nombre del socio elegido
    const [idSocioElegido, setIdSocioElegido] = useState("");
    const [fichaSocioElegido, setFichaSocioElegido] = useState("");
    const [nombreSocioElegido, setNombreSocioElegido] = useState("");
    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());
    const onSubmit = (e) => {
        e.preventDefault()

        if (!fichaSocioElegido) {
            toast.warning("Debe elegir un socio");
        } else {
            if (!formData.patrimonio || !formData.fecha) {
                toast.warning("Faltan datos");
            } else {
                setLoading(true)

                // Realiza el registro del patrimonio

                obtenerFolioActualPatrimonio().then(response => {

                    const { data } = response;
                    const { folio } = data;
                    const dataTemp = {
                        folio: folio,
                        fichaSocio: fichaSocioElegido,
                        periodo: getPeriodo(),
                        tipo: getRazonSocial(),
                        patrimonio: formData.patrimonio,
                        createdAt: formData.fecha
                    }

                    registraPatrimonio(dataTemp).then(response => {
                        const { data } = response;
                        toast.success('Patrimonio registrado')

                        // Registro de movimientos
                        registroMovimientosSaldosSocios(fichaSocioElegido, "0", "0", "0", formData.patrimonio, "0", "0", "0", "Patrimonio")

                        // Registra Saldos
                        registroSaldoInicial(fichaSocioElegido, "0", formData.patrimonio, "0", folio, "Patrimonio");

                        actualizacionSaldosSocios(fichaSocioElegido, "0", formData.patrimonio, "0", folio, "Patrimonio");

                        setTimeout(() => {
                            setLoading(false)
                            history({
                                search: queryString.stringify(""),
                            });
                            setShowModal(false)
                        }, 1500)

                    }).catch(e => {
                        console.log()
                    })

                    // Modificar movimientos para enviar el generado interesGenerado

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
                                                        registroPatrimonio(
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
                                    defaultValue={formData.fecha}
                                    placeholder="Fecha"
                                    name="fecha"
                                />
                            </InputGroup>

                        </Form.Group>


                        <Form.Group as={Col} controlId="formGridPatrimonio">
                            <Form.Label>
                                Patrimonio
                            </Form.Label>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Escribe el monto del patrimonio"
                                    name="patrimonio"
                                    defaultValue={formData.patrimonio}
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
        patrimonio: "",
        createdAt: ""
    }

}

export default RegistroPatrimonios;
