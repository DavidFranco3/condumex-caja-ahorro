import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import './ListUsuarioCorreo.scss'
import ModificaUsuarios from '../ModificaUsuarioCorreo'
import DataTablecustom from '../../Generales/DataTable'
import { formatFecha } from '../../Generales/FormatFecha'
import DropdownActions from '../../Generales/DropdownActions'

function ListUsuarioCorreo(props) {
  const { listUsuarios, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const columns = [
    {
      name: 'Correo',
      selector: row => row.correo,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Password',
      selector: row => row.password,
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
        </DropdownActions>
      ),
      sortable: false,
      button: true,
      center: true,
      reorder: false
    },
  ]

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

export default ListUsuarioCorreo
