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
                
                <!-- Tarjetas de estadísticas principales -->
                <?php if (tienePermiso('reportes') || tienePermiso('pagos')): ?>
                <div class="row g-4 mb-4">
                    <div class="col-lg-3 col-md-6">
                        <div class="card text-white bg-success shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="card-title mb-0">Total Recaudado</h6>
                                        <h3 class="mb-0 mt-2" id="totalRecaudado">$0.00</h3>
                                        <small>Histórico</small>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fa-solid fa-dollar-sign"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <div class="card text-white bg-primary shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="card-title mb-0">Total de Pagos</h6>
                                        <h3 class="mb-0 mt-2" id="totalPagos">0</h3>
                                        <small>Registrados</small>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fa-solid fa-receipt"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <div class="card text-white bg-warning shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="card-title mb-0">Pagos Pendientes</h6>
                                        <h3 class="mb-0 mt-2" id="pagosPendientes">0</h3>
                                        <small>Por confirmar</small>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fa-solid fa-clock"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <div class="card text-white bg-info shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="card-title mb-0">Este Mes</h6>
                                        <h3 class="mb-0 mt-2" id="totalMes">$0.00</h3>
                                        <small>Recaudado</small>
                                    </div>
                                    <div class="fs-1 opacity-75">
                                        <i class="fa-solid fa-calendar-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Gráficas -->
                <?php if (tienePermiso('reportes')): ?>
                <div class="row g-4">
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Recaudación Mensual</h5>
                                <div class="chart-container">
                                    <canvas id="chartRecaudacion"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Pagos por Método</h5>
                                <div class="chart-container">
                                    <canvas id="chartMetodos"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Pacientes Registrados</h5>
                                <div class="chart-container">
                                    <canvas id="chartPacientes"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Estadísticas Generales</h5>
                                <div class="p-3">
                                    <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                        <span><i class="fa-solid fa-users me-2 text-primary"></i>Total Pacientes:</span>
                                        <strong id="totalPacientes">0</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                        <span><i class="fa-solid fa-calendar-days me-2 text-success"></i>Total Citas:</span>
                                        <strong id="totalCitas">0</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                        <span><i class="fa-solid fa-money-bill-wave me-2 text-warning"></i>Promedio por Pago:</span>
                                        <strong id="promedioPago">$0.00</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
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