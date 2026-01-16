import DataTablecustom from '../../Generales/DataTable'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'

function ListSaldosSocios (props) {
  const { listInteresesSocios, listAportacionesSocios, listPatrimoniosSocios, listPrestamosSocios, listAbonosSocios, listBajasSocios } = props

  const listSaldosSocios = listInteresesSocios.concat(listAportacionesSocios, listPatrimoniosSocios, listPrestamosSocios, listAbonosSocios)

  const fichasDadosDeBaja = listBajasSocios.map(b => String(b.fichaSocio))

  const listInteresesSinDuplicados = listSaldosSocios.reduce((acumulador, valorActual) => {
    // Omitir si la ficha está en la lista de bajas
    if (fichasDadosDeBaja.includes(String(valorActual.fichaSocio))) {
      return acumulador
    }

    const elementoExistente = acumulador.find(
      elemento => elemento.fichaSocio === valorActual.fichaSocio
    )

    if (elementoExistente) {
      return acumulador.map(elemento => {
        if (elemento.fichaSocio === valorActual.fichaSocio) {
          return {
            ...elemento,
            patrimonio: parseFloat((elemento.patrimonio + (valorActual.patrimonio || 0)).toFixed(2)),
            monto: parseFloat((elemento.monto + (valorActual.monto || 0)).toFixed(2)),
            prestamo: parseFloat((elemento.prestamo + (valorActual.prestamo || 0)).toFixed(2)),
            abono: parseFloat((elemento.abono + (valorActual.abono || 0)).toFixed(2)),
          }
        }
        return elemento
      })
    }

    // Si no existe aún, agregarlo (ya redondeado)
    return [
      ...acumulador,
      {
        ...valorActual,
        patrimonio: parseFloat((valorActual.patrimonio || 0).toFixed(2)),
        monto: parseFloat((valorActual.monto || 0).toFixed(2)),
        prestamo: parseFloat((valorActual.prestamo || 0).toFixed(2)),
        abono: parseFloat((valorActual.abono || 0).toFixed(2)),
      },
    ]
  }, [])

  const columns = [
    {
      name: 'Ficha del socio',
      selector: row => row.fichaSocio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Ahorro',
      selector: row => formatMoneda(row.monto),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Patrimonio',
      selector: row => formatMoneda(row.patrimonio),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Saldo deudor',
      selector: row => formatMoneda(row.prestamo - row.abono),
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
  ]

  return (
    <>
      <DataTablecustom datos={listInteresesSinDuplicados} columnas={columns} title='Saldos de los socios' />
    </>
  )
}

export default ListSaldosSocios
