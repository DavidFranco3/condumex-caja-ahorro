import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import './ListUsuarios.scss'
import ModificaUsuarios from '../ModificaUsuarios'
import EliminaUsuarios from '../EliminaUsuarios'
import DataTablecustom from '../../Generales/DataTable'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListUsuarios (props) {
  const { listUsuarios, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const columns = [
    {
      name: 'Nombre',
      selector: row => row.nombre + ' ' + row.apellidos,
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
        <DropdownActions buttonColor='minimal' icon='fas fa-ellipsis-v'>
          <DropdownActions.Button
            icon='fa-solid fa-pen-to-square'
            onClick={() => {
              modificacionUsuario(
                <ModificaUsuarios
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
              eliminacionUsuario(
                <EliminaUsuarios
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

  // Eliminar Usuarios
  const eliminacionUsuario = (content) => {
    setTitulosModal('Eliminando usuario')
    setContentModal(content)
    setShowModal(true)
  }

  const modificacionUsuario = (content) => {
    setTitulosModal('Modificación usuario')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listUsuarios} columnas={columns} title='Usuarios' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListUsuarios
