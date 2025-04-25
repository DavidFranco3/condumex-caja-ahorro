import {
    actualizaSaldosGlobales,
    obtenerDatosxFolio,
    obtenerFolioActualSaldosGlobales,
    registraSaldosGlobalesSistema
} from "../../../api/saldosGlobales";
import Swal from "sweetalert2";

// Registra nuevos saldos globales para inicio de periodos
export function registraSaldosGlobales() {
    try {
        obtenerFolioActualSaldosGlobales().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                totalAportaciones: "0",
                interesGenerado: "0",
                deudaTotal: "0",
                saldoFinal: "0"
            }

            registraSaldosGlobalesSistema(dataTemp).then(response => {
                const { data } = response;
                Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
            }).catch(e => {
                console.log(e)
            })

        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}

// Función que se encarga de actualizar a los nuevos valores los saldos
export function actualizacionSaldosGlobales(nuevoAportacion, nuevoInteres, nuevodeuda, movimiento) {
    try {
        // Obtener el folio actual para actualizar
        obtenerFolioActualSaldosGlobales().then(response => {
            const { data } = response;
            const { folio } = data;
            const folioFinal = parseInt(folio) - 1

            // Obtener los valores de saldos actuales
            obtenerDatosxFolio(folioFinal.toString()).then(response => {
                const { data } = response;
                const { _id, folio, totalAportaciones, interesGenerado, deudaTotal } = data[0];
                console.log("Interes generado por prestamo ", nuevoInteres)
                console.log("Interes acumulado ", interesGenerado)

                // parseFloat(deudaTotal) + parseFloat(nuevodeuda)
                console.log("Deuda que se tiene  ", deudaTotal, " nuevo en deuda ", nuevodeuda)

                // Evaluacion de la condicional movimiento para calcular los nuevos saldos
                // "Eliminación aportación"
                // Aportacion
                let tempTotalAportaciones = 0
                let tempInteresGenerado = 0
                let tempDeudaTotal = 0
                let tempSaldoFinal = 0

                if(movimiento === "Eliminación aportación") {
                    tempTotalAportaciones = parseFloat(totalAportaciones) - parseFloat(nuevoAportacion)
                    tempInteresGenerado = parseFloat(interesGenerado) + parseFloat(nuevoInteres)
                    tempDeudaTotal = parseFloat(deudaTotal) + parseFloat(nuevodeuda)
                    tempSaldoFinal = tempTotalApostaciones + tempInteresGenerado
                } else {
                    // Nuevos saldos
                    tempTotalApostaciones = parseFloat(totalAportaciones) + parseFloat(nuevoAportacion)
                    tempInteresGenerado = parseFloat(interesGenerado) + parseFloat(nuevoInteres)
                    tempDeudaTotal = parseFloat(deudaTotal) + parseFloat(nuevodeuda)
                    tempSaldoFinal = tempTotalApostaciones + tempInteresGenerado
                }

                const dataTemp = {
                    totalAportaciones: tempTotalAportaciones.toString(),
                    interesGenerado: tempInteresGenerado.toString(),
                    deudaTotal: tempDeudaTotal.toString(),
                    saldoFinal: tempSaldoFinal.toString()
                }

                console.log(" ")
                console.log("Para saldos globales")
                console.log(dataTemp)

                actualizaSaldosGlobales(_id, dataTemp).then(response => {
                    const { data } = response;
                    Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    // console.log("Actualizacion de saldos globales")
                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })

        }).catch(e => {
            console.log(e)
        })

    } catch (e) {
        console.log(e)
    }
}
