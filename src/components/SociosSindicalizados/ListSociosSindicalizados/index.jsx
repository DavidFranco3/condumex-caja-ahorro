import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "react-bootstrap";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ModificaSociosSindicalizados from "../ModificaSociosSindicalizados";
import EliminaSocioSindicalizado from "../EliminaSocioSindicalizado";
import DataTablecustom from '../../Generales/DataTable';

function ListSociosSindicalizados(props) {
    const { CSV, listSocios, history, location, setRefreshCheckLogin } = props;

    //console.log(listSocios)

    // Configura el idioma a español
    moment.locale("es");

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
            name: "Fecha de afiliación",
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
                            bg="success"
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
                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </Badge>
                        <Badge
                            bg="danger"
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
