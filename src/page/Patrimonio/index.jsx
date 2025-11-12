import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, getPeriodo, setPeriodo } from "../../api/auth";
import Swal from "sweetalert2";
import { Alert, Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrashCan, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import { listarPatrimoniosPeriodo } from "../../api/patrimonio";
import ListPatrimonios from "../../components/Patrimonio/ListPatrimonios";
import RegistroPatrimonio from "../../components/Patrimonio/RegistroPatrimonios";
import BasicModal from "../../components/Modal/BasicModal";
import CargaMasivaPatrimonio from '../../components/Patrimonio/CargaMasivaPatrimonios';
import EliminaPatrimonioMasivo from '../../components/Patrimonio/EliminaPatrimoniosMasivo';
import RestaurarPatrimonios from '../../components/Patrimonio/RestaurarPatrimonios';
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { listarPeriodo } from '../../api/periodos';
import { map } from "lodash";

function Patrimonio(props) {
  const { setRefreshCheckLogin, location, history } = props;

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
         Swal.fire({
                        title: "Sesión expirada",
                        icon: "warning",
                        showConfirmButton: false,
                        timer: 1600,
                    });
         Swal.fire({
                        title: "Sesión cerrrada por seguridad",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
        logoutApi();
        setRefreshCheckLogin(true);
      }
    }
  }, []);
  // Termina cerrado de sesión automatico

  // Para el registro de patrimonios
  const registroPatrimonio = (content) => {
    setTitulosModal("Registro un patrimonio");
    setContentModal(content);
    setShowModal(true);
  }

  const registroPatrimonioCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  const registroPatrimonioRestaurar = (content) => {
    setTitulosModal('Restaurar')
    setContentModal(content)
    setShowModal(true)
  }

  //Para el registro de Rendimientos
  const eliminaPatrimonioMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Almacena los datos de los patrimonios
  const [listPatrimonios, setListPatrimonios] = useState(null);

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarPatrimoniosPeriodo(getRazonSocial(), getPeriodo()).then(response => {
        const { data } = response;
        // console.log(data)
        if (!listPatrimonios && data) {
          setListPatrimonios(formatModelPatrimonio(data));
        } else {
          const datosPatrimonio = formatModelPatrimonio(data);
          setListPatrimonios(datosPatrimonio)
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
            <h1 className="font-bold">Patrimonio</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>

              <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaPatrimonioMasivo(
                    <EliminaPatrimonioMasivo
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
                  registroPatrimonioCargaMasiva(
                    <CargaMasivaPatrimonio
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
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroPatrimonioRestaurar(
                    <RestaurarPatrimonios
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faWindowRestore} /> Restaurar
              </Button>

              <Button
                className="btnRegistro"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroPatrimonio(
                    <RegistroPatrimonio
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar patrimonio
              </Button>
            </div>
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
        listPatrimonios ?
          (
            <>
              <Suspense fallback={<Spinner />}>
                <ListPatrimonios
                  listPatrimonios={listPatrimonios}
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

function formatModelPatrimonio(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      patrimonio: data.patrimonio,
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

export default withRouter(Patrimonio);
