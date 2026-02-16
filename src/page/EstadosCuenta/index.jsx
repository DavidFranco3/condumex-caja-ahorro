import { useEffect, useState, Suspense, useId } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getRazonSocial,
  getTokenApi,
  isExpiredToken,
  logoutApi,
  getPeriodo,
  setPeriodo
} from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Col, Row, Tabs, Tab, Spinner, Form } from 'react-bootstrap'
import Loading from '../../components/Loading'
import BasicModal from '../../components/Modal/BasicModal'
import {
  getStatementsBySocio,
  getStatementsByRazon,
  urlDownloadPDF,
  sendEmail,
} from '../../api/statements'
import { listarSociosEmpleados } from '../../api/sociosEmpleados'
import { listarSocioSindicalizado } from '../../api/sociosSindicalizados'
import { map } from 'lodash'
import { listarPeriodo } from '../../api/periodos'
import { formatFecha } from '../../components/Generales/FormatFecha'
import { formatMoneda } from '../../components/Generales/FormatMoneda'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faUsers,
  faPercent,
  faHandHoldingDollar,
  faArrowCircleDown,
  faUserXmark,
  faWallet,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons'
import BusquedaSocios from '../../components/Socios/BusquedaSocios'

function EstadosCuenta({ setRefreshCheckLogin }) {
  const location = useLocation()
  const [tab, setTab] = useState('general')

  // Almacena los datos de los abonos
  const [listSociosSindicalizados, setListSociosSindicalizados] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSocioSindicalizado().then(response => {
        const { data } = response
        // console.log(data)
        if (!listSociosSindicalizados && data) {
          setListSociosSindicalizados(formatModelSocios(data))
        } else {
          const datosSocios = formatModelSocios(data)
          setListSociosSindicalizados(datosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  // Almacena los datos de los abonos
  const [listSociosEmpleados, setListSociosEmpleados] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarSociosEmpleados().then(response => {
        const { data } = response
        // console.log(data)
        if (!listSociosEmpleados && data) {
          setListSociosEmpleados(formatModelSocios(data))
        } else {
          const datosSocios = formatModelSocios(data)
          setListSociosEmpleados(datosSocios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const [idSocioElegido, setIdSocioElegido] = useState('')
  const [fichaSocioElegido, setFichaSocioElegido] = useState('')
  const [nombreSocioElegido, setNombreSocioElegido] = useState('')
  const [correoSocioElegido, setCorreoSocioElegido] = useState('')

  const [loading, setLoading] = useState(false)

  const [razonSocial] = useState(getRazonSocial())
  const [periodo] = useState(getPeriodo())

  const [statementsByRazon, setStatementsByRazon] = useState({
    contributions: 0,
    yields: 0,
    patrimony: 0,
    loans: 0,
    withdrawals: 0,
    layoffs: 0,
    payment: 0,
  })

  const [statementsBySocio, setStatementsBySocio] = useState({
    company: {
      name: '',
    },
    associate: {
      token: '',
      name: '',
      email: '',
    },
    contributions: {
      data: [],
      total: 0,
    },
    yields: {
      data: [],
      total: 0,
    },
    patrimony: {
      data: [],
      total: 0,
    },
    loans: {
      data: [],
      total: 0,
    },
    withdrawals: {
      data: [],
      total: 0,
    },
    layoffs: {
      data: [],
      total: 0,
    },
    payment: {
      data: [],
      total: 0,
    },
  })

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, [])

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        Swal.fire({
          title: 'Sesión expirada',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1600,
        })
        Swal.fire({
          title: 'Sesión cerrada por seguridad',
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
        logoutApi()
        setRefreshCheckLogin(true)
      }
    }
  }, [])
  // Termina cerrado de sesión automatico

  const [listaFichasEmpleados, setListaFichasEmpleados] = useState([])

  useEffect(() => {
    const listaFichasTemp = []
    map(listSociosEmpleados, (empleado, index) => {
      const tempFicha = empleado.ficha.split('T')
      listaFichasTemp.push(tempFicha[0])
    })
    const listaFichasEmpleados = listaFichasTemp.filter((item, index) => {
      return listaFichasTemp.indexOf(item) === index
    })
    setListaFichasEmpleados(listaFichasEmpleados)
  }, [listSociosEmpleados])

  const [listaFichasSindicalizados, setListaFichasSindicalizados] = useState([])

  useEffect(() => {
    const listaFichasTemp = []
    map(listSociosSindicalizados, (sindicalizado, index) => {
      const tempFicha = sindicalizado.ficha.split('T')
      listaFichasTemp.push(tempFicha[0])
    })
    const listaFichasSindicalizados = listaFichasTemp.filter((item, index) => {
      return listaFichasTemp.indexOf(item) === index
    })
    setListaFichasSindicalizados(listaFichasSindicalizados)
  }, [listSociosSindicalizados])

  const loadTotales = async () => {
    setLoading(true)

    const response = await getStatementsByRazon(razonSocial, periodo)
    setStatementsByRazon(response.data)

    setLoading(false)
  }

  const loadTotalesSocio = async () => {
    setLoading(true)

    const response = await getStatementsBySocio(fichaSocioElegido, periodo)
    setStatementsBySocio(response.data)

    setLoading(false)
  }

  useEffect(() => {
    tab === 'socio' && fichaSocioElegido && loadTotalesSocio()
  }, [fichaSocioElegido])

  useEffect(() => {
    if (tab === 'general') {
      loadTotales()
      setFichaSocioElegido('')
    }
  }, [tab])

  const handleDownloadPDF = async () => {
    setLoading(true)

    const fileURL = urlDownloadPDF(fichaSocioElegido, periodo)
    const fileLink = document.createElement('a')
    fileLink.href = fileURL

    fileLink.setAttribute('target', '_blank')
    document.body.appendChild(fileLink)
    fileLink.click()
    fileLink.remove()

    setLoading(false)
  }

  const handleSendEmail = async () => {
    setLoading(true)

    const response = await sendEmail(fichaSocioElegido, periodo)

    if (response.status === 200) {
      Swal.fire({
        title: 'Correo enviado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1600,
      })
    } else {
      Swal.fire({
        title: 'Error al enviar el correo',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
    }

    setLoading(false)
  }

  const handleSendEmailMasiveSindicalizados = async () => {
    setLoading(true)

    for (let i = 0; i < listaFichasSindicalizados.length; i++) {
      const response = await sendEmail(parseInt(listaFichasSindicalizados[i]), periodo)

      if (response.status === 200) {
        Swal.fire({
          title: 'Correo enviado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
      } else {
        Swal.fire({
          title: 'Error al enviar el correo',
          icon: 'error',
          showConfirmButton: false,
          timer: 1600,
        })
      }

      setLoading(false)
    }
  }

  const handleSendEmailMasiveEmpleados = async () => {
    setLoading(true)

    for (let i = 0; i < listaFichasEmpleados.length; i++) {
      const response = await sendEmail(parseInt(listaFichasEmpleados[i]), periodo)
      if (response.status === 200) {
        Swal.fire({
          title: 'Correo enviado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1600,
        })
      } else {
        Swal.fire({
          title: 'Error al enviar el correo',
          icon: 'error',
          showConfirmButton: false,
          timer: 1600,
        })
      }

      setLoading(false)
    }
  }

  const Card = ({ title, value, icon }) => {
    return (
      <div className='bg-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center border border-gray-200 hover:scale-105 transition-transform duration-200'>
        {icon && <div className='mb-2 text-2xl'>{icon}</div>}
        <h2 className='text-gray-500 text-sm font-medium'>{title}</h2>
        <p className='text-gray-900 text-xl font-bold'>{formatMoneda(value)}</p>
      </div>
    )
  }

  const Button = ({ variant = 'blue', onClick, children }) => {
    return (
      <button
        type='button'
        onClick={onClick}
        className={`inline-block px-6 py-3 bg-${variant}-600 text-white font-bold text-xs leading-tight uppercase rounded shadow-md hover:bg-${variant}-700 hover:shadow-lg focus:bg-${variant}-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-${variant}-800 active:shadow-lg transition duration-150 ease-in-out`}
      >
        {children}
      </button>
    )
  }

  const ButtonDisabled = ({ variant = 'blue', children }) => {
    return (
      <button
        type='button'
        className={`inline-block px-6 py-3 bg-${variant}-600 text-white font-bold text-xs leading-tight uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out pointer-events-none opacity-60`}
        disabled
      >
        {children}
      </button>
    )
  }

  const handleSearchSocio = () => {
    setShowModal(true)
    setContentModal(
      <BusquedaSocios
        setShowModal={setShowModal}
        setIdSocioElegido={setIdSocioElegido}
        setFichaSocioElegido={setFichaSocioElegido}
        setNombreSocioElegido={setNombreSocioElegido}
        setCorreoSocioElegido={setCorreoSocioElegido}
        idSocioElegido={idSocioElegido}
        fichaSocioElegido={fichaSocioElegido}
        nombreSocioElegido={nombreSocioElegido}
      />
    )
    setTitulosModal('Búsqueda de socio')
  }

  const Thead = ({ title, subTitles = ['#', 'Fecha', 'Monto'] }) => {
    return (
      <>
        <thead className='border-b bg-blue-50'>
          <tr>
            <th
              colSpan={subTitles.length}
              className='text-center p-3 border-b border-gray-200 text-center'
            >
              {title}
            </th>
          </tr>
          <tr>
            {subTitles.map((subTitle) => (
              <th
                key={subTitle}
                scope='col'
                className='text-sm font-semibold text-gray-900 px-3 py-2 text-left uppercase text-center'
              >
                {subTitle}
              </th>
            ))}
          </tr>
        </thead>
      </>
    )
  }

  const Tr = ({ createdAt, monto, index }) => {
    const { id } = useId()
    return (
      <tr key={id} className='border-b'>
        <td className='text-sm text-gray-900 font-medium font-mono px-3 py-2 whitespace-nowrap text-center'>
          {index + 1}
        </td>
        <td className='text-sm text-gray-900 font-medium font-mono px-3 py-2 whitespace-nowrap text-center'>
          {formatFecha(createdAt)}
        </td>
        <td className='text-sm text-gray-900 font-medium font-mono px-3 py-2 whitespace-nowrap text-center'>
          {formatMoneda(monto)}
        </td>
      </tr>
    )
  }

  const TrTotal = ({ total, title = 'Total' }) => {
    return (
      <tr className='bg-gray-50'>
        <td colSpan={2} className='text- font-bold text-md' />
        <td className=' font-bold font-mono text-md px-3 py-2 whitespace-nowrap text-center'>
          {title} {formatMoneda(total)}
        </td>
      </tr>
    )
  }

  const Table = ({ title, children }) => (
    <table className='min-w-full'>
      <Thead title={title} />
      {children}
    </table>
  )

  // Para almacenar las sucursales registradas
  const [periodosRegistrados, setPeriodosRegistrados] = useState(null)

  const cargarListaPeriodos = () => {
    try {
      listarPeriodo(getRazonSocial()).then(response => {
        const { data } = response
        // console.log(data)
        const dataTemp = formatModelPeriodos(data)
        // console.log(data)
        setPeriodosRegistrados(dataTemp)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    cargarListaPeriodos()
  }, [])

  // Almacena la razón social, si ya fue elegida
  const [periodoElegido, setPeriodoElegido] = useState('')

  // Para almacenar en localstorage la razon social
  const almacenaPeriodo = (periodo) => {
    if (periodo !== 'Elige una opción') {
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
    guardarPeriodoElegido()
  }, [])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row as={Row}>
          <Col key={12} as={Col} xs={12} md={12} className='titulo'>
            <h1 className='font-bold'>Estados de cuenta</h1>
          </Col>
        </Row>
      </Alert>

      <Row>
        <Col xs={6} md={4} />
        <Col xs={6} md={4}>
          <Form.Control
            as='select'
            aria-label='indicadorPeriodo'
            name='periodo'
            className='periodo'
            defaultValue={periodoElegido}
            onChange={(e) => {
              almacenaPeriodo(e.target.value)
            }}
          >
            <option>Elige una opción</option>
            {map(periodosRegistrados, (periodo, index) => (
              <option key={index} value={periodo?.folio} selected={parseInt(periodoElegido) === parseInt(periodo?.folio)}>{periodo?.nombre}</option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <div className='flex flex-col space-x-5'>
        <Tabs
          activeKey={tab}
          onSelect={(k) => setTab(k)}
          className='flex w-full'
          id='uncontrolled-tab-estados'
        >
          <Tab
            key={0}
            tabClassName='font-semibold text-lg'
            eventKey='general'
            title='Estado de cuenta general'
          >
            <br />
            {
              razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.'
                ? (
                  <>
                    <Button onClick={handleSendEmailMasiveEmpleados}>Enviar por correo</Button>
                  </>
                )
                : (
                  <>
                    <Button onClick={handleSendEmailMasiveSindicalizados}>Enviar por correo</Button>
                  </>
                )
            }
            {!loading
              ? (
                <Suspense fallback={<Spinner />}>

                  <div className='p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                    <Card
                      title='Aportaciones'
                      value={statementsByRazon.contributions}
                      icon={<FontAwesomeIcon icon={faChartLine} className='text-emerald-400 text-xl' />}
                    />

                    <Card
                      title='Deudas de los socios'
                      value={statementsByRazon.loans - statementsByRazon.payment}
                      icon={<FontAwesomeIcon icon={faUsers} className='text-sky-400 text-xl' />}
                    />

                    <Card
                      title='Intereses'
                      value={statementsByRazon.yields}
                      icon={<FontAwesomeIcon icon={faPercent} className='text-yellow-400 text-xl' />}
                    />

                    <Card
                      title='Préstamos'
                      value={statementsByRazon.loans}
                      icon={<FontAwesomeIcon icon={faHandHoldingDollar} className='text-blue-400 text-xl' />}
                    />

                    <Card
                      title='Retiros'
                      value={statementsByRazon.withdrawals}
                      icon={<FontAwesomeIcon icon={faArrowCircleDown} className='text-red-400 text-xl' />}
                    />

                    <Card
                      title='Bajas'
                      value={statementsByRazon.layoffs}
                      icon={<FontAwesomeIcon icon={faUserXmark} className='text-pink-400 text-xl' />}
                    />

                    <Card
                      title='Abonos'
                      value={statementsByRazon.payment}
                      icon={<FontAwesomeIcon icon={faWallet} className='text-purple-400 text-xl' />}
                    />

                    {razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.' && (
                      <Card
                        title='Patrimonio'
                        value={statementsByRazon.patrimony}
                        icon={<FontAwesomeIcon icon={faBuildingColumns} className='text-orange-400 text-xl' />}
                      />
                    )}

                  </div>

                </Suspense>
              )
              : (
                <Loading />
              )}
          </Tab>
          <Tab
            key={1}
            tabClassName='font-semibold text-lg'
            eventKey='socio'
            title='Estado de cuenta por socio'
          >
            <div className='block pt-4 space-x-5'>
              <div className='flex justify-between'>
                <div className='flex justify-start items-center space-x-4'>
                  <Button onClick={handleSearchSocio}>
                    Buscar socio
                  </Button>
                </div>
                {fichaSocioElegido && (
                  <div className='flex justify-end items-center space-x-4'>
                    <Button onClick={handleDownloadPDF}>Imprimir</Button>
                    {correoSocioElegido
                      ? (
                        <Button onClick={handleSendEmail}>Enviar por correo</Button>
                      )
                      : (
                        <ButtonDisabled>Enviar por correo</ButtonDisabled>
                      )}
                  </div>
                )}
              </div>
              {fichaSocioElegido && (
                <div className='flex flex-col pt-4'>
                  <span className='inline-block'>
                    Ficha: {fichaSocioElegido}
                  </span>
                  <span className='inline-block'>
                    Nombre: {nombreSocioElegido}
                  </span>
                  <span className='inline-block'>
                    Correo: {correoSocioElegido}
                  </span>
                </div>
              )}
              {fichaSocioElegido && !loading
                ? (
                  <Suspense fallback={<Spinner />}>
                    <div className='flex flex-col'>
                      <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                        <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
                          <div className='overflow-hidden'>
                            <Table title='Aportaciones'>
                              <tbody>
                                {statementsBySocio.contributions.data.map(
                                  (
                                    {
                                      id,
                                      fechaCreacion: createdAt,
                                      aportacion: monto,
                                    },
                                    index
                                  ) => (
                                    <Tr
                                      key={id}
                                      createdAt={createdAt}
                                      monto={monto}
                                      index={index}
                                    />
                                  )
                                )}
                                <TrTotal
                                  total={statementsBySocio.contributions.total}
                                />
                              </tbody>
                            </Table>

                            {
                              razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.' &&
                              (
                                <>
                                  <Table title='Patrimonio'>
                                    <tbody>
                                      {statementsBySocio.patrimony.data.map(
                                        (
                                          {
                                            _id: id,
                                            fechaCreacion: createdAt,
                                            patrimonio: monto,
                                          },
                                          index
                                        ) => (
                                          <Tr
                                            key={id}
                                            createdAt={createdAt}
                                            monto={monto}
                                            index={index}
                                          />
                                        )
                                      )}
                                      <TrTotal
                                        total={statementsBySocio.patrimony.total}
                                      />
                                    </tbody>
                                  </Table>
                                </>
                              )
                            }
                            <Table title='Intereses'>
                              <tbody>
                                {statementsBySocio.yields.data.map(
                                  (
                                    {
                                      _id: id,
                                      fechaCreacion: createdAt,
                                      rendimiento: monto,
                                    },
                                    index
                                  ) => (
                                    <Tr
                                      key={id}
                                      createdAt={createdAt}
                                      monto={monto}
                                      index={index}
                                    />
                                  )
                                )}
                                <TrTotal
                                  total={statementsBySocio.yields.total}
                                />
                              </tbody>
                            </Table>
                            <Table title='Retiros'>
                              <tbody>
                                {statementsBySocio.withdrawals.data.map(
                                  (
                                    {
                                      _id: id,
                                      fechaCreacion: createdAt,
                                      retiro: monto,
                                    },
                                    index
                                  ) => (
                                    <Tr
                                      key={id}
                                      createdAt={createdAt}
                                      monto={monto}
                                      index={index}
                                    />
                                  )
                                )}
                                <TrTotal
                                  total={statementsBySocio.withdrawals.total}
                                />
                              </tbody>
                            </Table>

                            <Table title='Préstamos'>
                              <tbody>
                                {statementsBySocio.loans.data.map(
                                  (
                                    {
                                      _id: id,
                                      fechaCreacion: createdAt,
                                      prestamoTotal: monto,
                                    },
                                    index
                                  ) => (
                                    <Tr
                                      key={id}
                                      createdAt={createdAt}
                                      monto={monto}
                                      index={index}
                                    />
                                  )
                                )}
                                <TrTotal
                                  total={statementsBySocio.loans.total}
                                />
                              </tbody>
                            </Table>

                            <Table title='Abonos'>
                              <tbody>
                                {statementsBySocio.payment.data.map(
                                  (
                                    {
                                      _id: id,
                                      fechaCreacion: createdAt,
                                      abono: monto,
                                    },
                                    index
                                  ) => (
                                    <Tr
                                      key={id}
                                      createdAt={createdAt}
                                      monto={monto}
                                      index={index}
                                    />
                                  )
                                )}
                                <TrTotal
                                  total={statementsBySocio.payment.total}
                                />
                              </tbody>
                            </Table>
                            <table className='min-w-full'>
                              <thead className='border-b bg-blue-50'>
                                <tr>
                                  <th
                                    colSpan={2}
                                    className='text-center p-3 border-b border-gray-200'
                                  >
                                    Saldos
                                  </th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr className='bg-gray-50'>
                                  <td className='font-bold text-md px-3 py-2 whitespace-nowrap'>
                                    Saldo a favor
                                  </td>
                                  <td className='text-right font-bold font-mono text-md px-3 py-2 whitespace-nowrap'>
                                    {formatMoneda(statementsBySocio.contributions.total + statementsBySocio.patrimony.total + statementsBySocio.yields.total)}
                                  </td>
                                </tr>
                                <tr className='bg-gray-50'>
                                  <td className='font-bold text-md px-3 py-2 whitespace-nowrap'>
                                    Saldo deudor
                                  </td>
                                  <td align='center' className='text-right font-bold font-mono text-md px-3 py-2 whitespace-nowrap'>
                                    {formatMoneda(statementsBySocio.loans.total - statementsBySocio.payment.total)}
                                  </td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Suspense>
                )
                : (
                  fichaSocioElegido && (
                    <Loading />
                  )
                )}
            </div>
          </Tab>
        </Tabs>
      </div>
      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

function formatModelSocios(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      ficha: String(data.ficha),
      nombre: data.nombre,
      tipo: data.tipo,
      correo: data.correo ? data.correo : 'No especificado',
      estado: data.estado === 'true' ? 'Activo' : 'Inactivo',
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

function formatModelPeriodos(data) {
  // console.log(data)
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
    })
  })
  return dataTemp
}

export default EstadosCuenta
