<?php
$nivel = isset($nivelCarpeta) ? $nivelCarpeta : '../';
?>

<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block min-vh-100 shadow-lg px-0">
    <div class="text-center p-4 border-bottom border-light border-opacity-25">
        <img src="<?php echo $nivel; ?>images/pokeball.png" alt="pokeball" class="p-2" style="width: 80px; height: 80px;">
        <h5 class="text-white mt-3 fw-bold">Clínica</h5>
        <p class="text-white-50 small mb-0"><?php echo htmlspecialchars($nombreUsuario); ?></p>
        <span class="badge bg-info text-dark"><?php echo ucfirst($rolUsuario); ?></span>
    </div>
    <div class="position-sticky pt-3">
        <ul class="nav flex-column px-2">
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'dashboard') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>dashboard.php">
                    <i class="fa-solid fa-house fs-5 mb-2"></i>
                    <span class="fw-semibold">Inicio</span>
                </a>
            </li>
            
            <?php if (tienePermiso('pacientes')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'pacientes') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Pacientes/Pacientes.php">
                    <i class="fa-solid fa-person fs-5 mb-2"></i>
                    <span class="fw-semibold">Pacientes</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('agenda')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'agenda') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Agenda/Agenda.php">
                    <i class="fa-solid fa-calendar fs-5 mb-2"></i>
                    <span class="fw-semibold">Agenda</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('medicos')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'medicos') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Medicos/Medicos.php">
                    <i class="fa-solid fa-stethoscope fs-5 mb-2"></i>
                    <span class="fw-semibold">Médicos</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('reportes')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'reportes') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Reportes/Reportes.php">
                    <i class="fa-solid fa-clipboard fs-5 mb-2"></i>
                    <span class="fw-semibold">Reportes</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('pagos')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'pagos') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Pagos/Pagos.php">
                    <i class="fa-solid fa-money-bills fs-5 mb-2"></i>
                    <span class="fw-semibold">Pagos</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('tarifas')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'tarifas') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Tarifas/Tarifas.php">
                    <i class="fa-solid fa-receipt fs-5 mb-2"></i>
                    <span class="fw-semibold">Tarifas</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('bitacoras')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'bitacoras') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Bitacoras/Bitacoras.php">
                    <i class="fa-solid fa-file-signature fs-5 mb-2"></i>
                    <span class="fw-semibold">Bitácoras</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (tienePermiso('especialidades')): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'especialidades') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Especialidades/Especialidades.php">
                    <i class="fa-solid fa-flask fs-5 mb-2"></i>
                    <span class="fw-semibold">Especialidades</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if ($rolUsuario === 'administrador'): ?>
            <li class="nav-item my-1">
                <a class="nav-link text-white rounded-3 py-3 px-3 <?php echo ($paginaActual == 'usuarios') ? 'active bg-white bg-opacity-25' : ''; ?>" 
                   href="<?php echo $nivel; ?>Usuarios/Usuarios.php">
                    <i class="fa-solid fa-users fs-5 mb-2"></i>
                    <span class="fw-semibold">Usuarios</span>
                </a>
            </li>
            <?php endif; ?>
            
            <li class="nav-item mt-5">
                <a class="nav-link text-white rounded-3 py-3 px-3" href="<?php echo $nivel; ?>logout.php">
                    <i class="fa-solid fa-right-from-bracket fs-5 mb-2"></i>
                    <span class="fw-semibold">Cerrar Sesión</span>
                </a>
            </li>
        </ul>
    </div>
</nav>