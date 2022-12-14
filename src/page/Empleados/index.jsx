import { useState, useEffect, Suspense } from 'react';
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan, faFileExcel} from "@fortawesome/free-solid-svg-icons";
import {listarPaginacionSociosEmpleados,
    totalRegistrosSociosEmpleados,
    listarSociosEmpleados}
from "../../api/sociosEmpleados";
import ListSociosEmpleados from "../../components/SociosEmpleados/ListSociosEmpleados";
import {toast} from "react-toastify";
import RegistroSociosEmpleados from "../../components/SociosEmpleados/RegistroSociosEmpleados";
import CargaMasivaSociosEmpleados from "../../components/SociosEmpleados/CargaMasivaSociosEmpleados";
import EliminaSociosEmpleadosMasivo from "../../components/SociosEmpleados/EliminaSociosEmpleadosMasivo";
import BasicModal from "../../components/Modal/BasicModal";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import {exportCSVFile} from "../../utils/exportCSV";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


  return date.toISOString().slice(0, 16);
}

function Empleados(props) {
    const { setRefreshCheckLogin, location, history } = props;
    
    // Almacena los datos de los abonos
    const [listSociosCSV, setListSociosCSV] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarSociosEmpleados().then(response => {
                const { data } = response;
                // console.log(data)
                if(!listSociosCSV && data){
                        setListSociosCSV(formatModelSocios2(data));
                    } else {
                        const datosSocios = formatModelSocios2(data);
                        setListSociosCSV(datosSocios)
                    }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);
    
    const generacionCSV = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listSociosCSV, "LISTA_SOCIOS_EMPLEADOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    // Cerrado de sesi??n automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesi??n expirada");
                toast.success("Sesi??n cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesi??n automatico

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginaci??n
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalSociosEmpleados, setTotalSociosEmpleados] = useState(0);

    // Para el registro de socios
    const registroSocios = (content) => {
        setTitulosModal("Registrando Socio");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la carga masiva de socios
    const registroMasivoSociosEmpleados = (content) => {
        setTitulosModal("Registro masivo de socios");
        setContentModal(content);
        setShowModal(true);
    }
    
    // Para la carga masiva de socios
    const eliminaMasivoSociosEmpleados = (content) => {
        setTitulosModal("Elimina elementos");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar el listado de socios
    const [listSociosEmpleados, setListSociosEmpleados] = useState(null);

    useEffect(() => {
        try {
            totalRegistrosSociosEmpleados().then(response => {
                const { data } = response
                //console.log(data)
                setTotalSociosEmpleados(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexi??n al servidor no disponible");
                }
            })

            if(page === 0){
                setPage(1)
                listarPaginacionSociosEmpleados(page, rowsPerPage).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listSociosEmpleados && data){
                        setListSociosEmpleados(formatModelSocios(data));
                    } else {
                        const datosSocios = formatModelSocios(data);
                        setListSociosEmpleados(datosSocios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionSociosEmpleados(page, rowsPerPage).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listSociosEmpleados && data){
                        setListSociosEmpleados(formatModelSocios(data));
                    } else {
                        const datosSocios = formatModelSocios(data);
                        setListSociosEmpleados(datosSocios)
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
          <Col xs={12} md={4} className="titulo">
          <h1 className="font-bold">Empleados</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
            
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                generacionCSV()
                }}
                >
                <FontAwesomeIcon icon={faFileExcel}/> Descargar CSV
            </Button>
            
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaMasivoSociosEmpleados(
                    <EliminaSociosEmpleadosMasivo
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
                  registroMasivoSociosEmpleados(
                    <CargaMasivaSociosEmpleados
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registro Masivo
              </Button>
              <Button
                className="btnRegistro"
                onClick={() => {
                   registroSocios(
                      <RegistroSociosEmpleados
                         setShowModal={setShowModal}
                         location={location}
                          history={history}
                          />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar socio
              </Button>
            </div>
          </Col>
        </Row>
     </Alert>

                {
                    listSociosEmpleados ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListSociosEmpleados
                                        listSocios={listSociosEmpleados}
                                        history={history}
                                        location={location}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        totalSocios={totalSociosEmpleados}
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

function formatModelSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            ficha: parseInt(data.ficha),
            nombre: data.nombre,
            tipo: data.tipo,
            correo: data.correo ? data.correo : "No especificado",
            estado: data.estado === "true" ? "Activo" : "Inactivo",
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelSocios2(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            ficha: parseInt(data.ficha),
            nombre: data.nombre,
            correo: data.correo ? data.correo : "No especificado",
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

export default withRouter(Empleados);
