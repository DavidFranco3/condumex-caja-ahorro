import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json"
import "./SaldosSociosEspeciales.scss"
import {listarPaginacionSaldoSociosxTipo, totalxTipoSaldosSocios} from "../../api/saldosSocios";
import {Spinner} from "react-bootstrap";
import ListSaldos from "../../components/Saldos/ListSaldos";

function SaldosSociosEspeciales(props) {
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

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalSaldosSociosEspeciales, setTotalSaldosSociosEspeciales] = useState(0);

    // Para almacenar el listado de socios especiales
    const [listSaldosSociosEspeciales, setListSaldosSociosEspeciales] = useState(0);

    useEffect(() => {
        try {
            // Obten el total de registros de saldos de socios empleados
            totalxTipoSaldosSocios(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                setTotalSaldosSociosEspeciales(data)
            }).catch(e => {
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
                // console.log(e)
            })

            // Obten el listado de socios empleados
            if(page === 0) {
                setPage(1)
                listarPaginacionSaldoSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listSaldosSociosEspeciales && data){
                        setListSaldosSociosEspeciales(formatModelSaldosSocios(data));
                    } else {
                        const datos = formatModelSaldosSocios(data);
                        setListSaldosSociosEspeciales(datos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionSaldoSociosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(!listSaldosSociosEspeciales && data){
                        setListSaldosSociosEspeciales(formatModelSaldosSocios(data));
                    } else {
                        const datos = formatModelSaldosSocios(data);
                        setListSaldosSociosEspeciales(datos)
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
            {
                listSaldosSociosEspeciales ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListSaldos
                                    listSaldosSocios={listSaldosSociosEspeciales}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    totalSaldosSocios={totalSaldosSociosEspeciales}
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
        </>
    );
}

function formatModelSaldosSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: data.fichaSocio,
            capital: data.capital,
            prestamo: data.prestamo,
            patrimonio: data.patrimonio,
            folioMovimiento: data.folioMovimiento,
            movimiento: data.movimiento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(SaldosSociosEspeciales);
