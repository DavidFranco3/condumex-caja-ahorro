import { useState } from 'react';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faBars } from "@fortawesome/free-solid-svg-icons";
import { Badge, Dropdown } from "react-bootstrap";
import EliminaPeriodos from '../EliminaPeriodos';
import ModificaPeriodos from '../ModificaPeriodos';
import DataTablecustom from '../../Generales/DataTable';
import { formatFecha } from '../../Generales/FormatFecha';

function ListPeriodos(props) {
    const { listPeriodos, history, location, setRefreshCheckLogin } = props;

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
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de inicio",
            selector: row => formatFecha(row.fechaInicio),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de cierre",
            selector: row => formatFecha(row.fechaCierre),
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
                                    <span style={{ color: '#007bff' }}><FontAwesomeIcon icon={faPenToSquare} className="text-lg" /> Editar</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
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

    // Elimina prestamos
    const eliminacionPeriodos = (content) => {
        setTitulosModal("Eliminando periodos");
        setContentModal(content);
        setShowModal(true);
    }

    // Elimina prestamos
    const modificacionPeriodos = (content) => {
        setTitulosModal("Eliminando periodos");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <DataTablecustom datos={listPeriodos} columnas={columns} title={"Periodos"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListPeriodos;
