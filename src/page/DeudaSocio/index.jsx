import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ListDeudaSocio from '../../components/DeudaSocio/ListDeudaSocio';
import { listarPrestamoPeriodo } from "../../api/prestamos";
import { listarAbonosPeriodo } from '../../api/abonos';
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import EliminaDeudaSocioMasivo from '../../components/DeudaSocio/EliminaDeudaSocioMasivo';
import { listarPeriodo } from '../../api/periodos';
import { map } from "lodash";

function DeudaSocio(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para el registro de Rendimientos
    const eliminaDeudaSocioMasivo = (content) => {
        setTitulosModal('Eliminar elementos')
        setContentModal(content)
        setShowModal(true)
    }

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


   // Almacena los datos de los abonos
   const [listPrestamosSocios, setListPrestamosSocios] = useState(null);

   useEffect(() => {
       try {
           // Inicia listado de detalles de los articulos vendidos
           listarPrestamoPeriodo(getRazonSocial(), getPeriodo()).then(response => {
               const { data } = response;
               // console.log(data)
               if (!listPrestamosSocios && data) {
                   setListPrestamosSocios(formatModelPrestamosSocios(data));
               } else {
                   const datosPrestamosSocios = formatModelPrestamosSocios(data);
                   setListPrestamosSocios(datosPrestamosSocios)
               }
           }).catch(e => {
               console.log(e)
           })
       } catch (e) {
           console.log(e)
       }
   }, [location]);

    // Almacena los datos de los abonos
    const [listAbonosSocios, setListAbonosSocios] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAbonosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listAbonosSocios && data) {
                    setListAbonosSocios(formatModelAbonosSocios(data));
                } else {
                    const datosAbonosSocios = formatModelAbonosSocios(data);
                    setListAbonosSocios(datosAbonosSocios)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para almacenar las sucursales registradas
    const [periodosRegistrados, setPeriodosRegistrados] = useState(null);

    const cargarListaPeriodos = () => {
        try {
            listarPeriodo(getRazonSocial()).then(response => {
                const { data } = response;
                //console.log(data)
                const dataTemp = formatModelPeriodos(data);
                //console.log(data)
                setPeriodosRegistrados(dataTemp);
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        cargarListaPeriodos();
    }, []);

    // Almacena la razón social, si ya fue elegida
    const [periodoElegido, setPeriodoElegido] = useState("");

    // Para almacenar en localstorage la razon social
    const almacenaPeriodo = (periodo) => {
        if (periodo != "Elige una opción") {
            setPeriodo(periodo)
        }
        window.location.reload()
    }

    const guardarPeriodoElegido = () => {
        if (getPeriodo()) {
            setPeriodoElegido(getPeriodo)
        }
    }

    useEffect(() => {
        guardarPeriodoElegido();
    }, []);

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Deudas de socios</h1>
                    </Col>
                </Row>
            </Alert>

            <Row>
                <Col xs={6} md={4}>

                </Col>
                <Col xs={6} md={4}>
                    <Form.Control
                        as="select"
                        aria-label="indicadorPeriodo"
                        name="periodo"
                        className="periodo"
                        defaultValue={periodoElegido}
                        onChange={(e) => {
                            almacenaPeriodo(e.target.value)
                        }}
                    >
                        <option>Elige una opción</option>
                        {map(periodosRegistrados, (periodo, index) => (
                            <option key={index} value={periodo?.folio} selected={periodoElegido == periodo?.folio}>{periodo?.nombre}</option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>

            {
                listPrestamosSocios && listAbonosSocios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListDeudaSocio
                                    listAbonos={listAbonosSocios}
                                    listPrestamos={listPrestamosSocios}
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

function formatModelDeudaSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            abonoTotal: data.abonoTotal,
            prestamoTotal: data.prestamoTotal,
            saldoActual: parseFloat(data.prestamoTotal - data.abonoTotal),
            movimiento: data.movimiento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelPrestamosSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: String(data.fichaSocio),
            prestamo: data.prestamo,
            abono: 0,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelAbonosSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: String(data.fichaSocio),
            prestamo: 0,
            abono: data.abono,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelPeriodos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
      dataTemp.push({
        id: data._id,
        folio: data.folio,
        nombre: data.nombre,
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaCierre: data.fechaCierre,
        fechaRegistro: data.createdAt,
        fechaActualizacion: data.updatedAt
      });
    });
    return dataTemp;
  }

export default withRouter(DeudaSocio);
