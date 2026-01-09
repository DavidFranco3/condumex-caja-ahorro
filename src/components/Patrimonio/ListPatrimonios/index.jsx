import { useState } from 'react';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Dropdown } from "react-bootstrap";
import { faPenToSquare, faTrashCan, faBars } from '@fortawesome/free-solid-svg-icons';
import EliminaPatrimonio from "../EliminaPatrimonios";
import ModificaPatrimonio from "../ModificaPatrimonios";
import DataTablecustom from '../../Generales/DataTable';
import { formatMoneda } from '../../Generales/FormatMoneda';
import { formatFecha } from '../../Generales/FormatFecha';

function ListPatrimonios(props) {
  const { listPatrimonios, history, location, setRefreshCheckLogin } = props;

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const columns = [
    {
      name: "Folio",
      selector: row => row.folio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Ficha del socio",
      selector: row => row.fichaSocio,
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Patrimonio",
      selector: row => formatMoneda(row.patrimonio),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Fecha de registro",
      selector: row => formatFecha(row.fechaCreacion),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Fecha de actualizacion",
      selector: row => formatFecha(row.fechaActualizacion),
      sortable: false,
      center: true,
      reorder: false
    },
    {
      name: "Acciones",
      cell: row => (
        <>
          <div className="flex justify-end items-center space-x-4">
            <Dropdown>
              <Dropdown.Toggle className="botonDropdown" id="dropdown-basic">
                <FontAwesomeIcon icon={faBars} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
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
                  <span style={{ color: '#007bff' }}><FontAwesomeIcon icon={faPenToSquare} className="text-lg" /> Editar</span>
                </Dropdown.Item>
                <Dropdown.Item
                  className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
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
                  <span className="text-red-600" style={{ color: 'red' }}><FontAwesomeIcon icon={faTrashCan} className="text-lg" /> Eliminar</span>
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
  ];

  // Elimina patrimonios
  const eliminacionPatrimonio = (content) => {
    setTitulosModal("Eliminando patrimonio");
    setContentModal(content);
    setShowModal(true);
  }

  const modificacionPatrimonio = (content) => {
    setTitulosModal("Modificación patrimonio");
    setContentModal(content);
    setShowModal(true);
  }

  return (
    <>
      <DataTablecustom datos={listPatrimonios} columnas={columns} title={"Patrimonios"} />
      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListPatrimonios;
