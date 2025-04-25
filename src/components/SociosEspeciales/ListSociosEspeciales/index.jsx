import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "react-bootstrap";
// Inician importaciones para la tabla
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// Terminan importaciones para la tabla
import ModificaEstadoSocioEspecial from "../ModificaEstadoSocioEspecial";
import ModificaSociosEspeciales from "../ModificaSociosEspeciales";
import EliminaSocioEspecial from "../EliminaSocioEspecial";
import DataTablecustom from '../../Generales/DataTable';

function ListSociosEspeciales(props) {
    const { listSocios, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, totalSocios } = props;

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
            sortable: true,
            center: true,
            reorder: true
        },
        {
            name: "Nombre",
            selector: row => row.nombre,
            sortable: true,
            center: true,
            reorder: true
        },
        {
            name: "Tipo de socio",
            selector: row => row.tipo,
            sortable: true,
            center: true,
            reorder: true
        },
        {
            name: "Estado",
            selector: row => (
                <>
                    {
                        row.estado === "Activo" ?
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        className="editaEstado"
                                        onClick={() => {
                                            cambiaEstadoSocio(
                                                <ModificaEstadoSocioEspecial
                                                    datos={row}
                                                    setShowModal={setShowModal}
                                                    history={history}
                                                    location={location}
                                                />
                                            )
                                        }}
                                    >
                                        Habilitado
                                    </Badge>
                                </>
                            )
                            :
                            (
                                <>
                                    <Badge
                                        bg="danger"
                                        className="editaEstado"
                                        onClick={() => {
                                            cambiaEstadoSocio(
                                                <ModificaEstadoSocioEspecial
                                                    datos={row}
                                                    setShowModal={setShowModal}
                                                    history={history}
                                                    location={location}
                                                />
                                            )
                                        }}
                                    >
                                        Deshabilitado
                                    </Badge>
                                </>
                            )
                    }
                </>
            ),
            sortable: true,
            center: true,
            reorder: true
        },
        {
            name: "Fecha de afiliación",
            sortable: true,
            center: true,
            reorder: true,
            selector: row => moment(row.fechaCreacion).format('LLL')
        },
        {
            name: "Correo",
            selector: row => row.correo,
            sortable: true,
            center: true,
            reorder: true
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                    <Badge
                        bg="success"
                        className="editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                        onClick={() => {
                            modificacionSocio(
                                <ModificaSociosEspeciales
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
                                <EliminaSocioEspecial
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
                </>
            ),
            sortable: true,
            center: true,
            reorder: true
        },
    ];

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };


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

    // Cambiar estado del socio
    const cambiaEstadoSocio = (content) => {
        setTitulosModal("Actualizando estado");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <DataTablecustom datos={listSocios} columnas={columns} title={"Socios especiales"} />
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSociosEspeciales;
