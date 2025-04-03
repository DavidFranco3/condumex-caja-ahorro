import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { listarPaginacionParametros, listarParametros, totalParametros } from "../../api/parametros";
import ListAjusteParametros from "../../components/AjusteParametros/ListAjusteParametros";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroAjusteParametros from "../../components/AjusteParametros/RegistroAjusteParametros";
import DatePicker from "react-datepicker";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function AjusteParametros(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [totalSocios, setTotalSocios] = useState(0);

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

    // Para almacenar el listado de ajuste de parametros
    const [listadoParametrosSistemas, setListadoParametrosSistemas] = useState(null);

    useEffect(() => {
        try {
            listarParametros().then(response => {
                const { data } = response;
                if (!data) {
                    setCamposHabilitados(false)
                } else {
                    setCamposHabilitados(true)
                }
                if (!listadoParametrosSistemas && data) {
                    setListadoParametrosSistemas(formatModelAjusteParametros(data));
                } else {
                    const datosAjusteParametros = formatModelAjusteParametros(data);
                    setListadoParametrosSistemas(datosAjusteParametros)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para definir si los campos del formulario deben estar habilitados o deshabilitados
    const [camposHabilitados, setCamposHabilitados] = useState(true);

    // Recuperación de la razón social seleccionada
    const [razonSocialElegida, setRazonSocialElegida] = useState("Sin Selección");

    useEffect(() => {
        if (getRazonSocial()) {
            setRazonSocialElegida(getRazonSocial)
        } else {
            setRazonSocialElegida("Sin Selección")
        }
    }, []);
    // Termina recuperación de la razón social recuperada

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
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={8} className="titulo">
                        <h1 className="font-bold">
                            Ajuste de parámetros
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        {/**/}
                    </Col>
                </Row>
            </Alert>
            {
                listadoParametrosSistemas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAjusteParametros
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listAjusteParametros={listadoParametrosSistemas}
                                    history={history}
                                    location={location}
                                    camposHabilitados={camposHabilitados}
                                    setCamposHabilitados={setCamposHabilitados}
                                    razonSocialElegida={razonSocialElegida}
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

function formatModelAjusteParametros(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,

            inicioPeriodoEmpleados: data.inicioPeriodoEmpleados,
            finPeriodoEmpleados: data.finPeriodoEmpleados,
            fechaEnvioEstadosCuentaEmpleados: data.fechaEnvioEstadosCuentaEmpleados,
            fechaAporteEmpleados: data.fechaAporteEmpleados,

            inicioPeriodoSindicalizados: data.inicioPeriodoSindicalizados,
            finPeriodoSindicalizados: data.finPeriodoSindicalizados,
            fechaEnvioEstadosCuentaSindicalizados: data.fechaEnvioEstadosCuentaSindicalizados,
            fechaAporteSindicalizados: data.fechaAporteSindicalizados,

            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(AjusteParametros);
