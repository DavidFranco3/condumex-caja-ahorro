import { useState, useEffect } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import 'react-tabs/style/react-tabs.css';
import { toast } from "react-toastify";
import BasicModal from "../../components/Modal/BasicModal";
import Empleados from "../Empleados";
import Sindicalizados from "../Sindicalizados";
import SociosEspeciales from "../SociosEspeciales";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../assets/json/loading.json";
import "./Socios.scss"

function Socios(props) {
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
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            {/*<Lottie
                                options={defaultOptionsLoading}
                                height={200}
                                width={200}
                            />*/}
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
                                    {/* Empleados */}
                                    <Empleados
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                    />
                                </>
                            )
                            :
                            (
                                razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." ?
                                    (
                                        <>
                                            {/* Sindicalizados */}
                                            <Sindicalizados
                                                setRefreshCheckLogin={setRefreshCheckLogin}
                                            />
                                        </>
                                    )
                                    :
                                    (
                                        razonSocialElegida === "CONDUMEX S.A. DE C.V." ?
                                            (
                                                <>
                                                    {/* Especiales */}
                                                    <SociosEspeciales
                                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                                    />
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

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>

        </>
    );
}

export default withRouter(Socios);
