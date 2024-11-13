import { useState } from 'react'
import { toast } from 'react-toastify'
import { isEmailValid } from '../../utils/validations'
import { size, values } from 'lodash'
import { login, setTokenApi } from '../../api/auth'
import { jwtDecode } from 'jwt-decode'
import { obtenerUsuario } from '../../api/usuarios'
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import LogoCajadeAhorro from '../../assets/png/caja-de-ahorro-login.png'

function Login({ setRefreshCheckLogin }) {
  const [formData, setFormData] = useState(initialFormValue)
  const [signInLoading, setSignInLoading] = useState(false)

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const togglePasswordVisiblity = () => {
    setMostrarPassword((val) => !val)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    let validCount = 0
    values(formData).some((value) => {
      value && validCount++
      return null
    })

    if (validCount !== size(formData)) {
      toast.warning('Completa todos los campos del formulario.')
    } else {
      if (!isEmailValid(formData.correo)) {
        toast.warning('Correo no valido')
      } else {
        setSignInLoading(true)
        try {
          login(formData)
            .then((response) => {
              const {
                data: { token },
              } = response
              setTokenApi(token)
              const { _ } = jwtDecode(token)
              const idUdsuario = _
              try {
                obtenerUsuario(idUdsuario).then(
                  ({ data: { nombre, apellidos } }) => {
                    setRefreshCheckLogin(true)
                    toast.success('Bienvenido ' + nombre + ' ' + apellidos)
                  }
                )
              } catch (ex) {
                toast.error('Error al obtener el usuario')
              }
            })
            .catch((ex) => {
              if (ex.message === 'Network Error') {
                toast.error('Conexión al servidor no disponible')
                setSignInLoading(false)
              } else {
                if (ex.response && ex.response.status === 401) {
                  const { mensaje } = ex.response.data
                  toast.error(mensaje)
                  setSignInLoading(false)
                }
              }
            })
        } catch (ex) {
          toast.error('Error al iniciar sesión')
          setSignInLoading(false)
        }
      }
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section className="h-screen">
      <div className="container px-6 py-12 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0 space-y-4">
            <img
              className="w-full pb-5"
              src={LogoCajadeAhorro}
              alt="Caja de Ahorro"
              title="Caja de Ahorro"
            />
            <form onSubmit={onSubmit} onChange={onChange}>
              <div className="mb-6">
                <input
                  type="text"
                  name="correo"
                  defaultValue={formData.correo}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Correo electrónico"
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  name="password"
                  defaultValue={formData.password}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Contraseña"
                />
                <FontAwesomeIcon
                  className="cursor-pointer py-2 -ml-6"
                  icon={!mostrarPassword ? faEyeSlash : faEye}
                  onClick={togglePasswordVisiblity}
                />
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-bold text-lg leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  disabled={signInLoading}
                >
                  {!signInLoading ? (
                    'Iniciar Sesión'
                  ) : (
                    <Spinner animation="border" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full text-center lg:text-left">
          <div className="text-gray-700 text-center p-4">
            © {
              // Get current year
              new Date().getFullYear()
            } Copyright:{' '}
            <a
              className="text-emerald-700 no-underline"
              href="https://ideasysolucionestecnologicas.com"
              target="_blank"
              rel="noreferrer"
            >
              Ideas y Soluciones Tecnológicas S.A de C.V
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function initialFormValue() {
  return {
    correo: '',
    password: '',
  }
}

export default Login