import { useState } from 'react'
import { Button, Col, Form, Row, Spinner, ProgressBar } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'
import { obtenerFolioActualAportaciones, registraAportacionesSocios } from '../../../api/aportaciones'
import { registroSaldoInicial } from '../../GestionAutomatica/Saldos/Saldos'
import { actualizacionSaldosSocios } from '../../GestionAutomatica/Saldos/ActualizacionSaldos'

const RestaurarAportaciones = ({ setShowModal, history }) => {
  // Para almacenar los datos del formulario
  const [formData, setFormData] = useState(initialFormData())

  const [loading, setLoading] = useState(false)
  const [dataFile, setDataFile] = useState([])
  const [count, setCount] = useState(0)
  const handleCancel = () => setShowModal(false)
  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (dataFile.length === 0) {
      Swal.fire({
        title: 'No hay datos para cargar',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
      return
    }

    const razonSocial = getRazonSocial()
    const periodo = getPeriodo()
    setLoading(true)
    for (const { fichaSocio, aportacion, createdAt } of dataFile) {
      const fecha = createdAt.split('T')
      console.log(new Date(fecha[0]))
      const responseFolio = await obtenerFolioActualAportaciones()
      const { data: { folio } } = responseFolio
      const dataAportacion = {
        folio,
        fichaSocio,
        aportacion,
        periodo,
        tipo: razonSocial,
        createdAt: fecha[0]
      }
      // Registra movimientos
      await registraAportacionesSocios(dataAportacion)

      await actualizacionSaldosSocios(fichaSocio, aportacion, '0', '0', folio, 'Aportación')

      await registroMovimientosSaldosSocios(fichaSocio, aportacion, '0', '0', '0', '0', '0', '0', 'Aportación')

      // Registra Saldos
      await registroSaldoInicial(fichaSocio, aportacion, '0', '0', folio, 'Aportación')

      // increment count for render value in progress bar
      setCount(oldCount => oldCount + 1)
    }
    Swal.fire({
      title: 'Abonos registrados con exito',
      icon: 'success',
      showConfirmButton: false,
      timer: 1600,
    })
    setDataFile([])
    setLoading(false)
    history({
      search: queryString.stringify(''),
    })
    setShowModal(false)
  }

  console.log(dataFile)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    const { files } = e.target
    if (files.length > 0) {
      const [file] = files
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (evt) => {
        const { result } = evt.target
        const lines = result.split('\n') // Cambiar el delimitador de línea a '\n'
        const data = lines.map(line => {
          const [fichaSocio, aportacion, createdAt] = line.split(',')
          return { fichaSocio, aportacion, createdAt }
        })
        setDataFile(data.filter(({ fichaSocio, aportacion, createdAt }) => fichaSocio && aportacion && createdAt))
      }
      reader.onerror = (_evt) => Swal.fire({
        title: 'Error al leer el archivo',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
    }
  }

  const Loading = () => (
    !loading ? 'Cargar' : <Spinner animation='border' />
  )

  return (
    <>
      <div className='contenidoFormularioPrincipal'>
        <Form>
          <Form.Group as={Row} className='botones pt-3'>
            <Col sm={5}>
              <Form.Label>Seleccione el fichero:</Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Control
                onChange={handleChange}
                className='form-control block w-full px-3 py-1.5 text-base font-normaltext-gray-700bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                accept='.txt, text/plain'
                type='file'
                id='formFile'
              />
            </Col>
          </Form.Group>
          {
                        dataFile.length > 0 && (<Form.Group as={Row} className='botones pt-4'>
                          <Col sm={12}>
                            <div className='flex flex-col justify-center'>
                              <div className='mb-3 w-100'>
                                <span className='inline-block mb-2 text-gray-700'>Total de registros a cargar: {dataFile.length}</span>
                              </div>
                              {
                                        count > 0 && (<div className='mb-3 w-100'>
                                          <span className='flex justify-center mb-2 text-gray-700'>{count} de {dataFile.length}</span>
                                          <Form.Group as={Row}>
                                            <Col sm={12}>
                                              <ProgressBar animated now={count} max={dataFile.length} variant='info' />
                                            </Col>
                                          </Form.Group>
                                                      </div>)
                                    }
                            </div>
                          </Col>
                                                </Form.Group>)
                    }
          <Form.Group as={Row} className='botones pt-5'>
            <Col>
              <Button
                type='submit'
                variant='success'
                className='registrar'
                onClick={handleSubmit}
                disabled={loading}
              >
                <Loading />
              </Button>
            </Col>
            <Col>
              <Button
                variant='danger'
                className='cancelar'
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Col>
          </Form.Group>

        </Form>
      </div>
    </>
  )
}

function initialFormData () {
  return {
    fichaSocio: '',
    abono: '',
    fecha: ''
  }
}

export default RestaurarAportaciones
