import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/dist/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Form } from "react-bootstrap";
import DataTablecustom from '../../Generales/DataTable';
import { exportCSVFile } from "../../../utils/exportCSV";
import Swal from "sweetalert2";

function ListInteresesSocios(props) {
    const { listInteresesSocios, history, location, setRefreshCheckLogin } = props;

    const listInteresesSinDuplicados = listInteresesSocios.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento.fichaSocio == valorActual.fichaSocio);
        if (elementoYaExiste) {
            return acumulador.map((elemento) => {
                if (elemento.fichaSocio == valorActual.fichaSocio) {
                    return {
                        ...elemento,
                        monto: parseFloat(elemento.monto) + parseFloat(valorActual.monto)
                    }
                }

                return elemento;
            });
        }

        return [...acumulador, valorActual];
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
            name: "Monto",
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

            <DataTablecustom datos={listInteresesSocios} columnas={columns} title={"Intereses de los socios"} />


            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListInteresesSocios;
