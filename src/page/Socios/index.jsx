import { useState, useEffect } from 'react'

import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth'
import 'react-tabs/style/react-tabs.css'
import Swal from 'sweetalert2'
import Empleados from '../Empleados'
import Sindicalizados from '../Sindicalizados'
import Loading from '../../components/Loading'
import './Socios.scss'

function Socios (props) {
  const { setRefreshCheckLogin } = props

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

  // Recuperación de la razón social seleccionada
  const [razonSocialElegida, setRazonSocialElegida] = useState('Sin Selección')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    } else {
      setRazonSocialElegida('Sin Selección')
    }
  }, [])
  // Termina recuperación de la razón social recuperada

  return (
    <>
      {
        razonSocialElegida === 'Sin Selección'
          ? (
            <>
              <Loading />
            </>
            )
          : (
              razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.'
                ? (
                <>
                  {/* Empleados */}
                  <Empleados
                    setRefreshCheckLogin={setRefreshCheckLogin}
                  />
                </>
                  )
                : (
                    razonSocialElegida === 'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
                      ? (
                    <>
                      {/* Sindicalizados */}
                      <Sindicalizados
                        setRefreshCheckLogin={setRefreshCheckLogin}
                      />
                    </>
                        )
                      : (
                    <>
                      <Loading />
                    </>
                        )
                  )
            )

      }
    </>
  )
}

export default Socios
