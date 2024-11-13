// Rutas de la API

// Login
export const ENDPOINTLoginAdministrador = '/login'

// Usuarios
export const ENDPOINTRegistraUsuarios = '/usuarios/registro'
export const ENDPOINTListarUsuarios = '/usuarios/listar'
export const ENDPOINTTotalUsuarios = '/usuarios/total'
export const ENDPOINTObtenerUsuario = '/usuarios/obtener'
export const ENDPOINTEliminarUsuario = '/usuarios/eliminar'
export const ENDPOINTActualizarUsuario = '/usuarios/actualizar'
export const ENDPOINTDeshabilitaUsuario = '/usuarios/deshabilitar'
export const ENDPOINTListarUsuariosPaginacion = '/usuarios/listarPaginando'

// Correos
export const ENDPOINTEnviarCorreos = '/correos/enviar'
export const ENDPOINTEnviarEspecialCorreos = '/correos/enviarCorreo'

// Patrimonio
export const ENDPOINTPatrimonio = '/patrimonio'
export const ENDPOINTRegistroPatrimonio = '/patrimonio/registro'
export const ENDPOINTTotalPatrimonio = '/patrimonio/numeroPatrimonios'
export const ENDPOINTListarPatrimonioPeriodo = '/patrimonio/listarPeriodo'
export const ENDPOINTListarPatrimonio = '/patrimonio/listar'
export const ENDPOINTListarPatrimonios = '/patrimonio/listarPatrimonios'
export const ENDPOINTTotalxTipoPatrimonio = '/patrimonio/totalxTipo'
export const ENDPOINTTotalxTipoSocioPatrimonio = '/patrimonio/totalxTipoSocio'
export const ENDPOINTListarPaginandoPatrimonio = '/patrimonio/listarPaginando'
export const ENDPOINTListarPaginandoPatrimonioxTipo =
  '/patrimonio/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioPatrimonio = '/patrimonio/obtenerFolio'
export const ENDPOINTObtenerPatrimonio = '/patrimonio/obtener'
export const ENDPOINTObtenerxFichaPatrimonio = '/patrimonio/obtenerxFicha'
export const ENDPOINTEliminarPatrimonio = '/patrimonio/eliminar'
export const ENDPOINTActualizarPatrimonio = '/patrimonio/actualizar'
export const ENDPOINTObtenerPatrimoniosAcumuladosByRazon =
  '/patrimonio/acumuladoByRazonSocial'
export const ENDPOINTEliminarPatrimoniosMasivo = '/patrimonio/eliminarMasivo'

// Aportaciones
export const ENDPOINTAportaciones = '/aportaciones'
export const ENDPOINTTotalSocio = '/aportaciones/totalGeneralBySocio'
export const ENDPOINTRegistroAportaciones = '/aportaciones/registro'
export const ENDPOINTRegistroAportaciones2 = '/aportaciones/registro2'
export const ENDPOINTListarAportaciones = '/aportaciones/listar'
export const ENDPOINTListarAportacionesPeriodo = '/aportaciones/listarPeriodo'
export const ENDPOINTListarAportacion = '/aportaciones/listarAportaciones'
export const ENDPOINTNumeroAportaciones = '/aportaciones/numeroAportaciones'
export const ENDPOINTTotalxTipoAportaciones = '/aportaciones/totalxTipo'
export const ENDPOINTListarPaginandoAportaciones =
  '/aportaciones/listarPaginando'
export const ENDPOINTPaginandoxAportacionesTipo =
  '/aportaciones/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioAportaciones = '/aportaciones/obtenerFolio'
export const ENDPOINTObtenerAportaciones = '/aportaciones/obtener'
export const ENDPOINTObtenerxFichaAportaciones = '/aportaciones/obtenerxFicha'
export const ENDPOINTEliminarAportaciones = '/aportaciones/eliminar'
export const ENDPOINTActualizarAportaciones = '/aportaciones/actualizar'
export const ENDPOINTObtenerAportacionesAcumuladasByTipo =
  '/aportaciones/acumuladoByTipo'
export const ENDPOINTObtenerAportacionesAcumuladasByRazon =
  '/aportaciones/acumuladoByRazonSocial'
export const ENDPOINTEliminarAportacionesMasivo = '/aportaciones/eliminarMasivo'

// Rendimientos
export const ENDPOINTRendimientos = '/rendimientos'
export const ENDPOINTRegistroRendimientos = '/rendimientos/registro'
export const ENDPOINTRegistroRendimientos2 = '/rendimientos/registro2'
export const ENDPOINTListarRendimientos = '/rendimientos/listar'
export const ENDPOINTListarRendimientosPeriodo = '/rendimientos/listarPeriodo'
export const ENDPOINTListarRendimiento = '/rendimientos/listarRendimientos'
export const ENDPOINTNumeroRendimientos = '/rendimientos/numeroRendimientos'
export const ENDPOINTTotalxTipoRendimientos = '/rendimientos/totalxTipo'
export const ENDPOINTListarPaginandoRendimientos =
  '/rendimientos/listarPaginando'
export const ENDPOINTPaginandoxRendimientosTipo =
  '/rendimientos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioRendimientos = '/rendimientos/obtenerFolio'
export const ENDPOINTObtenerRendimientos = '/rendimientos/obtener'
export const ENDPOINTObtenerxFichaRendimientos = '/rendimientos/obtenerxFicha'
export const ENDPOINTEliminarRendimientos = '/rendimientos/eliminar'
export const ENDPOINTActualizarRendimientos = '/rendimientos/actualizar'
export const ENDPOINTTotalGeneralByRazon = '/rendimientos/totalGeneralByRazon'
export const ENDPOINTTotalGeneralBySocios = '/rendimientos/totalGeneralBySocios'
export const ENDPOINTObtenerRendimientosAcumuladosByRazon =
  '/rendimientos/acumuladoByRazonSocial'
export const ENDPOINTEliminarRendimientosMasivo = '/rendimientos/eliminarMasivo'
export const ENDPOINTObtenerRendimientoxFichaSaldos =
  '/rendimientos/obtenerRendimientoxFicha'

// Prestamos
export const ENDPOINTPrestamos = '/prestamos'
export const ENDPOINTRegistroPrestamos = '/prestamos/registro'
export const ENDPOINTListarPrestamos = '/prestamos/listar'
export const ENDPOINTListarPrestamosPeriodo = '/prestamos/listarPeriodo'
export const ENDPOINTListarPrestamo = '/prestamos/listarPrestamos'
export const ENDPOINTTotalPrestamos = '/prestamos/numeroPrestamos'
export const ENDPOINTTotalxTipoPrestamos = '/prestamos/totalxTipo'
export const ENDPOINTTotalxTipoSocioPrestamos = '/prestamos/totalxTipoSocio'
export const ENDPOINTListarPaginandoPrestamos = '/prestamos/listarPaginando'
export const ENDPOINTListarPaginandoPrestamosxTipo =
  '/prestamos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioPrestamos = '/prestamos/obtenerFolio'
export const ENDPOINTObtenerPrestamos = '/prestamos/obtener'
export const ENDPOINTObtenerxFichaPrestamos = '/prestamos/obtenerxFicha'
export const ENDPOINTObtenerxFechaPrestamos = '/prestamos/obtenerxFecha'
export const ENDPOINTEliminarPrestamos = '/prestamos/eliminar'
export const ENDPOINTActualizarPrestamos = '/prestamos/actualizar'
export const ENDPOINTActualizarTotalPrestamos =
  '/prestamos/actualizarTotalPrestamo'
export const ENDPOINTObtenerPrestamosAcumuladosByRazon =
  '/prestamos/acumuladoByRazonSocial'
export const ENDPOINTEliminarPrestamosMasivo = '/prestamos/eliminarMasivo'

// Abonos
export const ENDPOINTAbonos = '/abonos'
export const ENDPOINTRegistroAbonos = '/abonos/registro'
export const ENDPOINTListarAbonos = '/abonos/listar'
export const ENDPOINTListarAbonosPeriodo = '/abonos/listarPeriodo'
export const ENDPOINTListarAbono = '/abonos/listarAbonos'
export const ENDPOINTTotalAbonos = '/abonos/numeroAbonos'
export const ENDPOINTTotalxTipoAbonos = '/abonos/totalxTipo'
export const ENDPOINTListarPaginandoAbonos = '/abonos/listarPaginando'
export const ENDPOINTListarPaginandoAbonosxTipo = '/abonos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioAbonos = '/abonos/obtenerFolio'
export const ENDPOINTObtenerAbonos = '/abonos/obtener'
export const ENDPOINTObtenerxFichaAbonos = '/abonos/obtenerxFicha'
export const ENDPOINTEliminarAbonos = '/abonos/eliminar'
export const ENDPOINTActualizarAbonos = '/abonos/actualizar'
export const ENDPOINTObtenerAbonosAcumuladosByRazon =
  '/abonos/acumuladoByRazonSocial'
export const ENDPOINTEliminarAbonosMasivo = '/abonos/eliminarMasivo'

// Periodos
export const ENDPOINTRegistroPeriodos = '/periodos/registro'
export const ENDPOINTListarPeriodo = '/periodos/listarPeriodos'
export const ENDPOINTTotalPeriodos = '/periodos/numeroPeriodos'
export const ENDPOINTTotalxTipoPeriodos = '/periodos/totalxTipo'
export const ENDPOINTListarPaginandoPeriodos = '/periodos/listarPaginando'
export const ENDPOINTListarPaginandoPeriodosxTipo = '/periodos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioPeriodos = '/periodos/obtenerFolio'
export const ENDPOINTObtenerPeriodos = '/periodos/obtener'
export const ENDPOINTEliminarPeriodos = '/periodos/eliminar'
export const ENDPOINTActualizarPeriodos = '/periodos/actualizar'

// Deudas de los socios
export const ENDPOINTDeudaSocio = '/deudaSocio'
export const ENDPOINTRegistroDeudaSocio = '/deudaSocio/registro'
export const ENDPOINTListarDeudaSocio = '/deudaSocio/listar'
export const ENDPOINTListarDeudasSociosPeriodo = '/deudaSocio/listarPeriodo'
export const ENDPOINTListarDeudasSocios = '/deudaSocio/listarDeudaSocio'
export const ENDPOINTTotalDeudaSocio = '/deudaSocio/numeroDeudas'
export const ENDPOINTTotalxTipoDeudaSocio = '/deudaSocio/totalxTipo'
export const ENDPOINTListarPaginandoDeudaSocio = '/deudaSocio/listarPaginando'
export const ENDPOINTListarPaginandoDeudaSocioxTipo =
  '/deudaSocio/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioDeudaSocio = '/deudaSocio/obtenerFolio'
export const ENDPOINTObtenerDeudaSocio = '/deudaSocio/obtener'
export const ENDPOINTObtenerxFichaDeudaSocio = '/deudaSocio/obtenerxFicha'
export const ENDPOINTEliminarDeudaSocio = '/deudaSocio/eliminar'
export const ENDPOINTActualizarDeudaSocio = '/deudaSocio/actualizar'
export const ENDPOINTObtenerDeudaSocioAcumuladosByRazon =
  '/deudaSocio/acumuladoByRazonSocial'
export const ENDPOINTEliminarDeudaSocioMasivo = '/deudaSocio/eliminarMasivo'

// Baja de socios
export const ENDPOINTBajaSocios = '/bajaSocios'
export const ENDPOINTRegistroBajaSocios = '/bajaSocios/registro'
export const ENDPOINTListarBajaSocios = '/bajaSocios/listar'
export const ENDPOINTListarBajaSociosPeriodo = '/bajaSocios/listarPeriodo'
export const ENDPOINTListarBajasSocios = '/bajaSocios/listarBajas'
export const ENDPOINTTotalBajaSocios = '/bajaSocios/numeroBajas'
export const ENDPOINTTotalxTipoBajaSocios = '/bajaSocios/totalxTipo'
export const ENDPOINTListarPaginandoBajaSocios = '/bajaSocios/listarPaginando'
export const ENDPOINTListarPaginandoBajaSociosxTipo =
  '/bajaSocios/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioBajaSocios = '/bajaSocios/obtenerFolio'
export const ENDPOINTObtenerBajaSocios = '/bajaSocios/obtener'
export const ENDPOINTObtenerxFichaBajaSocios = '/bajaSocios/obtenerxFicha'
export const ENDPOINTEliminarBajaSocios = '/bajaSocios/eliminar'

// Parametros
export const ENDPOINTRegistroParametros = '/parametros/registro'
export const ENDPOINTListarParametros = '/parametros/listar'
export const ENDPOINTTotalParametros = '/parametros/numeroParametros'
export const ENDPOINTListarPaginandoParametros = '/parametros/listarPaginando'
export const ENDPOINTEliminarParametros = '/parametros/eliminar'
export const ENDPOINTActualizarParametros = '/parametros/actualizar'

// Retiros
export const ENDPOINTRetiros = '/retiros'
export const ENDPOINTRegistroRetiros = '/retiros/registro'
export const ENDPOINTListarRetiros = '/retiros/listar'
export const ENDPOINTListarRetirosPeriodo = '/retiros/listarPeriodo'
export const ENDPOINTListarRetiro = '/retiros/listarRetiros'
export const ENDPOINTTotalRetiros = '/retiros/numeroRetiros'
export const ENDPOINTTotalxTipoRetiros = '/retiros/totalxTipo'
export const ENDPOINTListarPaginandoRetiros = '/retiros/listarPaginando'
export const ENDPOINTListarPaginandoRetirosxTipo =
  '/retiros/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioRetiros = '/retiros/obtenerFolio'
export const ENDPOINTObtenerRetiros = '/retiros/obtener'
export const ENDPOINTObtenerxFichaRetiros = '/retiros/obtenerxFicha'
export const ENDPOINTEliminarRetiros = '/retiros/eliminar'
export const ENDPOINTActualizarRetiros = '/retiros/actualizar'
export const ENDPOINTObtenerRetirosAcumuladasByRazon =
  '/retiros/acumuladoByRazonSocial'
export const ENDPOINTEliminarRetirosMasivo = '/retiros/eliminarMasivo'

// Movimientos de saldos
export const ENDPOINTRegistroMovimientosSaldos = '/movimientosSaldos/registro'
export const ENDPOINTListarMovimientosSaldos = '/movimientosSaldos/listar'
export const ENDPOINTListarMovimientosSaldosPeriodo = '/movimientosSaldos/listarPeriodo'
export const ENDPOINTTotalMovimientosSaldos =
  '/movimientosSaldos/numeroMovimientos'
export const ENDPOINTTotalxTipoMovimientosSaldos =
  '/movimientosSaldos/totalxTipo'
export const ENDPOINTListarPaginandoMovimientosSaldos =
  '/movimientosSaldos/listarPaginando'
export const ENDPOINTListarPaginandoMovimientoSaldosxTipo =
  '/movimientosSaldos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioMovimientosSaldos =
  '/movimientosSaldos/obtenerFolio'
export const ENDPOINTObtenerMovimientosSaldos = '/movimientosSaldos/obtener'
export const ENDPOINTObtenerxFichaMovimientosSaldos =
  '/movimientosSaldos/obtenerxFicha'
export const ENDPOINTEliminarMovimientosSaldos = '/movimientosSaldos/eliminar'
export const ENDPOINTActualizarMovimientosSaldos =
  '/movimientosSaldos/actualizar'

// Socios empleados
export const ENDPOINTRegitroSociosEmpleados = '/empleados/registro'
export const ENDPOINTListarSociosEmpleados = '/empleados/listar'
export const ENDPOINTTotalSociosEmpleados = '/empleados/total'
export const ENDPOINTListarPaginandoSociosEmpleados =
  '/empleados/listarPaginando'
export const ENDPOINTObtenerFichaSociosEmpleados = '/empleados/obtenerFicha'
export const ENDPOINTObtenerSociosEmpleados = '/empleados/obtener'
export const ENDPOINTObtenerxFichaSociosEmpleados = '/empleados/obtenerxFicha'
export const ENDPOINTObtenerNombrexFichaSociosEmpleados =
  '/empleados/obtenerNombrexFicha'
export const ENDPOINTEliminarSociosEmpleados = '/empleados/eliminar'
export const ENDPOINTDeshabilitarSociosEmpleados = '/empleados/deshabilitar'
export const ENDPOINTActualizarSociosEmpleados = '/empleados/actualizar'
export const ENDPOINTObtenerEmpleadosByNombre = '/empleados/obtenerByNombre'
export const ENDPOINTEliminarEmpleadosMasivo = '/empleados/eliminarMasivo'

// Socios sindicalizados
export const ENDPOINTRegistroSociosSindicalizados = '/sindicalizados/registro'
export const ENDPOINTListarSociosSindicalizados = '/sindicalizados/listar'
export const ENDPOINTTotalSociosSindicalizados = '/sindicalizados/total'
export const ENDPOINTListarPaginandoSociosSindicalizados =
  '/sindicalizados/listarPaginando'
export const ENDPOINTObtenerFichaSociosSindicalizados =
  '/sindicalizados/obtenerFicha'
export const ENDPOINTObtenerSociosSindicalizados = '/sindicalizados/obtener'
export const ENDPOINTObtenerxFichaSociosSindicalizados =
  '/sindicalizados/obtenerxFicha'
export const ENDPOINTObtenerNombrexFichaSociosSindicalizados =
  '/sindicalizados/obtenerNombrexFicha'
export const ENDPOINTEliminarSociosSindicalizados = '/sindicalizados/eliminar'
export const ENDPOINTDeshabilitarSociosSindicalizados =
  '/sindicalizados/deshabilitar'
export const ENDPOINTActualizarSociosSindicalizados =
  '/sindicalizados/actualizar'
export const ENDPOINTObtenerSindicalizadosByNombre =
  '/sindicalizados/obtenerByNombre'
export const ENDPOINTEliminarSindicalizadosMasivo =
  '/sindicalizados/eliminarMasivo'

// Socios Especiales -- Contabilidad y Peregrinación
export const ENDPOINTRegistroSociosEspeciales = '/sociosEspeciales/registro'
export const ENDPOINTListarSociosEspeciales = '/sociosEspeciales/listar'
export const ENDPOINTTotalSociosEspeciales = '/sociosEspeciales/total'
export const ENDPOINTListarPaginandoSociosEspeciales =
  '/sociosEspeciales/listarPaginando'
export const ENDPOINTObtenerFichaSociosEspeciales =
  '/sociosEspeciales/obtenerFicha'
export const ENDPOINTObtenerSociosEspeciales = '/sociosEspeciales/obtener'
export const ENDPOINTObtenerxFichaSociosEspeciales =
  '/sociosEspeciales/obtenerxFicha'
export const ENDPOINTEliminarSociosEspeciales = '/sociosEspeciales/eliminar'
export const ENDPOINTDeshabilitarSociosEspeciales =
  '/sociosEspeciales/deshabilitar'
export const ENDPOINTActualizarSociosEspeciales = '/sociosEspeciales/actualizar'
export const ENDPOINTObtenerEspecialesByNombre =
  '/sociosEspeciales/obtenerByNombre'
export const ENDPOINTEliminarEspecialesMasivo =
  '/sociosEspeciales/eliminarMasivo'

// Obtener la información de los respaldos automáticos realizados
export const ENDPOINTTotalInfoRespaldoAutomatico =
  '/infoRespaldosAutomaticos/total'
export const ENDPOINTListarPaginandoInfoRespaldoAutomatico =
  '/infoRespaldosAutomaticos/listarPaginando'
export const ENDPOINTObtenerInfoRespaldoAutomatico =
  '/infoRespaldosAutomaticos/obtener'
export const ENDPOINTObtenerxFolioInfoRespaldoAutomatico =
  '/infoRespaldosAutomaticos/obtenerxFolio'

// Administración de saldos de los socios
export const ENDPOINTRegistroSaldos = '/saldos/registro'
export const ENDPOINTListarSaldos = '/saldos/listar'
export const ENDPOINTTotalSaldos = '/saldos/total'
export const ENDPOINTTotalxTipoSaldos = '/saldos/totalxTipo'
export const ENDPOINTListarPaginandoSaldos = '/saldos/listarPaginando'
export const ENDPOINTListarPaginandoSaldosxTipo = '/saldos/listarPaginandoxTipo'
export const ENDPOINTObtenerFolioActualSaldos = '/saldos/obtenerFolioActual'
export const ENDPOINTObtenerSaldos = '/saldos/obtener'
export const ENDPOINTObtenerxFichaSaldos = '/saldos/obtenerxFichaSocio'
export const ENDPOINTEliminarSaldos = '/saldos/eliminar'
export const ENDPOINTActualizarSaldos = '/saldos/actualizar'
export const ENDPOINTObtenerFichaSaldos = '/saldos/obtenerFicha'

// Saldos globales
export const ENDPOINTRegistroSaldosGlobales = '/saldosGlobales/registro'
export const ENDPOINTListarSaldosGlobales = '/saldosGlobales/listar'
export const ENDPOINTTotalSaldosGlobales = '/saldosGlobales/total'
export const ENDPOINTListarPaginandoSaldosGlobales =
  '/saldosGlobales/listarPaginando'
export const ENDPOINTObtenerFolioSaldosGlobales = '/saldosGlobales/obtenerFolio'
export const ENDPOINTObtenerxIDSaldosGlobales = '/saldosGlobales/obtener'
export const ENDPOINTObtenerxFolioSaldosGlobales =
  '/saldosGlobales/obtenerxFolio'
export const ENDPOINTEliminarSaldosGlobales = '/saldosGlobales/eliminar'
export const ENDPOINTActualizarSaldosGlobales = '/saldosGlobales/actualizar'
