import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faBars } from "@fortawesome/free-solid-svg-icons";
import { Badge, Dropdown } from "react-bootstrap";
import EliminaAbonos from "../EliminaAbonos";
import DataTablecustom from '../../Generales/DataTable';

function ListAbonos(props) {
    const { listAbonos, history, location, setRefreshCheckLogin } = props;

    // Configura el idioma a español
    moment.locale("es");

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
            name: "Abono",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.abono)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de registro",
            selector: row => moment(row.fechaCreacion).format('LL'),
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
                                    bg="danger"
                                    className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                                    onClick={() => {
                                        eliminacionAbonos(
                                            <EliminaAbonos
                                                datos={row}
                                                location={location}
                                                history={history}
                                                setShowModal={setShowModal}
                                                setRefreshCheckLogin={setRefreshCheckLogin}
                                            />
                                        )
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
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
    const eliminacionAbonos = (content) => {
        setTitulosModal("Eliminando abonos");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <DataTablecustom datos={listAbonos} columnas={columns} title={"Abonos"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListAbonos;
