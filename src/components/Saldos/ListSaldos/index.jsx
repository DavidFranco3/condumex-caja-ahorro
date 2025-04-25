import { useState } from 'react';
import moment from "moment";
import "moment/locale/es-mx"
// Inician importaciones para la tabla
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {TablePagination, Typography} from "@mui/material";
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BasicModal from "../../Modal/BasicModal";

function ListSaldos(props) {
    const { listSaldosSocios, rowsPerPage, setRowsPerPage, page, setPage, totalSaldosSocios } = props;

    // Configura el idioma a español para la fecha
    moment.locale("es-mx")

    // Para controlar la paginacion
    const handleChangePage = (event, newPage) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Inicia definición del cuerpo de la tabla
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);

        return (
            <>
                {/* Inicia definición del cuerpo de la tabla */}
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.folio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.fichaSocio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.capital}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.prestamo}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.patrimonio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {moment(row.fechaActualizacion).format('LLL')}
                    </TableCell>
                </TableRow>
                {/* Termina definición del cuerpo de la tabla */}

                {/* Inicio de la definición del componente desplegable */}
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Detalles del último movimiento
                                </Typography>
                                {
                                    row.folioMovimiento === "0" ?
                                        (
                                            <>
                                                <Typography variant="h8" gutterBottom component="div">
                                                    Sin movimientos registrados
                                                </Typography>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center">Folio</TableCell>
                                                            <TableCell>Capital</TableCell>
                                                            <TableCell>Prestamo</TableCell>
                                                            <TableCell>Patrimonio</TableCell>
                                                            <TableCell align="center">Fecha del Movimiento</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {/* Cuerpo de la tabla del desplegable */}
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )
                                }
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                {/* Termino de la definición del desplegable */}
            </>
        );
    }
    // Termina definición del cuerpo de la tabla

    // Definición de la etiqueta de páginación
    function labelDisplayRows({ from, to, count }) { return `Visualizando registro del ${from} al ${to} de ${count !== -1 ? count : `more than ${to}`}`; }
    // function labelDisplayRows({ from, to, count }) { return `Visualizando ${to} de ${count !== -1 ? count + " Registros" : `more than ${to}`}`; }

    return (
        <>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky collapsible table">
                    <TableHead>
                        <TableRow>
                            {/* Desplegable con detalle de folioMovimiento y movimiento */}
                            <TableCell />
                            <TableCell>Folio</TableCell>
                            <TableCell>Ficha del Socio</TableCell>
                            <TableCell>Capital</TableCell>
                            <TableCell>Prestamo</TableCell>
                            <TableCell>Patrimonio</TableCell>
                            <TableCell>Fecha de última modificación</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listSaldosSocios.map((dato, index) => (
                            <>
                                <Row row={dato} />
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                id="paginacion"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalSaldosSocios}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={labelDisplayRows}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSaldos;
