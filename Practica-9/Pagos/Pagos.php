<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'pagos';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Pagos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <?php require_once '../sidebar.php'; ?>
            
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="mb-0">Gestión de Pagos</h1>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPago">
                        <i class="fa-solid fa-plus"></i> Registrar Pago
                    </button>
                </div>

                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Historial de Pagos</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <input type="text" id="buscarPago" class="form-control" placeholder="Buscar por paciente, médico o servicio...">
                            </div>
                            <div class="col-md-3">
                                <select id="filtroEstado" class="form-select">
                                    <option value="">Todos los estados</option>
                                    <option value="1">Pagado</option>
                                    <option value="0">Pendiente</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select id="filtroMetodo" class="form-select">
                                    <option value="">Todos los métodos</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Paciente</th>
                                        <th>Médico</th>
                                        <th>Servicio</th>
                                        <th>Monto</th>
                                        <th>Método</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="listaPagos">
                                    <tr>
                                        <td colspan="9" class="text-center text-muted py-4">
                                            Cargando pagos...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <div class="modal fade" id="modalPago" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="tituloModalPago">
                        <i class="fa-solid fa-money-bill"></i> Registrar Pago
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formPago">
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Cita *</label>
                                <select class="form-select" id="idCitaPago" required>
                                    <option value="">Seleccione una cita</option>
                                </select>
                                <small class="text-muted">El paciente, médico y tarifa se cargarán automáticamente</small>
                            </div>
                        </div>

                        <div class="row" id="detallesCita" style="display: none;">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Paciente</label>
                                <input type="text" class="form-control" id="nombrePacienteInfo" readonly>
                                <input type="hidden" id="idPacientePago">
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Médico</label>
                                <input type="text" class="form-control" id="nombreMedicoInfo" readonly>
                                <input type="hidden" id="idMedicoPago">
                            </div>
                        </div>

                        <div class="row" id="seccionTipo" style="display: none;">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Tipo de Servicio *</label>
                                <select class="form-select" id="tipoServicio" required>
                                    <option value="">Seleccione el tipo de servicio</option>
                                    <option value="consulta">Consulta Médica</option>
                                    <option value="servicio">Servicio Adicional</option>
                                </select>
                            </div>
                        </div>

                        <div class="row" id="seccionConsulta" style="display: none;">
                            <div class="col-md-12 mb-3">
                                <div class="alert alert-info">
                                    <strong>Consulta Médica</strong><br>
                                    Tarifa del Dr(a). <span id="nombreMedicoTarifa"></span>: 
                                    <strong class="fs-5">$<span id="tarifaConsultaInfo">0.00</span></strong>
                                </div>
                            </div>
                        </div>

                        <div class="row" id="seccionServicio" style="display: none;">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Servicio Adicional *</label>
                                <select class="form-select" id="idTarifaPago">
                                    <option value="">Seleccione un servicio</option>
                                </select>
                            </div>
                        </div>

                        <div class="row" id="seccionPago" style="display: none;">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Monto Total *</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" id="montoPago" step="0.01" min="0" required readonly>
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Método de Pago *</label>
                                <select class="form-select" id="metodoPago" required>
                                    <option value="">Seleccione un método</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                        </div>

                        <div class="row" id="seccionEstado" style="display: none;">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Estado del Pago *</label>
                                <select class="form-select" id="estatusPago" required>
                                    <option value="1">Pagado</option>
                                    <option value="0">Pendiente</option>
                                </select>
                            </div>
                        </div>

                        <input type="hidden" id="idPago">
                        <input type="hidden" id="tarifaConsultaHidden">
                        
                        <button type="button" class="btn btn-primary w-100" onclick="guardarPago()" id="btnGuardarPago" style="display: none;">
                            <i class="fa-solid fa-save"></i> Guardar Pago
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalDetallePago" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-info text-white">
                    <h5 class="modal-title">
                        <i class="fa-solid fa-info-circle"></i> Detalles del Pago
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <h6>ID Pago:</h6>
                        <p id="detalleIdPago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Paciente:</h6>
                        <p id="detallePacientePago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Médico:</h6>
                        <p id="detalleMedicoPago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Servicio:</h6>
                        <p id="detalleServicio" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Monto:</h6>
                        <p id="detalleMontoPago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Método de Pago:</h6>
                        <p id="detalleMetodoPago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Fecha de Pago:</h6>
                        <p id="detalleFechaPago" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Estado:</h6>
                        <p id="detalleEstadoPago" class="ms-3">-</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/scriptPagos.js"></script>
</body>

</html>