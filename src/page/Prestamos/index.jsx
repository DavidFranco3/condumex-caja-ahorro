import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faEye, faTrashCan, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionPrestamos,
    listarPaginacionPrestamosxTipo,
    totalPrestamos,
    totalxTipoPrestamos,
    listarPrestamo
} from "../../api/prestamos";
import ListPrestamos from "../../components/Prestamos/ListPrestamos";
import RegistroPrestamos from "../../components/Prestamos/RegistroPrestamos";
import BasicModal from "../../components/Modal/BasicModal";
import CargaMasivaPrestamos from '../../components/Prestamos/CargaMasivaPrestamos';
import EliminaPrestamoMasivo from '../../components/Prestamos/EliminaPrestamoMasivo';
import RestaurarPrestamos from '../../components/Prestamos/RestaurarPrestamos';
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { map } from "lodash";

function Prestamos(props) {
    const { datos, setRefreshCheckLogin, location, history } = props;
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

    // Para el registro de prestamos
    const registroPrestamos = (content) => {
        setTitulosModal("Registrar un préstamo");
        setContentModal(content);
        setShowModal(true);
    }

    const registroPrestamosCargaMasiva = (content) => {
        setTitulosModal('Carga masiva')
        setContentModal(content)
        setShowModal(true)
    }

    const registroPrestamosRestaurar = (content) => {
        setTitulosModal('Restaurar')
        setContentModal(content)
        setShowModal(true)
    }

    //Para el registro de Rendimientos
    const eliminaPrestamoMasivo = (content) => {
        setTitulosModal('Eliminar elementos')
        setContentModal(content)
        setShowModal(true)
    }

    // Almacena los datos de los prestamos
    const [listPrestamos, setListPrestamos] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPrestamo(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listPrestamos && data) {
                    setListPrestamos(formatModelPrestamos(data));
                } else {
                    const datosPrestamos = formatModelPrestamos(data);
                    setListPrestamos(datosPrestamos)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const [listaFichas, setListaFichas] = useState([]);

    useEffect(() => {

        let listaFichasTemp = [];
        map(listPrestamos, (prestamo, index) => {
            const tempFicha = prestamo.fichaSocio.split("T");
            listaFichasTemp.push(tempFicha[0])
        })
        setListaFichas(listaFichasTemp);
    }, [listPrestamos]);

    const [listaPrestamos2, setListaPrestamos2] = useState([]);

    useEffect(() => {

        let listaPrestamosTemp = [];
        map(listPrestamos, (prestamo, index) => {
            const tempPrestamo = prestamo.prestamoTotal.split("T");
            listaPrestamosTemp.push(tempPrestamo[0])
        })
        setListaPrestamos2(listaPrestamosTemp);
    }, [listPrestamos]);

    const [listaFechas, setListaFechas] = useState([]);

    useEffect(() => {

        let listaFechasTemp = [];
        map(listPrestamos, (prestamo, index) => {
            const tempFecha = prestamo.fechaCreacion.split("T");
            listaFechasTemp.push(tempFecha[0])
        })
        setListaFechas(listaFechasTemp);
    }, [listPrestamos]);

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Préstamos</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>

                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    eliminaPrestamoMasivo(
                                        <EliminaPrestamoMasivo
                                            listPrestamos2={listPrestamos}
                                            listaFichas={listaFichas}
                                            listaPrestamos2={listaPrestamos2}
                                            listaFechas={listaFechas}
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} /> Eliminar por fecha
                            </Button>

                            <Button
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    registroPrestamosCargaMasiva(
                                        <CargaMasivaPrestamos
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registro masivo
                            </Button>

                            <Button
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    registroPrestamosRestaurar(
                                        <RestaurarPrestamos
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faWindowRestore} /> Restaurar
                            </Button>

                            <Button
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    registroPrestamos(
                                        <RegistroPrestamos
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar préstamo
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            {
                listPrestamos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListPrestamos
                                    listPrestamos={listPrestamos}
                                    listPrestamos2={listPrestamos}
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

function formatModelPrestamos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            cantidadPagos: data.cantidadPagos,
            abonoPorPago: data.abonoPorPago,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            prestamo: String(data.prestamo),
            prestamoTotal: String(data.prestamoTotal),
            tasaInteres: data.tasaInteres,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelPrestamos2(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            prestamo: String(data.prestamo),
            prestamoTotal: String(data.prestamoTotal),
            tasaInteres: data.tasaInteres,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Prestamos);
