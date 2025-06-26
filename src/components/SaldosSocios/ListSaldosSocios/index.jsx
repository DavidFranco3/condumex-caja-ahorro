import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/dist/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Badge, Container, Button, Col, Form } from "react-bootstrap";
import { estilos } from "../../../utils/tableStyled";
import { exportCSVFile } from "../../../utils/exportCSV";
import Swal from "sweetalert2";
import DataTablecustom from '../../Generales/DataTable';

function ListSaldosSocios(props) {
    const { listInteresesSocios, listAportacionesSocios, listPatrimoniosSocios, listPrestamosSocios, listAbonosSocios, listBajasSocios, history, location, setRefreshCheckLogin } = props;

    const listSaldosSocios = listInteresesSocios.concat(listAportacionesSocios, listPatrimoniosSocios, listPrestamosSocios, listAbonosSocios);

    const fichasDadosDeBaja = listBajasSocios.map(b => String(b.fichaSocio));

    const listInteresesSinDuplicados = listSaldosSocios.reduce((acumulador, valorActual) => {
        // Omitir si la ficha está en la lista de bajas
        if (fichasDadosDeBaja.includes(String(valorActual.fichaSocio))) {
            return acumulador;
        }

        const elementoExistente = acumulador.find(
            elemento => elemento.fichaSocio === valorActual.fichaSocio
        );

        if (elementoExistente) {
            return acumulador.map(elemento => {
                if (elemento.fichaSocio === valorActual.fichaSocio) {
                    return {
                        ...elemento,
                        patrimonio: parseFloat((elemento.patrimonio + (valorActual.patrimonio || 0)).toFixed(2)),
                        monto: parseFloat((elemento.monto + (valorActual.monto || 0)).toFixed(2)),
                        prestamo: parseFloat((elemento.prestamo + (valorActual.prestamo || 0)).toFixed(2)),
                        abono: parseFloat((elemento.abono + (valorActual.abono || 0)).toFixed(2)),
                    };
                }
                return elemento;
            });
        }

        // Si no existe aún, agregarlo (ya redondeado)
        return [
            ...acumulador,
            {
                ...valorActual,
                patrimonio: parseFloat((valorActual.patrimonio || 0).toFixed(2)),
                monto: parseFloat((valorActual.monto || 0).toFixed(2)),
                prestamo: parseFloat((valorActual.prestamo || 0).toFixed(2)),
                abono: parseFloat((valorActual.abono || 0).toFixed(2)),
            },
        ];
    }, []);


    const generacionCSV = () => {
        try {
            Swal.fire({
                title: "Estamos empaquetando tu respaldo, espere por favor ....",
                icon: "info",
                showConfirmButton: false,
                timer: 1600,
            });
            const timer = setTimeout(() => {
                exportCSVFile(listInteresesSinDuplicados, "LISTA_SOCIOS_SINDICALIZADOS");
            }, 5600);
            return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const columns = [
        {
            name: "Ficha del socio",
            selector: row => row.fichaSocio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ahorro",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.monto)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Patrimonio",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.patrimonio)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Saldo deudor",
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
    ];

    return (
        <>

            <Col sm="7">
                <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                        generacionCSV()
                    }}
                >
                    <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
                </Button>
            </Col>

            <DataTablecustom datos={listInteresesSinDuplicados} columnas={columns} title={"Saldos de los socios"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSaldosSocios;
