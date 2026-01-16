import { useState } from 'react'
import BasicModal from '../../Modal/BasicModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'react-bootstrap'
import { faPenToSquare, faTrashCan, faBars } from '@fortawesome/free-solid-svg-icons'
import EliminaPrestamos from '../EliminaPrestamos'
import ModificaPrestamos from '../ModificaPrestamos'
import DataTablecustom from '../../Generales/DataTable'
import { formatMoneda } from '../../Generales/FormatMoneda'
import { formatFecha } from '../../Generales/FormatFecha'

function ListPrestamos (props) {
  const { listPrestamos, history, location, setRefreshCheckLogin } = props

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
      name: 'Préstamo',
      selector: row => formatMoneda(row.prestamo),
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
                    modificacionPrestamos(
                      <ModificaPrestamos
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
                    eliminacionPrestamos(
                      <EliminaPrestamos
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

  // Elimina prestamos
  const eliminacionPrestamos = (content) => {
    setTitulosModal('Eliminando préstamos')
    setContentModal(content)
    setShowModal(true)
  }

  const modificacionPrestamos = (content) => {
    setTitulosModal('Modificación prestamos')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <DataTablecustom datos={listPrestamos} columnas={columns} title='Prestamos' />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default ListPrestamos
