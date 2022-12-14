import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionAbonos,
    listarPaginacionAbonosxTipo,
    totalAbonos,
    totalxTipoAbonos,
    listarAbonos2
} from "../../api/abonos";
import ListAbonos from "../../components/Abonos/ListAbonos";
import BasicModal from "../../components/Modal/BasicModal";
import EliminaAbonosMasivo from '../../components/Abonos/EliminaAbonosMasivo';
import CargaMasivaAbonos from '../../components/Abonos/CargaMasivaAbonos'
import RegistroAbonos from "../../components/Abonos/RegistroAbonos";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import {map} from "lodash";

function Abonos(props) {
    const { datos, setRefreshCheckLogin, location, history } = props;
    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalAbonos, setNoTotalAbonos] = useState(0);
    
    //Para el registro de Rendimientos
    const eliminaAbonosMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
    }
    
    const registroAbonosCargaMasiva = (content) => {
        setTitulosModal('Carga masiva')
        setContentModal(content)
        setShowModal(true)
    }
    
    // Para la lista de abonos
    const registroAbonos = (content) => {
        setTitulosModal("Registrar un abono");
        setContentModal(content);
        setShowModal(true);
    }

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


    // Almacena los datos de los abonos
    const [listAbonos, setListAbonos] = useState(null);

    useEffect(() => {
        try {
            totalxTipoAbonos(getRazonSocial()).then(response => {
                const { data } = response;
                setNoTotalAbonos(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if(page === 0) {
                setPage(1)
                listarPaginacionAbonosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listAbonos && data){
                        setListAbonos(formatModelAbonos(data));
                    } else {
                        const datosAbonos = formatModelAbonos(data);
                        setListAbonos(datosAbonos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionAbonosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listAbonos && data){
                        setListAbonos(formatModelAbonos(data));
                    } else {
                        const datosAbonos = formatModelAbonos(data);
                        setListAbonos(datosAbonos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);
    
    // Almacena los datos de los abonos
    const [listAbonos2, setListAbonos2] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAbonos2(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listAbonos2 && data){
                        setListAbonos2(formatModelAbonos2(data));
                    } else {
                        const datosAbonos = formatModelAbonos2(data);
                        setListAbonos2(datosAbonos)
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
        map(listAbonos2, (abono, index) => {
            const tempFicha = abono.fichaSocio.split("T");
            listaFichasTemp.push(tempFicha[0])
        })
        setListaFichas(listaFichasTemp);
    }, [listAbonos2]);
    
     const [listaAbonos2, setListaAbonos2] = useState([]);

    useEffect(() => {
        
        let listaAbonosTemp = [];
        map(listAbonos2, (abono, index) => {
            const tempAbono = abono.abono.split("T");
            listaAbonosTemp.push(tempAbono[0])
        })
        setListaAbonos2(listaAbonosTemp);
    }, [listAbonos2]);
    
     const [listaFechas, setListaFechas] = useState([]);

    useEffect(() => {
        
        let listaFechasTemp = [];
        map(listAbonos2, (prestamo, index) => {
            const tempFecha = prestamo.fechaCreacion.split("T");
            listaFechasTemp.push(tempFecha[0])
        })
        setListaFechas(listaFechasTemp);
    }, [listAbonos2]);
    
    console.log(listaFechas)

    return (
        <>
<Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Abonos</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
            
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaAbonosMasivo(
                    <EliminaAbonosMasivo
                      listaFichas={listaFichas}
                      listaAbonos2={listaAbonos2}
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
                  registroAbonosCargaMasiva(
                    <CargaMasivaAbonos
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
                   registroAbonos(
                      <RegistroAbonos
                         setShowModal={setShowModal}
                         location={location}
                          history={history}
                          />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar abono
              </Button>
            </div>
          </Col>
        </Row>
      </Alert>


            {
                listAbonos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAbonos
                                    listAbonos={listAbonos}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalAbonos={noTotalAbonos}
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

function formatModelAbonos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: parseInt(data.fichaSocio),
            tipo: data.tipo,
            abono: data.abono,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelAbonos2(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            abono: String(data.abono),
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Abonos);
