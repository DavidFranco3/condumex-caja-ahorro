import { useState, useEffect } from 'react';
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial } from "../../api/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../assets/json/loading.json"
import SaldosEmpleados from "../SaldosEmpleados";
import SaldosSindicalizados from "../SaldosSindicalizados";
import SaldosSociosEspeciales from "../SaldosSociosEspeciales";

function Saldos(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Recuperación de la razón social seleccionada
    const [razonSocialElegida, setRazonSocialElegida] = useState("Sin Selección");

    useEffect(() => {
        if(getRazonSocial()) {
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
                            Saldos de los socios
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        {/* Detalles */}
                    </Col>
                </Row>
            </Alert>

            {/* Inicia estructura base para separación de razones sociales */}
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )
                    :
                    (
                        razonSocialElegida === "Asociación de Empleados Sector Cables A.C." ?
                            (
                                <>
                                    {/* Inicia empleados */}
                                    <SaldosEmpleados
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                    />
                                    {/* Termina empleados*/}
                                </>
                            )
                            :
                            (
                                razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." ?
                                    (
                                        <>
                                            {/* Inicia sindicalizados */}
                                            <SaldosSindicalizados
                                                setRefreshCheckLogin={setRefreshCheckLogin}
                                            />
                                            {/* Termina sindicalizados */}
                                        </>
                                    )
                                    :
                                    (
                                        razonSocialElegida === "CONDUMEX S.A. DE C.V." ?
                                            (
                                                <>
                                                    {/* Inicia especiales */}
                                                    <SaldosSociosEspeciales
                                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                                    />
                                                    {/* Termina especiales */}
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
                                    )
                            )
                    )
            }
            {/* Termina estructura base para separación de razones sociales */}

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default withRouter(Saldos);
