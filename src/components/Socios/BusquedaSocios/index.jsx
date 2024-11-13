import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, Container } from 'react-bootstrap';
import moment from "moment";
import 'moment/locale/es';
import './BusquedaSocios.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import {
  obtenerDatosSocioEmpleado,
  obtenerEmpleadosPorNombre,
} from '../../../api/sociosEmpleados'
import {
  obtenerDatosSocioSindicalizado,
  obtenerSociosSindicalizadosByNombre,
} from '../../../api/sociosSindicalizados'
import {
  obtenerDatosSocioEspecial,
  obtenerSociosEspecialesByNombre,
} from '../../../api/sociosEspeciales'
import { getRazonSocial } from '../../../api/auth'
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";

function BusquedaSocios(props) {
  const {
    setShowModal,
    setFichaSocioElegido,
    setNombreSocioElegido,
    setIdSocioElegido,
    setCorreoSocioElegido,
  } = props

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  // Para almacenar los datos de la busqueda
  const [formData, setFormData] = useState(initialFormValue())

  // Almacenar el listado de socios encontrados
  const [listSociosEncontrados, setListSociosEncontrados] = useState(null)

  // Para cancelar la búsqueda
  const cancelarBusqueda = () => {
    setShowModal(false)
  }

  // Para eliminar los datos del socio encontrado
  const eliminaDatosBusqueda = () => {
    setListSociosEncontrados(null)
    setFichaSocioElegido('')
    setNombreSocioElegido('')
  }

  // Gestionar el socio seleccionado
  const socioSeleccionado = ({ id, ficha, nombre, correo }) => {
    // Almacena id, ficha y nombre del socio elegido
    setIdSocioElegido(id)
    setFichaSocioElegido(ficha)
    setNombreSocioElegido(nombre)

    setCorreoSocioElegido && setCorreoSocioElegido(correo)

    setListSociosEncontrados(null)
    cancelarBusqueda()
  }

  // Validar listado de socios encontrados
  const validarListadoSocios = (listSocios) => {
    if (listSocios.length === 0) {
      toast.error('No se encontraron socios con los datos ingresados')
    }
    setListSociosEncontrados(formatModelSocios(listSocios))
  }

  // Obtener empleado por ficha
  const obtenerEmpleadoPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioEmpleado(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener empleado por nombre
  const obtenerEmpleadoPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerEmpleadosPorNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener sindicalizado por ficha
  const obtenerSindicalizadoPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioSindicalizado(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener sindicalizado por nombre
  const obtenerSindicalizadoPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerSociosSindicalizadosByNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener especial por ficha
  const obtenerEspecialPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioEspecial(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener especial por nombre
  const obtenerEspecialPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerSociosEspecialesByNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  const loadListadoEmpleados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
      setLoading(false)
    } else if (tipo === 'ficha') {
      obtenerEmpleadoPorFicha(ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerEmpleadoPorNombre(nombre)
    }
  }

  const loadListadoSindicalizados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
    } else if (tipo === 'ficha') {
      obtenerSindicalizadoPorFicha(formData.ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerSindicalizadoPorNombre(nombre)
    }
  }

  const loadListadoEspeciales = () => {
    const { nombre, tipo, ficha } = formData

    // Búsqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
    } else if (tipo === 'ficha') {
      obtenerEspecialPorFicha(ficha)
    }

    // Búsqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerEspecialPorNombre(nombre)
    }
  }

  // Busqueda y Gestión del socio encontrado
  const onSubmit = (evt) => {
    evt.preventDefault()
    setLoading(true)

    // Si son empleados
    if (getRazonSocial() === 'Asociación de Empleados Sector Cables A.C.') {
      loadListadoEmpleados()
    }

    // Si son sindicalizados
    if (
      getRazonSocial() ===
      'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
    ) {
      loadListadoSindicalizados()
    }

    // Si son especiales, contabilidad y peregrinación
    if (getRazonSocial() === 'CONDUMEX S.A. DE C.V.') {
      loadListadoEspeciales()
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const columns = [
    {
      name: "Ficha",
      selector: row => row.ficha,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Correo",
      selector: row => row.correo,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Fecha de afiliación",
      sortable: false,
      center: true,
      reorder: false,
      selector: row => moment(row.fechaCreacion).format('LL')
    },
    {
      name: "Seleccionar",
      selector: row => (
        <>
          <FontAwesomeIcon
            className="eleccionSocio"
            icon={faCircleCheck}
            onClick={() => {
              socioSeleccionado(row)
            }}
          />
        </>
      ),
      sortable: false,
      center: true,
      reorder: false
    },
  ];

  // Configurando animacion de carga
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);


  useEffect(() => {
      const timeout = setTimeout(() => {
          setRows(listSociosEncontrados);
          setPending(false);
      }, 0);
      return () => clearTimeout(timeout);
  }, []);

  const paginationComponentOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de'
  };

  const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

  return (
    <>
      {listSociosEncontrados ? (
        <>
          <div className="listadoSociosEncontrados">
            <Row>
              <h3>Socios encontrados</h3>
              <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listSociosEncontrados}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>
            </Row>
            <Row>
              <Button
                variant="danger"
                className="BuscarOtraVez"
                onClick={() => {
                  eliminaDatosBusqueda()
                }}
              >
                Realizar otra búsqueda
              </Button>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div className="contenidoFormularioPrincipal">
            <Form onChange={onChange} onSubmit={onSubmit}>
              {/* Selección de información */}
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="formHorizontaltipo"
                  className="tipo"
                >
                  <Form.Label>¿Como desea buscar al socio?</Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      name="tipo"
                      defaultValue={formData.tipo}
                    >
                      <option value="" selected>
                        Elige....
                      </option>
                      <option value="ficha">Por ficha</option>
                      <option value="nombre">Por nombre</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Row>

              {/* Ficha o Nombre */}
              <Row className="mb-3">
                <div className="datosBusqueda">
                  {formData.tipo === 'ficha' && (
                    <>
                      <Form.Group as={Col} controlId="formGridFicha">
                        <Form.Label>Ficha</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="Escribe la ficha"
                          autoComplete="off"
                          name="ficha"
                          defaultValue={formData.ficha}
                        />
                      </Form.Group>
                    </>
                  )}
                  {formData.tipo === 'nombre' && (
                    <>
                      <Form.Group as={Col} controlId="formGridFicha">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Escribe el nombre"
                          autoComplete="off"
                          name="nombre"
                          defaultValue={formData.nombre}
                        />
                      </Form.Group>
                    </>
                  )}
                </div>
              </Row>

              <Form.Group as={Row} className="botonesBusqueda">
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    className="busqueda"
                    disabled={loading}
                  >
                    {!loading ? 'Buscar' : <Spinner animation="border" />}
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    className="cancelarBusqueda"
                    disabled={loading}
                    onClick={() => {
                      cancelarBusqueda()
                    }}
                  >
                    Cancelar
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </>
      )}
    </>
  )
}

function formatModelSocios(data) {
  return data.map(
    ({
      _id: id,
      ficha,
      nombre,
      tipo,
      correo,
      estado,
      createdAt: fechaCreacion,
      updatedAt: fechaActualizacion,
    }) => ({
      id,
      ficha: parseInt(ficha),
      nombre,
      tipo,
      correo: correo || 'No especificado',
      estado: estado === 'true' ? 'Activo' : 'Inactivo',
      fechaCreacion,
      fechaActualizacion,
    })
  )
}

function initialFormValue() {
  return {
    nombre: '',
    tipo: '',
    ficha: '',
  }
}

export default BusquedaSocios
