import { useState, useEffect, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getTokenApi, isExpiredToken, logoutApi } from '../../api/auth'
import Swal from 'sweetalert2'
import { Alert, Col, Row, Spinner } from 'react-bootstrap'
import { listarUsuarioCorreos } from '../../api/usuarioCorreos'
import ListUsuarios from '../../components/UsuarioCorreo/ListUsuarioCorreo'
import Lottie from 'react-lottie-player'
import AnimacionLoading from '../../assets/json/loading.json'
import './UsuarioCorreo.scss'

function UsuarioCorreo (props) {
  const { setRefreshCheckLogin } = props
  const location = useLocation()
  const navigate = useNavigate()
  const history = navigate

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
          title: 'Sesión cerrrada por seguridad',
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

  // Almacena los datos de los usuarios
  const [listUsuarios, setListUsuarios] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarUsuarioCorreos().then(response => {
        const { data } = response
        // console.log(data)
        if (!listUsuarios && data) {
          setListUsuarios(formatModelUsuarios(data))
        } else {
          const datosUsuarios = formatModelUsuarios(data)
          setListUsuarios(datosUsuarios)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [location])

  return (
    <>
      <Alert className='fondoPrincipalAlert'>
        <Row>
          <Col xs={12} md={4} className='titulo'>
            <h1 className='font-bold'>Usuarios de correo</h1>
          </Col>
        </Row>
      </Alert>
      {
        listUsuarios
          ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListUsuarios
                  listUsuarios={listUsuarios}
                  history={history}
                  location={location}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                />
              </Suspense>
            </>
            )
          : (
            <>
              <Lottie loop play animationData={AnimacionLoading} />
            </>
            )
      }
    </>
  )
}

function formatModelUsuarios (data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      correo: data.correo,
      password: data.password,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    })
  })
  return dataTemp
}

export default UsuarioCorreo
