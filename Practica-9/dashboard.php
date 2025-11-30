<?php require_once 'verificar_sesion.php'; ?>
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
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block min-vh-100 shadow-lg px-0">
                <div class="text-center p-4 border-bottom border-light border-opacity-25">
                    <img src="images/pokeball.png" id="pokeball" alt="pokeball" class="p-2"
                        style="width: 80px; height: 80px;">
                    <h5 class="text-white mt-3 fw-bold">Clinica</h5>
                    <p class="text-white-50 small mb-0"><?php echo htmlspecialchars($nombreUsuario); ?></p>
                    <span class="badge bg-info text-dark"><?php echo ucfirst($rolUsuario); ?></span>
                </div>
                <div class="position-sticky pt-3">
                    <ul class="nav flex-column px-2">
                        <li class="nav-item my-1">
                            <a class="nav-link active text-white bg-white bg-opacity-25 rounded-3 py-3 px-3" href="dashboard.php">
                                <i class="fa-solid fa-house fs-5 mb-2"></i>
                                <span class="fw-semibold">Inicio</span>
                            </a>
                        </li>
                        <?php if ($rolUsuario === 'administrador'): ?>
<li class="nav-item my-1">
    <a class="nav-link text-white rounded-3 py-3 px-3" href="Usuarios/Usuarios.html">
        <i class="fa-solid fa-users fs-5 mb-2"></i>
        <span class="fw-semibold">Usuarios</span>
    </a>
</li>
<?php endif; ?>
                        <?php if (tienePermiso('pacientes')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Pacientes/Pacientes.html">
                                <i class="fa-solid fa-person fs-5 mb-2"></i>
                                <span class="fw-semibold">Pacientes</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('agenda')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Agenda/Agenda.html">
                                <i class="fa-solid fa-calendar fs-5 mb-2"></i>
                                <span class="fw-semibold">Agenda</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('medicos')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Medicos/Medicos.html">
                                <i class="fa-solid fa-stethoscope fs-5 mb-2"></i>
                                <span class="fw-semibold">Medicos</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('reportes')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Reportes.html">
                                <i class="fa-solid fa-clipboard fs-5 mb-2"></i>
                                <span class="fw-semibold">Reportes</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('pagos')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Pagos.html">
                                <i class="fa-solid fa-money-bills fs-5 mb-2"></i>
                                <span class="fw-semibold">Pagos</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('tarifas')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Tarifas.html">
                                <i class="fa-solid fa-receipt fs-5 mb-2"></i>
                                <span class="fw-semibold">Tarifas</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('bitacoras')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Bitacoras.html">
                                <i class="fa-solid fa-file-signature fs-5 mb-2"></i>
                                <span class="fw-semibold">Bitacoras</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <?php if (tienePermiso('especialidades')): ?>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Especialidades/Especialidades.html">
                                <i class="fa-solid fa-flask fs-5 mb-2"></i>
                                <span class="fw-semibold">Especialidades</span>
                            </a>
                        </li>
                        <?php endif; ?>
                        
                        <li class="nav-item mt-5">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="logout.php">
                                <i class="fa-solid fa-right-from-bracket fs-5 mb-2"></i>
                                <span class="fw-semibold">Cerrar Sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

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