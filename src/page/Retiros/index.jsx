import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionRetiros,
    listarPaginacionRetirosxTipo,
    totalRetiros,
    totalxTipoRetiros
} from "../../api/retiros";
import ListRetiros from "../../components/Retiros/ListRetiros";
import BasicModal from "../../components/Modal/BasicModal";
import CargaMasivaRetiros from '../../components/Retiros/CargaMasivaRetiros';
import RegistroRetiros from "../../components/Retiros/RegistroRetiros";
import EliminaRetiroMasivo from '../../components/Retiros/EliminaRetiroMasivo';
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function Retiros(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalRetiros, setNoTotalRetiros] = useState(0);

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

    // Almacena el listado de retiros
    const [listRetiros, setListRetiros] = useState(null);

    useEffect(() => {
        try {
            totalxTipoRetiros(getRazonSocial()).then(response => {
                const { data } = response;
                setNoTotalRetiros(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            // listarPaginacionPrestamos(page, rowsPerPage)
            if(page === 0) {
                setPage(1)
                listarPaginacionRetirosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listRetiros && data){
                        setListRetiros(formatModelRetiros(data));
                    } else {
                        const datosRetiros = formatModelRetiros(data);
                        setListRetiros(datosRetiros)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionRetirosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listRetiros && data){
                        setListRetiros(formatModelRetiros(data));
                    } else {
                        const datosRetiros = formatModelRetiros(data);
                        setListRetiros(datosRetiros)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para el registro manual de retiros
    const registroRetiros = (content) => {
        setTitulosModal("Registrar un retiro");
        setContentModal(content);
        setShowModal(true);
    }
    
    //Para el registro de Rendimientos
    const eliminaRetiroMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }
  
    const registroRetirosCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Retiros
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                    <div style={{ float: 'right' }}>           
             <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaRetiroMasivo(
                    <EliminaRetiroMasivo
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
                                    registroRetirosCargaMasiva(
                                    <CargaMasivaRetiros
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
                                    onClick={() => {
                                        registroRetiros(
                                            <RegistroRetiros
                                                setShowModal={setShowModal}
                                                location={location}
                                                history={history}
                                            />
                                        )
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCirclePlus} /> Registrar retiro
                                </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            {
                listRetiros ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListRetiros
                                    listRetiros={listRetiros}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalRetiros={noTotalRetiros}
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

function formatModelRetiros(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: parseInt(data.fichaSocio),
            tipo: data.tipo,
            retiro: data.retiro,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Retiros);
