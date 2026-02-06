import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import EliminaPeriodos from '../EliminaPeriodos'
import ModificaPeriodos from '../ModificaPeriodos'
import DataTablecustom from '../../Generales/DataTable'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListPeriodos (props) {
  const { listPeriodos, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const columns = [
    {
      name: 'Folio',
      selector: row => row.folio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Fecha de inicio',
      selector: row => formatFecha(row.fechaInicio),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Fecha de cierre',
      selector: row => formatFecha(row.fechaCierre),
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
            icon='fa-solid fa-pen-to-square'
            onClick={() => {
              modificacionPeriodos(
                <ModificaPeriodos
                  datos={row}
                  location={location}
                  history={history}
                  setShowModal={setShowModal}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                />
              )
            }}
          >
            Editar
          </DropdownActions.Button>
          <DropdownActions.Button
            icon='fa-solid fa-trash-can'
            color='text-red-600'
            onClick={() => {
              eliminacionPeriodos(
                <EliminaPeriodos
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

  // Elimina prestamos
  const eliminacionPeriodos = (content) => {
    setTitulosModal('Eliminando periodos')
    setContentModal(content)
    setShowModal(true)
  }

  // Elimina prestamos
  const modificacionPeriodos = (content) => {
    setTitulosModal('Eliminando periodos')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listPeriodos} columnas={columns} title='Periodos' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListPeriodos
