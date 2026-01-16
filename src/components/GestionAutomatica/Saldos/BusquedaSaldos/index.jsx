import { useState } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { TablePagination } from '@mui/material'
import './BusquedaSaldos.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { obtenerDatosSaldos } from '../../../../api/saldosSocios'
import { getRazonSocial } from '../../../../api/auth'

function BusquedaSaldos (props) {
  const {
    setShowModal,
    setFichaSocioElegido,
    setIdSocioElegido,
    setAportacionSocioElegido,
    setPrestamoSocioElegido,
    setPatrimonioSocioElegido,
    setRendimientoSocioElegido,
    setRetiroSocioElegido,
    setAbonoSocioElegido
  } = props

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(1)

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  // Para almacenar los datos de la busqueda
  const [formData, setFormData] = useState(initialFormValue())

  // Almacenar el listado de socios encontrados
  const [listSaldosEncontrados, setListSaldosEncontrados] = useState(null)

  // Para cancelar la búsqueda
  const cancelarBusqueda = () => {
    setShowModal(false)
  }

  // Para la manipulación de la paginación si es necesario
  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  // Para eliminar los datos del socio encontrado
  const eliminaDatosBusqueda = () => {
    setListSaldosEncontrados(null)
    setFichaSocioElegido('')
    setAportacionSocioElegido('')
    setPrestamoSocioElegido('')
    setPatrimonioSocioElegido('')
    setRendimientoSocioElegido('')
    setRetiroSocioElegido('')
    setAbonoSocioElegido('')
  }

  // Gestionar el socio seleccionado
  const socioSeleccionado = ({ id, fichaSocio, aportacion, prestamo, patrimonio, rendimiento, retiro, abono }) => {
    // Almacena id, ficha y nombre del socio elegido
    setIdSocioElegido(id)
    setFichaSocioElegido(fichaSocio)
    setAportacionSocioElegido(aportacion)
    setPrestamoSocioElegido(prestamo)
    setPatrimonioSocioElegido(patrimonio)
    setRendimientoSocioElegido(rendimiento)
    setRetiroSocioElegido(retiro)
    setAbonoSocioElegido(abono)

    setListSaldosEncontrados(null)
    cancelarBusqueda()
  }

  // Validar listado de socios encontrados
  const validarListadoSaldos = (listSaldos) => {
    if (listSaldos.length === 0) {
      Swal.fire({
        title: 'No se encontraron saldos con los datos ingresados',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
    }
    setListSaldosEncontrados(formatModelSocios(listSaldos))
  }

  // Obtener empleado por ficha
  const obtenerSaldoPorFicha = async (fichaSocio) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSaldos(fichaSocio)

      validarListadoSaldos(data)

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

  const loadListadoSaldos = () => {
    const { tipo, fichaSocio } = formData

    // Busqueda por ficha
    if (tipo === 'fichaSocio' && fichaSocio === '') {
      Swal.fire({
        title: 'Debe especificar la ficha del socio',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1600,
      })
      setLoading(false)
    } else if (tipo === 'fichaSocio') {
      obtenerSaldoPorFicha(fichaSocio)
    }
  }

  // Busqueda y Gestión del socio encontrado
  const onSubmit = (evt) => {
    evt.preventDefault()
    setLoading(true)

    // Si son empleados
    if (getRazonSocial() === 'Asociación de Empleados Sector Cables A.C.') {
      loadListadoSaldos()
    }

    // Si son sindicalizados
    if (
      getRazonSocial() ===
      'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
    ) {
      loadListadoSaldos()
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function labelDisplayRows ({ _from, to, count }) {
    return `Visualizando ${to} de ${count !== -1 ? count + ' Registros' : `more than ${to}`
      }`
  }

  return (
    <>
      {listSaldosEncontrados
        ? (
          <>
            <div className='listadoSociosEncontrados'>
              <Row>
                <h3>Saldos encontrados</h3>
                <TableContainer component={Paper}>
                  <Table stickyHeader aria-label='sticky collapsible table dense'>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>#</TableCell>
                        <TableCell align='center'>Ficha</TableCell>
                        <TableCell align='center'>Tipo</TableCell>
                        <TableCell align='center'>Seleccionar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listSaldosEncontrados.map((dato, index) => (
                        <TableRow
                          sx={{ '& > *': { borderBottom: 'unset' } }}
                          key={dato.fichaSocio}
                        >
                          <TableCell component='th' scope='row'>
                            {index + 1}
                          </TableCell>
                          <TableCell align='center'>{dato.fichaSocio}</TableCell>
                          <TableCell align='center'>{dato.tipo}</TableCell>
                          <TableCell align='center'>
                            <FontAwesomeIcon
                              className='seleccionSocio'
                              icon={faCircleCheck}
                              onClick={() => {
                                socioSeleccionado(dato)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={listSaldosEncontrados.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelRowsPerPage='Filas por página'
                  labelDisplayedRows={labelDisplayRows}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
                      <Form.Select name='tipo' defaultValue={formData.tipo}>
                        <option value='' selected>
                          Elige....
                        </option>
                        <option value='fichaSocio'>Por ficha</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Row>

                {/* Ficha o Nombre */}
                <Row className='mb-3'>
                  <div className='datosBusqueda'>
                    {formData.tipo === 'fichaSocio' && (
                      <>
                        <Form.Group as={Col} controlId='formGridFicha'>
                          <Form.Label>Ficha</Form.Label>
                          <Form.Control
                            type='number'
                            min='0'
                            placeholder='Escribe la ficha'
                            autoComplete='off'
                            name='ficha'
                            defaultValue={formData.fichaSocio}
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

function formatModelSocios (data) {
  return data.map(
    ({
      _id: id,
      fichaSocio,
      tipo,
      aportacion,
      prestamo,
      patrimonio,
      rendimiento,
      retiro,
      abono,
      createdAt: fechaCreacion,
      updatedAt: fechaActualizacion,
    }) => ({
      id,
      fichaSocio: parseInt(fichaSocio),
      tipo,
      aportacion,
      prestamo,
      patrimonio,
      rendimiento,
      retiro,
      abono,
      fechaCreacion,
      fechaActualizacion,
    })
  )
}

function initialFormValue () {
  return {
    tipo: '',
    aportacion: '',
    prestamo: '',
    patrimonio: '',
    rendimiento: '',
    retiro: '',
    abono: '',

  }
}

export default BusquedaSaldos
