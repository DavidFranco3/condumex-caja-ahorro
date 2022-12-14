import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionBajaSocios,
    listarPaginacionBajaSociosxTipo,
    totalBajaSocios,
    totalxTipoBajaSocios
} from "../../api/bajaSocios";
import ListBajaSocios from "../../components/BajaSocios/ListBajaSocios";
import RegistroBajaSocios from "../../components/BajaSocios/RegistroBajaSocios";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BajaSocios(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro manual de baja de socios
    const registroSocios = (content) => {
        setTitulosModal("Registrar una baja");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalBajasSocios, setNoTotalBajasSocios] = useState(0);

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar el listado de bajas de socios
    const [listBajasSocios, setListBajasSocios] = useState(null);

    useEffect(() => {
        try {
            totalxTipoBajaSocios(getRazonSocial()).then(response => {
                const { data } = response;
                setNoTotalBajasSocios(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            // listarPaginacionRetiros(page, rowsPerPage)
            if(page === 0) {
                setPage(1)
                listarPaginacionBajaSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listBajasSocios && data){
                        setListBajasSocios(formatModelBajaSocios(data));
                    } else {
                        const datosBajasSocios = formatModelBajaSocios(data);
                        setListBajasSocios(datosBajasSocios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionBajaSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listBajasSocios && data){
                        setListBajasSocios(formatModelBajaSocios(data));
                    } else {
                        const datosBajasSocios = formatModelBajaSocios(data);
                        setListBajasSocios(datosBajasSocios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);


    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={8} className="titulo">
                        <h1 className="font-bold">
                            Baja de socios
                        </h1>
                    </Col>
                    
                    
                    
                    <Col xs={6} md={4}>
                        <Col align="right">
                            <Button
                                className="btnRegistro"
                                onClick={() => {
                                    registroSocios(
                                        <RegistroBajaSocios
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una baja de socios
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Alert>

            {
                listBajasSocios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListBajaSocios
                                    listBajasSocios={listBajasSocios}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalBajasSocios={noTotalBajasSocios}
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

function formatModelBajaSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: parseInt(data.fichaSocio),
            tipo: data.tipo,
            total: data.total,
            aportacion: data.aportacion,
            rendimiento: data.rendimiento,
            patrimonio: data.patrimonio,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BajaSocios);
