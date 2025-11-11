import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { formatMoneda } from "./FormatMoneda";

const DataTablecustom = ({ datos = [], columnas = [], hiddenOptions = false, title }) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);
    const [visibleColumns, setVisibleColumns] = useState(columnas.map(col => col.name));
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // 🔹 Detecta dinámicamente las claves, omitiendo "id" y "tipo"
    const keys = Object.keys(datos[0]).filter(k => k !== "id" && k !== "tipo" && k !== "folio" && k !== "fechaActualizacion")

    // 🔹 Construye el CSV manualmente
    const csvContent = datos.map(item => {
        return keys
            .map(key => {
                const value = item[key]
                // Formatea solo si es número
                if (typeof value === "number" || (!isNaN(value) && value !== "")) {
                    return Number(value).toFixed(2)
                }
                return value ?? "" // evita "undefined"
            })
            .join(",")
    }).join("\n")

    const handleFilterChange = (event) => {
        const searchValue = event.target.value.trim();
        setFilterValue(searchValue);

        if (searchValue.length === 0) {
            setFilteredData(datos);
            return;
        }

        const searchLower = searchValue.toLowerCase();

        const filtered = datos.filter((row) =>
            Object.values(row).some((value) => {
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            })
        );

        setFilteredData(filtered);
    };

    const handleDoubleClick = (row) => {
        alert(JSON.stringify(row, null, 2));
    };

    useEffect(() => {
        setFilteredData(datos);
    }, [datos]);

    const downloadPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            const doc = new jsPDF();

            const columnasFiltradas = columnas.filter(
                col => visibleColumns.includes(col.name) && col.name !== "Acciones"
            );

            const tableColumn = columnasFiltradas.map(col => col.name);

            const tableRows = datos.map(row => {
                const rowData = columnasFiltradas.map(col => {
                    let value;

                    if (typeof col.selector === "function") {
                        try {
                            value = col.selector(row);
                        } catch {
                            value = "";
                        }
                    } else {
                        value = row[col.selector];
                    }

                    if (value && typeof value === "object") {
                        if (value.props && value.props.children) {
                            value = Array.isArray(value.props.children)
                                ? value.props.children.join("")
                                : value.props.children;
                        } else {
                            value = "";
                        }
                    }

                    if (col.name === "Monto" && row.monto !== undefined) {
                        value = `{formatMoneda(row.monto)`;
                    }

                    return value || "";
                });
                return rowData;
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: "grid",
                styles: {
                    halign: "center",
                    valign: "middle",
                },
                headStyles: {
                    halign: "center",
                    valign: "middle",
                    fillColor: [240, 240, 240],
                    textColor: 20,
                    fontStyle: "bold",
                },
            });

            // 🧾 Usa la prop title para nombrar el archivo
            doc.save(`${title || "data"}.pdf`);
            setIsExporting(false);
        }, 100);
    };

    const handleColumnVisibilityChange = (columnName) => {
        setVisibleColumns(prevVisibleColumns =>
            prevVisibleColumns.includes(columnName)
                ? prevVisibleColumns.filter(name => name !== columnName)
                : [...prevVisibleColumns, columnName]
        );
    };

    const selectAllColumns = () => {
        setVisibleColumns(columnas.map(col => col.name));
    };

    const deselectAllColumns = () => {
        setVisibleColumns([]);
    };

    const filteredColumns = columnas.filter(col => visibleColumns.includes(col.name));

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6',
                fontWeight: '600',
                fontSize: '14px',
                color: '#495057',
                minHeight: '52px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                fontSize: '13px',
                color: '#212529',
                minHeight: '48px',
                '&:hover': {
                    backgroundColor: '#f1f3f5',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                },
            },
            stripedStyle: {
                backgroundColor: '#f8f9fa',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #dee2e6',
                fontSize: '13px',
                minHeight: '56px',
                backgroundColor: '#ffffff',
            },
        },
    };

    return (
        <section className="datatable-container">
            <style>{`
                .datatable-container {
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }

                .search-bar-container {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .search-input-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                    pointer-events: none;
                }

                .search-input {
                    padding-left: 40px !important;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    padding: 10px 12px;
                    font-size: 14px;
                    width: 100%;
                    transition: all 0.2s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .btn-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 500;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }

                .btn-action:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .btn-action:active {
                    transform: translateY(0);
                }

                .btn-csv {
                    background-color: #198754;
                    color: white;
                }

                .btn-csv:hover {
                    background-color: #157347;
                }

                .btn-pdf {
                    background-color: #dc3545;
                    color: white;
                }

                .btn-pdf:hover {
                    background-color: #bb2d3b;
                }

                .btn-columns {
                    background-color: #0d6efd;
                    color: white;
                }

                .btn-columns:hover {
                    background-color: #0b5ed7;
                }

                .btn-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .stats-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 12px;
                    background: #e7f5ff;
                    color: #0d6efd;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* Modal personalizado */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-content-custom {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-header-custom {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px 24px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title-custom {
                    font-weight: 600;
                    font-size: 18px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .modal-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }

                .modal-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .modal-body-custom {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                }

                .modal-footer-custom {
                    padding: 16px 24px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .column-actions {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #dee2e6;
                }

                .btn-column-action {
                    flex: 1;
                    padding: 8px 12px;
                    font-size: 13px;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    background: white;
                    color: #495057;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .btn-column-action:hover {
                    background: #f8f9fa;
                    border-color: #adb5bd;
                }

                .column-checkbox-wrapper {
                    padding: 10px;
                    border-radius: 6px;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                }

                .column-checkbox-wrapper:hover {
                    background-color: #f8f9fa;
                }

                .column-checkbox {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    user-select: none;
                }

                .column-checkbox input {
                    margin-right: 8px;
                    cursor: pointer;
                }

                .btn-modal {
                    padding: 8px 16px;
                    font-size: 14px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-modal-light {
                    background: #f8f9fa;
                    color: #495057;
                }

                .btn-modal-light:hover {
                    background: #e2e6ea;
                }

                .btn-modal-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-modal-primary:hover {
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                @media (max-width: 768px) {
                    .search-bar-container {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .search-input-wrapper {
                        max-width: 100%;
                    }

                    .action-buttons {
                        justify-content: stretch;
                    }

                    .btn-action {
                        flex: 1;
                        justify-content: center;
                    }

                    .modal-content-custom {
                        width: 95%;
                        margin: 10px;
                    }
                }
            `}</style>

            <div className="search-bar-container" hidden={hiddenOptions}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <div className="search-input-wrapper">
                            <i className="fa fa-search search-icon" />
                            <input
                                type="search"
                                value={filterValue}
                                onChange={handleFilterChange}
                                className="search-input"
                                placeholder="Buscar en todos los campos..."
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

                            <div className="action-buttons">
                                <CSVLink
                                    data={csvContent}
                                    filename={`${title || "data"}.csv`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <button className="btn-action btn-csv">
                                        <i className="fas fa-file-csv" />
                                        <span>CSV</span>
                                    </button>
                                </CSVLink>

                                <button
                                    onClick={downloadPDF}
                                    className="btn-action btn-pdf"
                                    disabled={isExporting}
                                >
                                    <i className="fas fa-file-pdf" />
                                    <span>{isExporting ? 'Exportando...' : 'PDF'}</span>
                                </button>

                                <button
                                    className="btn-action btn-columns"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fas fa-columns" />
                                    <span>Columnas</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={filteredColumns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                striped
                highlightOnHover
                pointerOnHover
                responsive
                filterValue={filterValue}
                onFilterValueChange={handleFilterChange}
                clearOnFilter
                onRowDoubleClicked={handleDoubleClick}
                customStyles={customStyles}
                noDataComponent={
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                        <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>No se encontraron registros</p>
                    </div>
                }
            />

            {/* Modal personalizado */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-custom">
                            <h5 className="modal-title-custom">
                                <i className="fas fa-columns" />
                                Gestionar Columnas
                            </h5>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <div className="modal-body-custom">
                            <div className="column-actions">
                                <button className="btn-column-action" onClick={selectAllColumns}>
                                    <i className="fas fa-check-double" />
                                    Seleccionar Todo
                                </button>
                                <button className="btn-column-action" onClick={deselectAllColumns}>
                                    <i className="fas fa-times" />
                                    Deseleccionar Todo
                                </button>
                            </div>

                            {columnas.map(col => (
                                <div key={col.name} className="column-checkbox-wrapper">
                                    <label className="column-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.includes(col.name)}
                                            onChange={() => handleColumnVisibilityChange(col.name)}
                                        />
                                        {col.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer-custom">
                            <button className="btn-modal btn-modal-light" onClick={() => setShowModal(false)}>
                                Cerrar
                            </button>
                            <button className="btn-modal btn-modal-primary" onClick={() => setShowModal(false)}>
                                <i className="fas fa-check" />
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DataTablecustom;