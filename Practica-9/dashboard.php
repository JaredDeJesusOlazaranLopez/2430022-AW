<?php 
require_once 'verificar_sesion.php'; 
$paginaActual = 'dashboard';
$nivelCarpeta = '';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
             <?php require_once 'sidebar.php'; ?>

            <main class="col-md-9 ms-sm-auto col-lg-10 mt-4 px-md-4">
                <h1 class="mb-4 pb-3 text-center border-bottom">Dashboard</h1>
                <?php if (tienePermiso('reportes')): ?>
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Pacientes por mes</h5>
                                <div class="chart-container">
                                    <canvas id="chartLine"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Citas por especialidad</h5>
                                <div class="chart-container">
                                    <canvas id="chartBar"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php else: ?>
                <div class="alert alert-warning">
                    <i class="fa-solid fa-exclamation-triangle me-2"></i>
                    No tienes permisos para ver las estadisticas completas.
                </div>
                <?php endif; ?>

                <div class="row mt-4">
                    <div class="col-12">
                        <h4>Tus permisos actuales:</h4>
                        <ul class="list-group">
                            <?php if (tienePermiso('pacientes')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Pacientes
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('agenda')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Agenda
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('medicos')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Médicos
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('especialidades')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Especialidades
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('reportes')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Visualización de Reportes
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('pagos')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Pagos
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('tarifas')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Gestión de Tarifas
                            </li>
                            <?php endif; ?>
                            
                            <?php if (tienePermiso('bitacoras')): ?>
                            <li class="list-group-item">
                                <i class="fa-solid fa-check text-success me-2"></i> 
                                Visualización de Bitácoras
                            </li>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>

                <footer class="mt-5 pt-4 border-top">
                    <p class="text-center text-muted small mb-0">&copy; Mi clinica :D</p>
                </footer>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/scriptD.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>