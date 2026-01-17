import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { login, setTokenApi } from '../../api/auth'
import { jwtDecode } from 'jwt-decode'
import { obtenerUsuario } from '../../api/usuarios'
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import LogoCajadeAhorro from '../../assets/png/caja-de-ahorro-login.png'

function Login({ setRefreshCheckLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [signInLoading, setSignInLoading] = useState(false)

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const togglePasswordVisiblity = () => {
    setMostrarPassword((val) => !val)
  }

  const onSubmit = (data) => {
    const { correo, password } = data

    setSignInLoading(true)
    try {
      login({ correo, password })
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
                Swal.fire({
                  title: 'Bienvenido ' + nombre + ' ' + apellidos,
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1600,
                })
              }
            )
          } catch (ex) {
            Swal.fire({
              title: 'Error al obtener el usuario',
              icon: 'error',
              showConfirmButton: false,
              timer: 1600,
            })
          }
        })
        .catch((ex) => {
          if (ex.message === 'Network Error') {
            Swal.fire({
              title: 'Conexión al servidor no disponible',
              icon: 'error',
              showConfirmButton: false,
              timer: 1600,
            })
            setSignInLoading(false)
          } else {
            if (ex.response && ex.response.status === 401) {
              const { mensaje } = ex.response.data
              Swal.fire({
                title: mensaje,
                icon: 'error',
                showConfirmButton: false,
                timer: 1600,
              })
              setSignInLoading(false)
            }
          }
        })
    } catch (ex) {
      Swal.fire({
        title: 'Error al iniciar sesion',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600,
      })
      setSignInLoading(false)
    }
  }

  return (
    <section className='h-screen'>
      <div className='container px-6 py-12 h-full'>
        <div className='flex justify-center items-center flex-wrap h-full g-6 text-gray-800'>
          <div className='md:w-8/12 lg:w-6/12 mb-12 md:mb-0 space-y-4'>
            <img
              className='w-full pb-5'
              src={LogoCajadeAhorro}
              alt='Caja de Ahorro'
              title='Caja de Ahorro'
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-6'>
                <input
                  type='text'
                  className={`form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${errors.correo ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder='Correo electrónico'
                  {...register('correo', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Correo no válido"
                    }
                  })}
                />
                {errors.correo && <span className='text-red-500 text-sm'>{errors.correo.message}</span>}
              </div>

              <div className='flex flex-col mb-6'>
                <div className='flex items-center'>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    className={`form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Contraseña'
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                  />
                  <FontAwesomeIcon
                    className='cursor-pointer py-2 -ml-6 z-10'
                    icon={!mostrarPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisiblity}
                  />
                </div>
                {errors.password && <span className='text-red-500 text-sm mt-1'>{errors.password.message}</span>}
              </div>
              <div className='pt-6'>
                <button
                  type='submit'
                  className='inline-block px-7 py-3 bg-blue-600 text-white font-bold text-lg leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full'
                  data-mdb-ripple='true'
                  data-mdb-ripple-color='light'
                  disabled={signInLoading}
                >
                  {!signInLoading
                    ? (
                      'Iniciar Sesión'
                    )
                    : (
                      <Spinner animation='border' />
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className='w-full text-center lg:text-left'>
          <div className='text-gray-700 text-center p-4'>
            © {
              // Get current year
              new Date().getFullYear()
            } Copyright:{' '}
            <a
              className='text-emerald-700 no-underline'
              href='https://ideasysolucionestecnologicas.com'
              target='_blank'
              rel='noreferrer'
            >
              Ideas y Soluciones Tecnológicas S.A de C.V
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// function initialFormValue() {
//   return {
//     correo: '',
//     password: '',
//   }
// }

export default Login
