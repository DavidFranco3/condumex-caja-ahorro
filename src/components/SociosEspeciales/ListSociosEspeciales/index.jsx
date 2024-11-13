import { useState, useEffect, useMemo } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, Container } from "react-bootstrap";
// Inician importaciones para la tabla
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// Terminan importaciones para la tabla

import DataTable from "react-data-table-component";
import { exportCSVFile } from "../../../utils/exportCSV";
import ModificaEstadoSocioEspecial from "../ModificaEstadoSocioEspecial";
import ModificaSociosEspeciales from "../ModificaSociosEspeciales";
import EliminaSocioEspecial from "../EliminaSocioEspecial";

function ListSociosEspeciales (props) {
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

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listSocios);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
    };

    // Procesa documento para descargar en csv
    function convertArrayOfObjectsToCSV (array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(listSocios);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Descargar CSV</Button>;

    const headers = {
        id: "Identificador BD",
        ficha: "Ficha",
        nombre: "Nombre",
        tipoSocio: "Tipo de socio",
        correo: "Correo",
        estado: "Estado del socio",
        fechaCreacion: "Fecha de afiliación",
        fechaActualizacion: "Fecha de actualizacion"
    };

    const descargaCSV = useMemo(() => <Export onExport={() => exportCSVFile(headers, listSocios, "Lista_de_Socios")} />, []);

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);


    // Estilos personalizados
    const estilos = {
        table: {
            style: {
            },
        },
        tableWrapper: {
            style: {
                display: "table",
            },
        },
        responsiveWrapper: {
            style: {},
        },
        header: {
            style: {
                fontSize: "22px",
                minHeight: "56px",
                paddingLeft: "0px",
                paddingRight: "0px",
            },
        },
        subHeader: {
            style: {
                minHeight: "52px",
            },
        },
        head: {
            style: {
                fontSize: "14px",
                fontWeight: 500,
                minWidth: "0px",
                textAlign: "center",
            },
        },
        headRow: {
            style: {
                minHeight: "0px",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
            },
            denseStyle: {
                minHeight: "32px",
            },
        },
        headCells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            },
            draggingStyle: {
                cursor: "move",
            },
        },
        contextMenu: {
            style: {
                fontSize: "18px",
                fontWeight: 400,
                paddingLeft: "16px",
                paddingRight: "8px",
                transform: 'translate3d(0, -100%, 0)',
                transitionDuration: '125ms',
                transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                willChange: 'transform',
            },
            activeStyle: {
                transform: 'translate3d(0, 0, 0)',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                wordBreak: 'break-word',
            },
            draggingStyle: {},
        },
        rows: {
            style: {
                fontSize: '13px',
                fontWeight: 400,
                minHeight: '48px',
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                },
            },
            denseStyle: {
                minHeight: "32px",
            },
            selectedHighlightStyle: {
                // use nth-of-type(n) to override other nth selectors
                '&:nth-of-type(n)': {
                },
            },
            highlightOnHoverStyle: {
                transitionDuration: '0.15s',
                transitionProperty: 'background-color',
                outlineStyle: 'solid',
                outlineWidth: '1px',
            },
            stripedStyle: {
            },
        },
        expanderRow: {
            style: {
            },
        },
        expanderCell: {
            style: {
                flex: '0 0 48px',
            },
        },
        expanderButton: {
            style: {
                backgroundColor: 'transparent',
                borderRadius: '2px',
                transition: '0.25s',
                height: '100%',
                width: '100%',
                '&:hover:enabled': {
                    cursor: 'pointer',
                },
                '&:disabled': {
                },
                '&:hover:not(:disabled)': {
                    cursor: 'pointer',
                },
                '&:focus': {
                    outline: 'none',
                },
                svg: {
                    margin: 'auto',
                },
            },
        },
    };

    return (
        <>
            <Container fluid>
                <DataTable
                    title="Especiales"
                    columns={columns}
                    data={listSocios}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={totalSocios}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                    dense
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSociosEspeciales;
