import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'react-bootstrap'
import { faPenToSquare, faTrashCan, faBars } from '@fortawesome/free-solid-svg-icons'
import EliminaRetiros from '../EliminaRetiros'
import ModificaRetiros from '../ModificaRetiros'
import DataTablecustom from '../../Generales/DataTable'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'

function ListRetiros (props) {
  const { listRetiros, history, location, setRefreshCheckLogin } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

  const columns = [
    {
      name: 'Folio',
      selector: row => row.folio,
      sortable: true,
      center: true,
      reorder: true
    },
    {
      name: 'Ficha del socio',
      selector: row => row.fichaSocio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: 'Retiro',
      selector: row => formatMoneda(row.retiro),
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
                    modificacionRetiros(
                      <ModificaRetiros
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
                <Dropdown.Item
                  className='eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2'
                  onClick={() => {
                    eliminacionRetiros(
                      <EliminaRetiros
                        datos={row}
                        location={location}
                        history={history}
                        setShowModal={setShowModal}
                        setRefreshCheckLogin={setRefreshCheckLogin}
                      />
                    )
                  }}
                >
                  <span className='text-red-600' style={{ color: 'red' }}><FontAwesomeIcon icon={faTrashCan} className='text-lg' /> Eliminar</span>
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

  // Elimina retiros
  const eliminacionRetiros = (content) => {
    setTitulosModal('Eliminando retiros')
    setContentModal(content)
    setShowModal(true)
  }

  const modificacionRetiros = (content) => {
    setTitulosModal('Modificación retiros')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listRetiros} columnas={columns} title='Retiros' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListRetiros
