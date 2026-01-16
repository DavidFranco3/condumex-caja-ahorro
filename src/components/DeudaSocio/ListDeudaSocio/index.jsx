import DataTablecustom from '../../Generales/DataTable'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'

function ListDeudaSocio (props) {
  const { listAbonos, listPrestamos } = props

  const listSaldosSocios = listPrestamos.concat(listAbonos)

  const listDeudaSocio = listSaldosSocios.reduce((acumulador, valorActual, index) => {
    const elementoExistente = acumulador.find(elemento => elemento.fichaSocio === valorActual.fichaSocio)

    if (elementoExistente) {
      return acumulador.map(elemento => {
        if (elemento.fichaSocio === valorActual.fichaSocio) {
          return {
            ...elemento,
            prestamo: elemento.prestamo + valorActual.prestamo,
            abono: elemento.abono + valorActual.abono,
          }
        }

        return elemento
      })
    }

    return [
      ...acumulador,
      {
        ...valorActual,
        folio: listSaldosSocios.length - index, // Calculate the "Folio" based on the current index
      },
    ]
  }, [])

  const columns = [
    {
      name: 'Folio',
      selector: row => row.folio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Ficha del socio',
      selector: row => row.fichaSocio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Total préstamo',
      selector: row => formatMoneda(row.prestamo),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Total abono',
      selector: row => formatMoneda(row.abono),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Saldo actual',
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
      <DataTablecustom datos={listDeudaSocio} columnas={columns} title='Deuda de socios' />
    </>
  )
}

export default ListDeudaSocio
