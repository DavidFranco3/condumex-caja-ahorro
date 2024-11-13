import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../components/Modal/BasicModal";
import { listarMovimientoSaldosPeriodo } from "../../api/movimientosSaldos";
import ListMovimientos from "../../components/Movimientos/ListMovimientos";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { listarPeriodo } from '../../api/periodos';
import { map } from "lodash";

function Movimientos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar el listado de movimentos
    const [listMovimientos, setListMovimientos] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarMovimientoSaldosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMovimientos && data) {
                    setListMovimientos(formatModelMovimientosSocio(data));
                } else {
                    const datosMovimientos = formatModelMovimientosSocio(data);
                    setListMovimientos(datosMovimientos)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para almacenar las sucursales registradas
    const [periodosRegistrados, setPeriodosRegistrados] = useState(null);

    const cargarListaPeriodos = () => {
        try {
            listarPeriodo(getRazonSocial()).then(response => {
                const { data } = response;
                //console.log(data)
                const dataTemp = formatModelPeriodos(data);
                //console.log(data)
                setPeriodosRegistrados(dataTemp);
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        cargarListaPeriodos();
    }, []);

    // Almacena la razón social, si ya fue elegida
    const [periodoElegido, setPeriodoElegido] = useState("");

    // Para almacenar en localstorage la razon social
    const almacenaPeriodo = (periodo) => {
        if (periodo != "Elige una opción") {
            setPeriodo(periodo)
        }
        window.location.reload()
    }

    const guardarPeriodoElegido = () => {
        if (getPeriodo()) {
            setPeriodoElegido(getPeriodo)
        }
    }

    useEffect(() => {
        guardarPeriodoElegido();
    }, []);

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={8} className="titulo">
                        <h1 className="font-bold">
                            Movimientos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                    </Col>
                </Row>
            </Alert>

            <Row>
                <Col xs={6} md={4}>

                </Col>
                <Col xs={6} md={4}>
                    <Form.Control
                        as="select"
                        aria-label="indicadorPeriodo"
                        name="periodo"
                        className="periodo"
                        defaultValue={periodoElegido}
                        onChange={(e) => {
                            almacenaPeriodo(e.target.value)
                        }}
                    >
                        <option>Elige una opción</option>
                        {map(periodosRegistrados, (periodo, index) => (
                            <option key={index} value={periodo?.folio} selected={periodoElegido == periodo?.folio}>{periodo?.nombre}</option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>

            {
                listMovimientos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMovimientos
                                    listMovimientos={listMovimientos}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelMovimientosSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            movimiento: data.movimiento,
            aportacion: data.aportacion,
            prestamo: data.prestamo,
            patrimonio: data.patrimonio,
            rendimiento: data.rendimiento,
            retiro: data.retiro,
            abono: data.abono,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelPeriodos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            fechaInicio: data.fechaInicio,
            fechaCierre: data.fechaCierre,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Movimientos);
