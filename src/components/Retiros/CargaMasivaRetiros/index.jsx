import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row, Spinner, ProgressBar } from 'react-bootstrap'
import Swal from 'sweetalert2'
import queryString from 'query-string'
import { getRazonSocial, getPeriodo } from '../../../api/auth'
import { registroMovimientosSaldosSocios } from '../../GestionAutomatica/Saldos/Movimientos'
import { obtenerFolioActualRetiros, registraRetiros } from '../../../api/retiros'
import { registroSaldoInicial } from '../../GestionAutomatica/Saldos/Saldos'
import { actualizacionSaldosSocios } from '../../GestionAutomatica/Saldos/ActualizacionSaldos'
import { registroAportacionInicial } from '../../Aportaciones/RegistroBajaSocioAportacion'

const CargaMasivaRetiros = ({ setShowModal, history }) => {
  // const [formData, setFormData] = useState(initialFormData());
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormData()
  })

  const [loading, setLoading] = useState(false)
  const [dataFile, setDataFile] = useState([])
  const [count, setCount] = useState(0)

  const handleCancel = () => setShowModal(false)

  const onSubmit = async (dataa) => {
    // evt.preventDefault();
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
    for (const { fichaSocio, retiro } of dataFile) {
      const responseFolio = await obtenerFolioActualRetiros()
      const { data: { folio } } = responseFolio
      const dataRetiro = {
        folio,
        fichaSocio,
        periodo,
        retiro,
        tipo: razonSocial,
        createdAt: dataa.fecha,
      }

      await registraRetiros(dataRetiro)

      await actualizacionSaldosSocios(fichaSocio, retiro, '0', '0', folio, 'Retiro')

      registroMovimientosSaldosSocios(fichaSocio, '0', '0', '0', '0', '0', retiro, '0', 'Retiro')

      const retiro2 = retiro * parseInt('-1')
      await registroAportacionInicial(fichaSocio, retiro2, dataa.fecha)

      // Registra Saldos
      await registroSaldoInicial(fichaSocio, retiro, '0', '0', folio, 'Retiro')

      // increment count for render value in progress bar
      setCount(oldCount => oldCount + 1)
    }

    setDataFile([])
    setLoading(false)
    history({
      search: queryString.stringify(''),
    })
    setShowModal(false)

    Swal.fire({
      title: 'Retiros registrados con exito',
      icon: 'success',
      showConfirmButton: false,
      timer: 1600,
    })
  }

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });

    const { files } = e.target
    if (files.length > 0) {
      const [file] = files
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (evt) => {
        const { result } = evt.target
        const lines = result.split('\r\n')
        const data = lines.map(line => {
          const [fichaSocio, retiro] = line.split('\t')
          return { fichaSocio, retiro }
        })
        setDataFile(data.filter(({ fichaSocio, retiro }) => fichaSocio && retiro))
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
        <Form onSubmit={handleSubmit(onSubmit)}>
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
          <Form.Group as={Row} className='botones pt-3'>
            <Col sm={5}>
              <Form.Label>Fecha de registro:</Form.Label>
            </Col>
            <Col sm={7}>

              <Form.Control
                className='mb-3'
                type='datetime-local'
                placeholder='Fecha'
                isInvalid={!!errors.fecha}
                {...register('fecha', { required: 'La fecha es obligatoria' })}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.fecha?.message}
              </Form.Control.Feedback>
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

const hoy = new Date()

const fecha = [
  hoy.getFullYear(),
  String(hoy.getMonth() + 1).padStart(2, '0'),
  String(hoy.getDate()).padStart(2, '0'),
].join('-')

const hora = [
  String(hoy.getHours()).padStart(2, '0'),
  String(hoy.getMinutes()).padStart(2, '0'),
].join(':')

function initialFormData() {
  return {
    fichaSocio: '',
    retiro: '',
    fecha: `${fecha}T${hora}`
  }
}

export default CargaMasivaRetiros
