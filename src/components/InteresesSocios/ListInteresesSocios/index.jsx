import DataTablecustom from '../../Generales/DataTable';
import { formatMoneda } from '../../Generales/FormatMoneda';
import { formatFecha } from '../../Generales/FormatFecha';

function ListInteresesSocios(props) {
    const { listInteresesSocios } = props;

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
            selector: row => formatMoneda(row.monto),
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
            <DataTablecustom datos={listInteresesSinDuplicados} columnas={columns} title={"Intereses de los socios"} />
        </>
    );
}

export default ListInteresesSocios;
