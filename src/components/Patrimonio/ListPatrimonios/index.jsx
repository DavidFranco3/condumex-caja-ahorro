import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import EliminaPatrimonio from '../EliminaPatrimonios'
import ModificaPatrimonio from '../ModificaPatrimonios'
import DataTablecustom from '../../Generales/DataTable'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListPatrimonios(props) {
  const { listPatrimonios, history, location, setRefreshCheckLogin } = props

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
      name: 'Ficha del socio',
      selector: row => row.fichaSocio,
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
              modificacionPatrimonio(
                <ModificaPatrimonio
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
              eliminacionPatrimonio(
                <EliminaPatrimonio
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

  // Elimina patrimonios
  const eliminacionPatrimonio = (content) => {
    setTitulosModal('Eliminando patrimonio')
    setContentModal(content)
    setShowModal(true)
  }

  const modificacionPatrimonio = (content) => {
    setTitulosModal('Modificación patrimonio')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listPatrimonios} columnas={columns} title='Patrimonios' />
      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListPatrimonios
