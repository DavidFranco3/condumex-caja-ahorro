import { getRazonSocial, getTokenApi, obtenidusuarioLogueado } from "../../../api/auth";
import { registroInicialSaldosSocio, 
    actualizaSaldosSocios, 
    obtenerFolioActualSaldosSocios, 
    obtenerInfoxFichaSaldoSocios 
} from "../../../api/saldosSocios";
import Swal from "sweetalert2";

// Realiza la modificación de saldos al realizar un movimiento
export const actualizacionSaldosSocios = async (fichaSocio, ingresaAportacion, ingresaPatrimonio, ingresaRendimiento, folioMovimiento, movimiento) => {
    try {
        await obtenerInfoxFichaSaldoSocios(fichaSocio).then(response => {
            const { data } = response;
            const { _id, aportacion, patrimonio, rendimiento } = data;

            // Se recibe solamente lo ingresado, hya que sumar lo ingresado con lo que tiene en ->
            // Aportaciones, prestamos, patrimonio

            let finalAportacion = aportacion;
            let finalPatrimonio = patrimonio;
            let finalRendimiento = rendimiento;

            // Evaluar caso especial en caso de eliminar la aportación
            if (movimiento === "Aportación") {
                finalAportacion = parseFloat(finalAportacion) + parseFloat(ingresaAportacion)
            } else if (movimiento === "Patrimonio") {
                finalPatrimonio = parseFloat(finalPatrimonio) + parseFloat(ingresaPatrimonio)
            } else if (movimiento === "Interés") {
                finalRendimiento = parseFloat(finalRendimiento) + parseFloat(ingresaRendimiento)
            } else if (movimiento === "Retiro") {
                finalAportacion = parseFloat(finalAportacion) - parseFloat(ingresaAportacion)
            } else if (movimiento === "Baja Socio") {
                finalAportacion = parseFloat(finalAportacion) - parseFloat(ingresaAportacion)
                finalPatrimonio = parseFloat(finalPatrimonio) - parseFloat(ingresaPatrimonio)
                finalRendimiento = parseFloat(finalRendimiento) - parseFloat(ingresaRendimiento)
            } else if (movimiento === "Eliminación aportación") {
                finalAportacion = parseFloat(finalAportacion) - parseFloat(ingresaAportacion)
            } else if (movimiento === "Eliminación patrimonio") {
                finalPatrimonio = parseFloat(finalPatrimonio) - parseFloat(ingresaPatrimonio)
            } else if (movimiento === "Eliminación interés") {
                finalRendimiento = parseFloat(finalRendimiento) - parseFloat(ingresaRendimiento)
            } else if (movimiento === "Eliminación retiro") {
                finalAportacion = parseFloat(finalAportacion) + parseFloat(ingresaAportacion)
            }

            const dataTemp = {
                fichaSocio: parseInt(fichaSocio),
                aportacion: finalAportacion,
                patrimonio: finalPatrimonio,
                rendimiento: finalRendimiento,
                folioMovimiento: folioMovimiento,
                movimiento: movimiento
            }

            // Inicia actualización de saldos de los socios
            actualizaSaldosSocios(_id, dataTemp).then(response => {
                const { data } = response;
                Swal.fire({
                        title: data.mensaje,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                // console.log("Actualización de saldo personal")

            }).catch(e => {
                // console.log(e)
            })
            // Termina actualización de saldos de los socios

        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        // console.log(e)
    }
}
