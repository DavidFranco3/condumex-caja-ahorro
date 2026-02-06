import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import ModificaSociosSindicalizados from '../ModificaSociosSindicalizados'
import EliminaSocioSindicalizado from '../EliminaSocioSindicalizado'
import DataTablecustom from '../../Generales/DataTable'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListSociosSindicalizados (props) {
  const { listSocios, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const columns = [
    {
      name: 'Ficha',
      selector: row => row.ficha,
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
      name: 'Correo',
      selector: row => row.correo,
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
        <div className='flex justify-center w-full'>
          <DropdownActions buttonColor='minimal' icon='fas fa-ellipsis-v'>
            <DropdownActions.Button
              icon='fa-solid fa-pen-to-square'
              onClick={() => {
                modificacionSocio(
                  <ModificaSociosSindicalizados
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
                eliminacionSocio(
                  <EliminaSocioSindicalizado
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
        </div>
      ),
      sortable: false,
      center: true,
      reorder: false
    },
  ]

  // Eliminar socios
  const eliminacionSocio = (content) => {
    setTitulosModal('Eliminando socio')
    setContentModal(content)
    setShowModal(true)
  }

  const modificacionSocio = (content) => {
    setTitulosModal('Modificación socio')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listSocios} columnas={columns} title='Socios sindicalizados' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListSociosSindicalizados
