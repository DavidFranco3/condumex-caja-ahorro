import { useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/es';
import BasicModal from "../../Modal/BasicModal";
import DataTablecustom from '../../Generales/DataTable';
import { formatMoneda } from '../../Generales/FormatMoneda';
import { formatFecha } from '../../Generales/FormatFecha';

function ListMovimientos(props) {
    const { listMovimientos } = props;

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
            name: "Aportación",
            selector: row => formatMoneda(row.aportacion),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Préstamo",
            selector: row => formatMoneda(row.prestamo),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Patrimonio",
            selector: row => formatMoneda(row.patrimonio),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Interés",
            selector: row => formatMoneda(row.rendimiento),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Retiro",
            selector: row => formatMoneda(row.retiro),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Abono",
            selector: row => formatMoneda(row.abono),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Movimiento",
            selector: row => row.movimiento,
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
    ];

    return (
        <>
            <DataTablecustom datos={listMovimientos} columnas={columns} title={"Movimientos"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListMovimientos;
