import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { listarPaginacionSocioSindizalizado, totalRegistrosSocioSindicalizado } from "../../api/sociosSindicalizados";
import { toast } from "react-toastify";
import { listarPaginacionSocioEspecial, totalRegistroSocioEspecial } from "../../api/sociosEspeciales";
import ListSociosEspeciales from "../../components/SociosEspeciales/ListSociosEspeciales";
import RegistroSociosEspeciales from "../../components/SociosEspeciales/RegistroSociosEspeciales";
//import EliminaSociosEspecialesMasivo from "../../components/SociosEspeciales/EliminaSociosEspecialesMasivo";
import CargaMasivaSociosEspeciales from "../../components/SociosEspeciales/CargaMasivaSociosEspeciales";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../assets/json/loading.json";

function SociosEspeciales(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro de socios
    const registroSocios = (content) => {
        setTitulosModal("Registrando Socio");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la carga masiva de socios
    const registroMasivoSociosEspeciales = (content) => {
        setTitulosModal("Registro masivo de socios");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la carga masiva de socios
    const eliminaMasivoSociosEspeciales = (content) => {
        setTitulosModal("Elimina elementos");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalSociosEspeciales, setTotalSociosEspeciales] = useState(0);

    // Para almacenar el listado de socios
    const [listSociosEspeciales, setListSociosEspeciales] = useState(null);

    useEffect(() => {
        try {
            totalRegistroSocioEspecial().then(response => {
                const { data } = response
                //console.log(data)
                setTotalSociosEspeciales(data)
            }).catch(e => {
                // console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if (page === 0) {
                setPage(1)
                listarPaginacionSocioEspecial(page, rowsPerPage).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if (!listSociosEspeciales && data) {
                        setListSociosEspeciales(formatModelSocios(data));
                    } else {
                        const datosSocios = formatModelSocios(data);
                        setListSociosEspeciales(datosSocios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionSocioEspecial(page, rowsPerPage).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if (!listSociosEspeciales && data) {
                        setListSociosEspeciales(formatModelSocios(data));
                    } else {
                        const datosSocios = formatModelSocios(data);
                        setListSociosEspeciales(datosSocios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
            // console.log("Pagina ", page, " ", " Por pagina ", rowsPerPage)


        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Configuracion de la animacion
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: AnimacionLoading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
            <Row>
                <Col xs={12} md={4} className="titulo">
                </Col>
                <Col xs={6} md={8}>
                    <div style={{ float: 'right' }}>

                        <Button
                            className="btnMasivo"
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                                eliminaMasivoSociosEspeciales(
                                    <EliminaSociosEspecialesMasivo
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
                                registroMasivoSociosSindicalizados(
                                    <CargaMasivaSociosEspeciales
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
                                    <RegistroSociosEspeciales
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

            {
                listSociosEspeciales ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListSociosEspeciales
                                    listSocios={listSociosEspeciales}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    totalSocios={totalSociosEspeciales}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
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

export default withRouter(SociosEspeciales);
