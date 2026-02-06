import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import DataTablecustom from '../../Generales/DataTable'
import EliminaBajaSocios from '../EliminarBajaSocios'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListBajaSocios(props) {
  const { listBajasSocios, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  // Elimina prestamos
  const eliminacionBajaSocios = (content) => {
    setTitulosModal('Eliminando bajas de socios')
    setContentModal(content)
    setShowModal(true)
  }

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
      name: 'Total',
      selector: row => formatMoneda(row.total),
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
    {
      name: 'Acciones',
      cell: row => (
        <DropdownActions buttonColor='minimal' icon='fas fa-ellipsis-v'>
          <DropdownActions.Button
            icon='fa-solid fa-trash-can'
            color='text-red-600'
            onClick={() => {
              eliminacionBajaSocios(
                <EliminaBajaSocios
                  datos={row}
                  location={location}
                  history={history}
                  setShowModal={setShowModal}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                />
              )
            }}
          >
            <span className='text-red-600'>Eliminar</span>
          </DropdownActions.Button>
        </DropdownActions>
      ),
      sortable: false,
      button: true,
      center: true,
      reorder: false
    },
  ]

  return (
    <>
      <DataTablecustom datos={listBajasSocios} columnas={columns} title='Baja de socios' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListBajaSocios
