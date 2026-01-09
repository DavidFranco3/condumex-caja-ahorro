import { useState } from 'react';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Dropdown } from "react-bootstrap";
import { faPenToSquare, faTrashCan, faBars } from '@fortawesome/free-solid-svg-icons';
import ModificaSociosSindicalizados from "../ModificaSociosSindicalizados";
import EliminaSocioSindicalizado from "../EliminaSocioSindicalizado";
import DataTablecustom from '../../Generales/DataTable';
import { formatFecha } from '../../Generales/FormatFecha';

function ListSociosSindicalizados(props) {
    const { listSocios, history, location, setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const columns = [
        {
            name: "Ficha",
            selector: row => row.ficha,
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
            name: "Correo",
            selector: row => row.correo,
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
                                    <span style={{ color: '#007bff' }}><FontAwesomeIcon icon={faPenToSquare} className="text-lg" /> Editar</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
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

    // Eliminar socios
    const eliminacionSocio = (content) => {
        setTitulosModal("Eliminando socio");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionSocio = (content) => {
        setTitulosModal("Modificación socio");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <DataTablecustom datos={listSocios} columnas={columns} title={"Socios sindicalizados"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSociosSindicalizados;
