import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faBars } from "@fortawesome/free-solid-svg-icons";
import { Badge, Dropdown } from "react-bootstrap";
import DataTablecustom from '../../Generales/DataTable';
import EliminaBajaSocios from "../EliminarBajaSocios";
import { formatMoneda } from '../../Generales/FormatMoneda';
import { formatFecha } from '../../Generales/FormatFecha';

function ListBajaSocios(props) {
    const { listBajasSocios, history, location, setRefreshCheckLogin } = props;

    // Configura el idioma a español
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Elimina prestamos
    const eliminacionBajaSocios = (content) => {
        setTitulosModal("Eliminando bajas de socios");
        setContentModal(content);
        setShowModal(true);
    }

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
            name: "Total",
            selector: row => formatMoneda(row.total),
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
                                    className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                                    onClick={() => {
                                        eliminacionBajaSocios(
                                            <EliminaBajaSocios
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

    return (
        <>
            <DataTablecustom datos={listBajasSocios} columnas={columns} title={"Baja de socios"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListBajaSocios;
