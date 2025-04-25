import { useState } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import DataTablecustom from '../../Generales/DataTable';

function ListDeudaSocio(props) {
    const { listAbonos, listPrestamos, history, location, setRefreshCheckLogin } = props;

    const listSaldosSocios = listPrestamos.concat(listAbonos);

    const listDeudaSocio = listSaldosSocios.reduce((acumulador, valorActual, index) => {
        const elementoExistente = acumulador.find(elemento => elemento.fichaSocio === valorActual.fichaSocio);

        if (elementoExistente) {
            return acumulador.map(elemento => {
                if (elemento.fichaSocio === valorActual.fichaSocio) {
                    return {
                        ...elemento,
                        prestamo: elemento.prestamo + valorActual.prestamo,
                        abono: elemento.abono + valorActual.abono,
                    };
                }

                return elemento;
            });
        }

        return [
            ...acumulador,
            {
                ...valorActual,
                folio: listSaldosSocios.length - index, // Calculate the "Folio" based on the current index
            },
        ];
    }, []);
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
            name: "Total préstamo",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.prestamo)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total abono",
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
            name: "Saldo actual",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.prestamo - row.abono)} MXN
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
        }
    ];

    return (
        <>
            <DataTablecustom datos={listDeudaSocio} columnas={columns} title={"Deuda de socios"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListDeudaSocio;
