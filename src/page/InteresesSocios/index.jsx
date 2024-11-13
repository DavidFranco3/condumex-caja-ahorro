import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrashCan, faWindowRestore, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { listarRendimientoPeriodo} from "../../api/rendimientos";
import ListInteresesSocios from "../../components/InteresesSocios/ListInteresesSocios";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarPeriodo } from '../../api/periodos';
import { map } from "lodash";
import "./InteresesSocios.scss";

function InteresesSocios(props) {
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

    // Almacena los datos de los abonos
    const [listInteresesSocios, setListInteresesSocios] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarRendimientoPeriodo(getRazonSocial(), getPeriodo()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listInteresesSocios && data) {
                    setListInteresesSocios(formatModelInteresesSocios(data));
                } else {
                    const datosInteresesSocios = formatModelInteresesSocios(data);
                    setListInteresesSocios(datosInteresesSocios)
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
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Intereses de los socios</h1>
                    </Col>
                    <Col xs={6} md={8}>
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
                listInteresesSocios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListInteresesSocios
                                    listInteresesSocios={listInteresesSocios}
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

function formatModelInteresesSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: String(data.fichaSocio),
            monto: parseFloat(data.rendimiento).toFixed(2),
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

export default withRouter(InteresesSocios);
