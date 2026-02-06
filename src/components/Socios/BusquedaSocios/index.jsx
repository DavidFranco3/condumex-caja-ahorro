import { useState } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import './BusquedaSocios.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import {
  obtenerDatosSocioEmpleado,
  obtenerEmpleadosPorNombre,
} from '../../../api/sociosEmpleados'
import {
  obtenerDatosSocioSindicalizado,
  obtenerSociosSindicalizadosByNombre,
} from '../../../api/sociosSindicalizados'
import { getRazonSocial } from '../../../api/auth'
import { formatFecha } from '../../Generales/FormatFecha'
import DataTablecustom from '../../Generales/DataTable'

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
      Swal.fire({
        title: 'No se encontraron socios con los datos ingresados',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
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
      Swal.fire({
        title: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
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
      Swal.fire({
        title: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
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
      Swal.fire({
        title: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
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
      Swal.fire({
        title: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
    }
  }

  const loadListadoEmpleados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      Swal.fire({
        title: 'Debe especificar la ficha del socio',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
      setLoading(false)
    } else if (tipo === 'ficha') {
      obtenerEmpleadoPorFicha(ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      Swal.fire({
        title: 'Debe especificar el nombre del socio',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
    } else if (tipo === 'nombre') {
      obtenerEmpleadoPorNombre(nombre)
    }
  }

  const loadListadoSindicalizados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      Swal.fire({
        title: 'Debe especificar la ficha del socio',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
    } else if (tipo === 'ficha') {
      obtenerSindicalizadoPorFicha(formData.ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      Swal.fire({
        title: 'Debe especificar el nombre del socio',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
    } else if (tipo === 'nombre') {
      obtenerSindicalizadoPorNombre(nombre)
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
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const columns = [
    {
      name: 'Ficha',
      selector: row => row.ficha,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Correo',
      selector: row => row.correo,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Fecha de registro',
      selector: row => formatFecha(row.fechaCreacion),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Fecha de actualizacion',
      selector: row => formatFecha(row.fechaActualizacion),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Seleccionar',
      selector: row => (
        <>
          <FontAwesomeIcon
            className='eleccionSocio'
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
  ]

  return (
    <>
      {listSociosEncontrados
        ? (
          <>
            <div className='listadoSociosEncontrados'>
              <Row>
                <h3>Socios encontrados</h3>
                <DataTablecustom datos={listSociosEncontrados} columnas={columns} title='Socios encontrados' />
              </Row>
              <Row>
                <Button
                  variant='danger'
                  className='BuscarOtraVez'
                  onClick={() => {
                    eliminaDatosBusqueda()
                  }}
                >
                  Realizar otra búsqueda
                </Button>
              </Row>
            </div>
          </>
        )
        : (
          <>
            <div className='contenidoFormularioPrincipal'>
              <Form onChange={onChange} onSubmit={onSubmit}>
                {/* Selección de información */}
                <Row className='mb-3'>
                  <Form.Group
                    as={Col}
                    controlId='formHorizontaltipo'
                    className='tipo'
                  >
                    <Form.Label>¿Como desea buscar al socio?</Form.Label>
                    <Col>
                      <Form.Control
                        as='select'
                        name='tipo'
                        defaultValue={formData.tipo}
                      >
                        <option value='' selected>
                          Elige....
                        </option>
                        <option value='ficha'>Por ficha</option>
                        <option value='nombre'>Por nombre</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Row>

                {/* Ficha o Nombre */}
                <Row className='mb-3'>
                  <div className='datosBusqueda'>
                    {formData.tipo === 'ficha' && (
                      <>
                        <Form.Group as={Col} controlId='formGridFicha'>
                          <Form.Label>Ficha</Form.Label>
                          <Form.Control
                            type='number'
                            min='0'
                            placeholder='Escribe la ficha'
                            autoComplete='off'
                            name='ficha'
                            defaultValue={formData.ficha}
                          />
                        </Form.Group>
                      </>
                    )}
                    {formData.tipo === 'nombre' && (
                      <>
                        <Form.Group as={Col} controlId='formGridFicha'>
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Escribe el nombre'
                            autoComplete='off'
                            name='nombre'
                            defaultValue={formData.nombre}
                          />
                        </Form.Group>
                      </>
                    )}
                  </div>
                </Row>

                <Form.Group as={Row} className='botonesBusqueda'>
                  <Col>
                    <Button
                      type='submit'
                      variant='success'
                      className='busqueda'
                      disabled={loading}
                    >
                      {!loading ? 'Buscar' : <Spinner animation='border' />}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant='danger'
                      className='cancelarBusqueda'
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
