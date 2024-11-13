import { useEffect, useState } from 'react';
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Card, Container, CardGroup, Image } from 'react-bootstrap';
// Importaciones de imagenes del dashboard
import LogoSocios from '../../assets/png/usuarios.png';
import LogoMovimientos from '../../assets/png/movimientos.png';
import LogoAjustes from '../../assets/png/ajuste.png';
import LogoAportacion from '../../assets/png/aportacion.png';
import LogoSaldos from '../../assets/png/saldos.png';
import LogoRetiros from '../../assets/png/retiros.png';
import LogoBajaSocios from '../../assets/png/bajaSocios.png';
import LogoEstadoCuenta from '../../assets/png/estadoCuenta.png';
import LogoCredito from '../../assets/png/credito.png';
import LogoBackup from '../../assets/png/backup.png';
import LogoRendimientos from '../../assets/png/rendimientos.png';
import LogoPatrimonio from '../../assets/png/patrimonio.png';
import LogoInteresesSocios from '../../assets/png/interesesSocios.png';
import LogoAbonos from '../../assets/png/abonos.png';
import LogoDeudaSocio from '../../assets/png/deudaSocio.png';
import LogoSaldosSocios from '../../assets/png/saldosSocios.png';
import LogoUsuarios from '../../assets/png/usuarios.png';
import './Dashboard.scss';

function Dashboard(props) {
  const { setRefreshCheckLogin } = props;

  const enrutamiento = useNavigate();

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        toast.warning('Sesión expirada');
        toast.success('Sesión cerrada por seguridad');
        logoutApi();
        setRefreshCheckLogin(true);
      }
    }
  }, []);
  // Termina cerrado de sesión automatico
  
  // Almacena la razón social, si ya fue elegida
    const [razonSocialElegida, setRazonSocialElegida] = useState("");

    useEffect(() => {
        if (getRazonSocial()) {
            setRazonSocialElegida(getRazonSocial)
        }
    }, []);

  const goTo = (ruta) => enrutamiento(ruta);

  const ItemCard = ({ path, logo, title }) => (
    <Card>
      <Card.Body onClick={() => goTo(path)}>
        <div className="flex flex-col items-center justify-center">
          <Image src={logo} style={{ width: '95px' }} />
          <span className="inline-block text-lg font-normal">{title}</span>
        </div>
      </Card.Body>
    </Card>
  )

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <ItemCard
        path={'/socios'}
        logo={LogoSocios}
        title={'Socios'}
        />
        <ItemCard
          path={'/baja-de-socios'}
          logo={LogoBajaSocios}
          title={'Baja de socios'}
        />
        <ItemCard
          path={'/aportaciones'}
          logo={LogoAportacion}
          title={'Aportaciones'}
        />
        <ItemCard
          path={'/prestamos'}
          logo={LogoCredito} 
          title={'Préstamos'}
        />
        <ItemCard 
          path={'/retiros'} 
          logo={LogoRetiros} 
          title={'Retiros'} 
        />
        <ItemCard
          path={'/intereses'}
          logo={LogoRendimientos}
          title={'Intereses'}
        />
        {
            razonSocialElegida === "Asociación de Empleados Sector Cables A.C." &&
                (
                    <>
        <ItemCard
          path={'/patrimonio'}
          logo={LogoPatrimonio}
          title={'Patrimonio'}
        />
        </>
                                                    )
                                                }
        <ItemCard
          path={'/abonos'}
          logo={LogoAbonos}
          title={'Abonos'}
        />
        <ItemCard
          path={'/deudaSocio'}
          logo={LogoDeudaSocio}
          title={'Deudas de los socios'}
        />
        <ItemCard
          path={'/interesesSocios'}
          logo={LogoInteresesSocios}
          title={'Intereses de los socios'}
        />
        <ItemCard
          path={'/saldosSocios'}
          logo={LogoSaldosSocios}
          title={'Saldos de los socios'}
        />
        <ItemCard
          path={'/movimientos'}
          logo={LogoMovimientos}
          title={'Movimientos'}
        />
        <ItemCard
          path={'/estados-de-cuenta'}
          logo={LogoEstadoCuenta}
          title={'Estados de cuenta'}
        />
        <ItemCard
          path={'/periodos'}
          logo={LogoAjustes}
          title={'Ajustes'}
        />
        <ItemCard
          path={'/respaldo-informacion'}
          logo={LogoBackup}
          title={'Respaldos'}
        />
        <ItemCard
          path={'/usuarios'}
          logo={LogoUsuarios}
          title={'Usuarios'}
        />
      </div>
      
    </>
  )
}

export default Dashboard
