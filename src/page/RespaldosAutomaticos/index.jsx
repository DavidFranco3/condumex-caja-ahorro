import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { Alert, Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { listarAbonos } from "../../api/abonos";
import { listarAportaciones } from "../../api/aportaciones";
import { listarPatrimonio } from "../../api/patrimonio";
import { listarPrestamos } from "../../api/prestamos";
import { listarRendimientos } from "../../api/rendimientos";
import { listarRetiros } from "../../api/retiros";
import { listarBajaSocios } from "../../api/bajaSocios";
import { listarDeudaSocio } from "../../api/deudaSocio";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { exportCSVFile } from "../../utils/exportCSV";
import moment from "moment";

function RespaldosAutomaticos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Almacena la razón social, si ya fue elegida
    const [razonSocialElegida, setRazonSocialElegida] = useState("");

    useEffect(() => {
        if (getRazonSocial()) {
            setRazonSocialElegida(getRazonSocial)
        }
    }, []);

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

    const dataTitulo = [{
        total: "Total",
    }]


    // Almacena los datos de los abonos
    const [listAbonos, setListAbonos] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAbonos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listAbonos && data) {
                    setListAbonos(formatModelAbonos(data));
                } else {
                    setListAbonos(formatModelAbonos(data));
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    // Almacena los datos de los abonos
    const [listAbonos2, setListAbonos2] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAbonos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listAbonos2 && data) {
                    setListAbonos2(formatModelAbonos2(data));
                } else {
                    setListAbonos2(formatModelAbonos2(data));
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalAbonos = listAbonos.reduce((amount, item) => (amount + parseInt(item.abono)), 0);

    // Almacena los datos de los abonos
    const [listAportaciones, setListAportaciones] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAportaciones(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listAportaciones && data) {
                    setListAportaciones(formatModelAportaciones(data));
                } else {
                    const datosAportaciones = formatModelAportaciones(data);
                    setListAportaciones(datosAportaciones)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalAportaciones = listAportaciones.reduce((amount, item) => (amount + parseInt(item.aportacion)), 0);

    // Almacena los datos de los abonos
    const [listPatrimonio, setListPatrimonio] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPatrimonio(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listPatrimonio && data) {
                    setListPatrimonio(formatModelPatrimonio(data));
                } else {
                    const datosPatrimonio = formatModelPatrimonio(data);
                    setListPatrimonio(datosPatrimonio)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalPatrimonio = listPatrimonio.reduce((amount, item) => (amount + parseInt(item.patrimonio)), 0);

    // Almacena los datos de los abonos
    const [listPrestamos, setListPrestamos] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPrestamos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listPrestamos && data) {
                    setListPrestamos(formatModelPrestamos(data));
                } else {
                    const datosPrestamos = formatModelPrestamos(data);
                    setListPrestamos(datosPrestamos)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    // Almacena los datos de los abonos
    const [listPrestamos2, setListPrestamos2] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPrestamos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listPrestamos2 && data) {
                    setListPrestamos2(formatModelPrestamos2(data));
                } else {
                    const datosPrestamos = formatModelPrestamos2(data);
                    setListPrestamos2(datosPrestamos)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalPrestamos = listPrestamos.reduce((amount, item) => (amount + parseInt(item.prestamo)), 0);

    // Almacena los datos de los abonos
    const [listRendimientos, setListRendimientos] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarRendimientos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listRendimientos && data) {
                    setListRendimientos(formatModelRendimientos(data));
                } else {
                    const datosRendimientos = formatModelRendimientos(data);
                    setListRendimientos(datosRendimientos)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalRendimiento = listRendimientos.reduce((amount, item) => (amount + parseInt(item.rendimiento)), 0);

    // Almacena los datos de los abonos
    const [listRetiros, setListRetiros] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarRetiros(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listRetiros && data) {
                    setListRetiros(formatModelRetiros(data));
                } else {
                    const datosRetiros = formatModelRetiros(data);
                    setListRetiros(datosRetiros)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalRetiros = listRetiros.reduce((amount, item) => (amount + parseInt(item.retiro)), 0);

    // Almacena los datos de los abonos
    const [listBajaSocios, setListBajaSocios] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarBajaSocios(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listBajaSocios && data) {
                    setListBajaSocios(formatModelBajaSocios(data));
                } else {
                    const datosBajaSocios = formatModelBajaSocios(data);
                    setListBajaSocios(datosBajaSocios)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const totalBajasSocios = listBajaSocios.reduce((amount, item) => (amount + parseInt(item.total)), 0);

    // Almacena los datos de los abonos
    const [listDeudaSocios, setListDeudaSocios] = useState([]);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarDeudaSocio(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listDeudaSocios && data) {
                    setListDeudaSocios(formatModelDeudaSocio(data));
                } else {
                    const datosDeudaSocios = formatModelDeudaSocio(data);
                    setListDeudaSocios(datosDeudaSocios)
                }
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);

    const generacionCSVAbonos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalAbonos }])
                const datosTemp = listAbonos.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_ABONOS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVAportaciones = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalAportaciones }])
                const datosTemp = listAportaciones.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_APORTACIONES_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVPatrimonios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalPatrimonio }])
                const datosTemp = listPatrimonio.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_PATRIMONIOS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVPrestamos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalPrestamos }])
                const datosTemp = listPrestamos.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_PRESTAMOS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVRendimientos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalRendimiento }])
                const datosTemp = listRendimientos.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_INTERESES_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVRetiros = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalRetiros }])
                const datosTemp = listRetiros.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_RETIROS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const generacionCSVBajaSocios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalBajasSocios }])
                const datosTemp = listBajaSocios.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_BAJA_SOCIOS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const listSaldosSocios = listPrestamos2.concat(listAbonos2);

    const listInteresesSinDuplicados = listSaldosSocios.reduce((acumulador, valorActual) => {
        const elementoExistente = acumulador.find(elemento => elemento.fichaSocio === valorActual.fichaSocio);

        if (elementoExistente) {
            return acumulador.map(elemento => {
                if (elemento.fichaSocio === valorActual.fichaSocio) {
                    return {
                        ...elemento,
                        prestamoTotal: elemento.prestamoTotal + valorActual.prestamoTotal,
                        abono: elemento.abono + valorActual.abono,
                        saldoDeudor: (elemento.prestamoTotal + valorActual.prestamoTotal) - (elemento.abono + valorActual.abono)

                    };
                }

                return elemento;
            });
        }

        return [...acumulador, valorActual];
    }, []);
    console.log(listPrestamos2)
    console.log(listAbonos2)
    console.log(listInteresesSinDuplicados)

    const totalDeudaSocios = listInteresesSinDuplicados.reduce((amount, item) => (amount + parseInt(item.saldoActual)), 0);

    const generacionCSVDeudaSocios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            const timer = setTimeout(() => {
                const dataConcatTitulos = dataTitulo.concat([{ totalDeudaSocios }])
                const datosTemp = listInteresesSinDuplicados.concat(dataConcatTitulos)
                exportCSVFile(datosTemp, "LISTA_DEUDA_SOCIOS_" + formData.inicio + "_" + formData.fin);
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Respaldos automaticos
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <Form onChange={onChange}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridFechaInicio">
                                    <Form.Label>
                                        Inicio del rango:
                                    </Form.Label>
                                    <Form.Control
                                        className="mb-3"
                                        type="date"
                                        defaultValue={formData.inicio}
                                        placeholder="Inicio"
                                        name="inicio"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridFechaFin">
                                    <Form.Label>
                                        Fin del rango:
                                    </Form.Label>
                                    <Form.Control
                                        className="mb-3"
                                        type="date"
                                        defaultValue={formData.fin}
                                        placeholder="Fin"
                                        name="fin"
                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Alert>

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Abonos
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVAbonos()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Aportaciones
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVAportaciones()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            {
                razonSocialElegida === "Asociación de Empleados Sector Cables A.C." &&
                (
                    <>
                        <Alert className="fondoPrincipalAlert">
                            <Row>
                                <Col xs={12} md={4} className="titulo">
                                    <h1 className="font-bold">
                                        Patrimonio
                                    </h1>
                                </Col>
                                <Col xs={6} md={8}>
                                    <div style={{ float: 'right' }}>
                                        <Button
                                            className="btnMasivo"
                                            style={{ marginRight: '10px' }}
                                            disabled={formData.inicio == "" || formData.fin == ""}
                                            onClick={() => {
                                                generacionCSVPatrimonios()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Alert>
                    </>
                )
            }

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Prestamos
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVPrestamos()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Intereses
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVRendimientos()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

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
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVRetiros()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Bajas de socios
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVBajaSocios()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">
                            Deudas de los socios
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                className="btnMasivo"
                                style={{ marginRight: '10px' }}
                                disabled={formData.inicio == "" || formData.fin == ""}
                                onClick={() => {
                                    generacionCSVDeudaSocios()
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>
        </>
    );
}

function formatModelAbonos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            abono: data.abono.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelAbonos2(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            prestamoTotal: 0,
            abono: parseFloat(data.abono.toFixed(2)),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelPrestamos2(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            prestamoTotal: parseFloat(data.prestamoTotal.toFixed(2)),
            abono: 0,
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelAportaciones(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            aportacion: data.aportacion.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelPatrimonio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            patrimonio: data.patrimonio.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelPrestamos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            prestamoTotal: data.prestamoTotal.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelRendimientos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            rendimiento: data.rendimiento.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelRetiros(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            retiro: data.retiro.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelBajaSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            total: data.total.toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function formatModelDeudaSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            saldoActual: parseFloat(data.prestamoTotal - data.abonoTotal).toFixed(2),
            fechaCreacion: data.createdAt
        });
    });
    return dataTemp;
}

function initialFormData(data) {
    return {
        inicio: "",
        fin: ""
    }

}

export default withRouter(RespaldosAutomaticos);
