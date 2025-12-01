<?php
$nivel = isset($nivelCarpeta) ? $nivelCarpeta : '../';
?>

<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block sidebar">
    <div class="position-sticky pt-3">
        <!-- Header del sidebar -->
        <div class="text-center py-4 mb-3">
            <div class="mb-3">
                <img src="<?php echo $nivel; ?>images/pokeball.png" alt="Logo Clínica" 
                     class="rounded-circle border border-3 border-white shadow" 
                     style="width: 80px; height: 80px; object-fit: cover;">
            </div>
            <h5 class="text-white fw-bold mb-1">Clínica</h5>
            <p class="text-white-50 small mb-2"><?php echo htmlspecialchars($nombreUsuario); ?></p>
            <span class="badge bg-light text-primary px-3 py-1"><?php echo ucfirst($rolUsuario); ?></span>
        </div>

        <hr class="text-white-50 mx-3">

        <!-- Menu items -->
        <ul class="nav flex-column px-3">
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'dashboard') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>dashboard.php">
                    <i class="fa-solid fa-house me-3"></i>
                    <span>Inicio</span>
                </a>
            </li>
            
            <?php if (tienePermiso('pacientes')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'pacientes') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Pacientes/Pacientes.php">
                    <i class="fa-solid fa-person me-3"></i>
                    <span>Pacientes</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('agenda')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'agenda') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Agenda/Agenda.php">
                    <i class="fa-solid fa-calendar me-3"></i>
                    <span>Agenda</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('medicos')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'medicos') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Medicos/Medicos.php">
                    <i class="fa-solid fa-user-doctor me-3"></i>
                    <span>Médicos</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('reportes')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'reportes') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Reportes/Reportes.php">
                    <i class="fa-solid fa-chart-line me-3"></i>
                    <span>Reportes</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('pagos')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'pagos') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Pagos/Pagos.php">
                    <i class="fa-solid fa-money-bill-wave me-3"></i>
                    <span>Pagos</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('tarifas')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'tarifas') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Tarifas/Tarifas.php">
                    <i class="fa-solid fa-tags me-3"></i>
                    <span>Tarifas</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('bitacoras')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'bitacoras') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Bitacoras/Bitacoras.php">
                    <i class="fa-solid fa-clipboard-list me-3"></i>
                    <span>Bitácoras</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('especialidades')): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'especialidades') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Especialidades/Especialidades.php">
                    <i class="fa-solid fa-briefcase-medical me-3"></i>
                    <span>Especialidades</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if ($rolUsuario === 'administrador'): ?>
            <li class="nav-item mb-2">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded <?php echo ($paginaActual == 'usuarios') ? 'active' : ''; ?>" 
                   href="<?php echo $nivel; ?>Usuarios/Usuarios.php">
                    <i class="fa-solid fa-users-gear me-3"></i>
                    <span>Usuarios</span>
                </a>
            </li>
            <?php endif; ?>
        </ul>

        <hr class="text-white-50 mx-3 mt-4">

        <!-- Botón de cerrar sesión -->
        <ul class="nav flex-column px-3 mb-4">
            <li class="nav-item">
                <a class="nav-link d-flex align-items-center py-2 px-3 rounded text-danger" 
                   href="<?php echo $nivel; ?>logout.php">
                    <i class="fa-solid fa-right-from-bracket me-3"></i>
                    <span>Cerrar Sesión</span>
                </a>
            </li>
        </ul>
    </div>
</nav>

<style>
/* Estilos del sidebar */
#sidebar {
    background: linear-gradient(180deg, #6a11cb 0%, #2575fc 100%);
    min-height: 100vh;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

#sidebar .nav-link {
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    font-weight: 500;
}

#sidebar .nav-link:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}

#sidebar .nav-link.active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

#sidebar .nav-link i {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
}

#sidebar .text-danger:hover {
    background-color: rgba(220, 53, 69, 0.2) !important;
}
</style>