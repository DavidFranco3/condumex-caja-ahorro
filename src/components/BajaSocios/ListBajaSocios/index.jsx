import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "react-bootstrap";
import DataTablecustom from '../../Generales/DataTable';
import EliminaBajaSocios from "../EliminarBajaSocios";

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
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.total)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de registro",
            sortable: false,
            center: true,
            reorder: false,
            selector: row => moment(row.fechaCreacion).format('LL')
        },
        {
            name: "Acciones",
            cell: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <Badge
                            bg="danger"
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
                            <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                        </Badge>
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
