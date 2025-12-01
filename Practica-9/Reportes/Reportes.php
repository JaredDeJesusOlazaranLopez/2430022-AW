<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'reportes';
$nivelCarpeta = '../';

if (!tienePermiso('reportes')) {
    header('Location: ../dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <?php require_once '../sidebar.php'; ?>
            <main class="col-md-9 ms-sm-auto mt-5 col-lg-10 px-md-4">
                <h1><i class="fa-solid fa-chart-line me-2"></i>Reportes</h1>
                
                <div class="card mt-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fa-solid fa-file-pdf me-2"></i>Generar Reporte de Pagos (PDF)</h5>
                    </div>
                    <div class="card-body">
                        <form id="formReportePDF" method="GET" action="../generar_reporte_pagos.php" target="_blank">
                            <div class="row">
                                <div class="col-md-3">
                                    <label class="form-label">Fecha Inicio</label>
                                    <input type="date" class="form-control" name="fecha_inicio" 
                                           value="<?php echo date('Y-m-01'); ?>" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Fecha Fin</label>
                                    <input type="date" class="form-control" name="fecha_fin" 
                                           value="<?php echo date('Y-m-d'); ?>" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Método de Pago</label>
                                    <select class="form-select" name="metodo_pago">
                                        <option value="">Todos</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Estatus</label>
                                    <select class="form-select" name="estatus">
                                        <option value="">Todos</option>
                                        <option value="1">Completados</option>
                                        <option value="0">Pendientes</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-12">
                                    <button type="submit" class="btn btn-danger">
                                        <i class="fa-solid fa-file-pdf me-2"></i>Generar PDF
                                    </button>
                                    <button type="button" class="btn btn-secondary" onclick="resetForm()">
                                        <i class="fa-solid fa-rotate-left me-2"></i>Resetear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Otros reportes -->
                <div class="row mt-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fa-solid fa-users fa-3x text-primary mb-3"></i>
                                <h5>Reporte de Pacientes</h5>
                                <p class="text-muted">Lista completa de pacientes registrados</p>
                                <button class="btn btn-primary btn-sm" disabled>
                                    <i class="fa-solid fa-file-excel"></i> Generar Excel
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fa-solid fa-calendar-check fa-3x text-success mb-3"></i>
                                <h5>Reporte de Citas</h5>
                                <p class="text-muted">Historial de citas médicas</p>
                                <button class="btn btn-success btn-sm" disabled>
                                    <i class="fa-solid fa-file-pdf"></i> Generar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fa-solid fa-chart-bar fa-3x text-warning mb-3"></i>
                                <h5>Estadísticas</h5>
                                <p class="text-muted">Análisis y gráficas generales</p>
                                <button class="btn btn-warning btn-sm" disabled>
                                    <i class="fa-solid fa-chart-line"></i> Ver Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function resetForm() {
            document.getElementById('formReportePDF').reset();
            document.querySelector('[name="fecha_inicio"]').value = '<?php echo date('Y-m-01'); ?>';
            document.querySelector('[name="fecha_fin"]').value = '<?php echo date('Y-m-d'); ?>';
        }
    </script>
</body>
</html>