import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'react-bootstrap'
import { faPenToSquare, faBars } from '@fortawesome/free-solid-svg-icons'
import './ListUsuarioCorreo.scss'
import ModificaUsuarios from '../ModificaUsuarioCorreo'
import DataTablecustom from '../../Generales/DataTable'
import { formatFecha } from '../../Generales/FormatFecha'

function ListUsuarioCorreo (props) {
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
        <>
          <div className='flex justify-end items-center space-x-4'>
            <Dropdown>
              <Dropdown.Toggle className='botonDropdown' id='dropdown-basic'>
                <FontAwesomeIcon icon={faBars} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className='editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2'
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
                  <span style={{ color: '#007bff' }}><FontAwesomeIcon icon={faPenToSquare} className='text-lg' /> Editar</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      ),
      sortable: false,
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
