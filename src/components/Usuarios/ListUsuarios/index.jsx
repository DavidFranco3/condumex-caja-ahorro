import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "react-bootstrap";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import "./ListUsuarios.scss";
import ModificaUsuarios from "../ModificaUsuarios";
import EliminaUsuarios from "../EliminaUsuarios";
import DataTablecustom from '../../Generales/DataTable';
import { formatFecha } from '../../Generales/FormatFecha';

function ListUsuarios(props) {
    const { listUsuarios, history, location, setRefreshCheckLogin } = props;

    //console.log(listUsuarios)

    // Configura el idioma a español
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const columns = [
        {
            name: "Nombre",
            selector: row => row.nombre + " " + row.apellidos,
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
                        <Badge
                            bg="success"
                            className="editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                            onClick={() => {
                                modificacionUsuario(
                                    <ModificaUsuarios
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
                                eliminacionUsuario(
                                    <EliminaUsuarios
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

    // Eliminar Usuarios
    const eliminacionUsuario = (content) => {
        setTitulosModal("Eliminando usuario");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionUsuario = (content) => {
        setTitulosModal("Modificación usuario");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <DataTablecustom datos={listUsuarios} columnas={columns} title={"Usuarios"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListUsuarios;
