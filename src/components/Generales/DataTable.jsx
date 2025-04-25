import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Modal, Button, Form } from "react-bootstrap";
import { estilos } from "../../utils/tableStyled";

const DataTablecustom = ({ datos = [], columnas = [], title, hiddenOptions = false }) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);
    const [visibleColumns, setVisibleColumns] = useState(columnas.map(col => col.name));
    const [showModal, setShowModal] = useState(false)

    const handleFilterChange = (event) => {
        const searchValue = event.target.value;
        setFilterValue(searchValue);

        if (searchValue.length > 0) {
            const filtered = datos.filter((row) => {
                return Object.values(row).some((value) => {
                    if (value && typeof value === "string") {
                        return value
                            .toLowerCase()
                            .includes(searchValue.toLowerCase());
                    }
                    return false;
                });
            });

            setFilteredData(filtered);
        } else {
            setFilteredData(datos);
        }
    };

    const handleDoubleClick = (row) => {
        alert(JSON.stringify(row, null, 2));
    };

    useEffect(() => {
        setFilteredData(datos);
    }, [datos]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
    
        // Título centrado
        const titulo = title;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(titulo);
        const x = (pageWidth - textWidth) / 2;
        doc.setFontSize(16);
        doc.text(titulo, x, 15);
    
        // Filtra columnas visibles (excluyendo "Acciones")
        const tableColumn = columnas
            .filter(col => visibleColumns.includes(col.name) && col.name !== "Acciones")
            .map(col => col.name);
    
        // Mapea los datos de la tabla
        const tableRows = datos.map(row => {
            return columnas
                .filter(col => visibleColumns.includes(col.name) && col.name !== "Acciones")
                .map(col => {
                    let value;
    
                    if (typeof col.selector === 'function') {
                        // Detecta columnas con formato monetario
                        if (["Retiro", "Depósito", "Total", "Saldo", "Pago", "Aportación", "Abono", "Préstamo", "Interés" ].includes(col.name)) {
                            const key = col.name.toLowerCase(); // asume que el campo es row.retiro, row.deposito, etc.
                            value = `${new Intl.NumberFormat('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(row[key])} MXN`;
                        } else {
                            const result = col.selector(row);
                            value = typeof result === "string" || typeof result === "number"
                                ? result
                                : ""; // Evita exportar JSX
                        }
                    } else {
                        value = row[col.selector];
                    }
    
                    const formattedValue = value !== undefined && value !== null && typeof value === 'object'
                        ? JSON.stringify(value)
                        : value || "";
    
                    return formattedValue;
                });
        });
    
        // Genera la tabla en el PDF
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            styles: {
                halign: 'center',
            }
        });
    
        // Guarda el PDF
        doc.save("data.pdf");
    };    

    const handleColumnVisibilityChange = (columnName) => {
        setVisibleColumns(prevVisibleColumns =>
            prevVisibleColumns.includes(columnName)
                ? prevVisibleColumns.filter(name => name !== columnName)
                : [...prevVisibleColumns, columnName]
        );
    };

    const filteredColumns = columnas.filter(col => visibleColumns.includes(col.name));

    return (
        <section>
            <div className="row mb-3" hidden={hiddenOptions}>
                <div className="col-md-8">
                    <div className="input-group">
                        <div className="input-group-append">
                            <button
                                type="submit"
                                className="p-2 btn btn-xs btn-default"
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    border: "1px solid #ced4da",
                                    borderRadius: "4px",
                                }}
                            >
                                <i className="fa fa-search" />
                            </button>
                        </div>
                        <input
                            type="search"
                            value={filterValue}
                            onChange={handleFilterChange}
                            className="form-control form-control-xs"
                            placeholder="Buscar..."
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "5px 10px",
                                fontSize: "12px",
                                width: "100%",
                                maxWidth: "250px",
                            }}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <CSVLink data={datos} filename="data.csv">
                        <button className="btn btn-success btn-xs float-end me-2">
                            <span className="fas fa-file-csv" /> CSV
                        </button>
                    </CSVLink>
                    <button
                        onClick={downloadPDF}
                        className="btn btn-danger btn-xs float-end"
                    >
                        <span className="fas fa-file-pdf" /> PDF
                    </button>
                    <Button variant="primary" className="float-end btn-xs" onClick={() => setShowModal(true)}>
                        <span className="fas fa-eye"></span> Mostrar Columnas
                    </Button>
                </div>
            </div>

            <DataTable
                columns={filteredColumns}
                data={filteredData}
                pagination
                filterValue={filterValue}
                onFilterValueChange={handleFilterChange}
                clearOnFilter
                onRowDoubleClicked={handleDoubleClick}
                customStyles={estilos}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mostrar Columnas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {columnas.map(col => (
                        <Form.Check
                            key={col.name}
                            type="checkbox"
                            label={col.name}
                            checked={visibleColumns.includes(col.name)}
                            onChange={() => handleColumnVisibilityChange(col.name)}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default DataTablecustom;
