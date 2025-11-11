<?php
require_once 'conexion.php';

$busqueda = $_GET['buscar'];

if ($busqueda) {
    $sql = "SELECT * FROM controlPacientes 
            WHERE CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) LIKE :busqueda
            OR curp LIKE :busqueda
            ORDER BY fecha_registro DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':busqueda' => "%$busqueda%"]);
} else {
    $sql = "SELECT * FROM controlPacientes ORDER BY fecha_registro DESC";
    $stmt = $pdo->query($sql);
}

$pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block min-vh-100 shadow-lg px-0">
                <div class="text-center p-4 border-bottom border-light border-opacity-25">
                    <img src="images/pokeball.png" alt="pokeball" class="p-2" style="width: 80px; height: 80px;">
                    <h5 class="text-white mt-3 fw-bold">Clinica</h5>
                </div>
                <div class="position-sticky pt-3">
                    <ul class="nav flex-column px-2">
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="dashboard.html">
                                <i class="fa-solid fa-house fs-5 mb-2"></i>
                                <span class="fw-semibold">Inicio</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link active text-white bg-white bg-opacity-25 rounded-3 py-3 px-3" href="#">
                                <i class="fa-solid fa-person fs-5 mb-2"></i>
                                <span class="fw-semibold">Pacientes</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Agenda.html">
                                <i class="fa-solid fa-calendar-days fs-5 mb-2"></i>
                                <span class="fw-semibold">Agenda</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Medicos.html">
                                <i class="fa-solid fa-stethoscope fs-5 mb-2"></i>
                                <span class="fw-semibold">Medicos</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Reportes.html">
                                <i class="fa-solid fa-clipboard fs-5 mb-2"></i>
                                <span class="fw-semibold">Reportes</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Pagos.html">
                                <i class="fa-solid fa-money-bills fs-5 mb-2"></i>
                                <span class="fw-semibold">Pagos</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Tarifas.html">
                                <i class="fa-solid fa-receipt fs-5 mb-2"></i>
                                <span class="fw-semibold">Tarifas</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Bitacoras.html">
                                <i class="fa-solid fa-file-signature fs-5 mb-2"></i>
                                <span class="fw-semibold">Bitacoras</span>
                            </a>
                        </li>
                        <li class="nav-item my-1">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="Especialidades.html">
                                <i class="fa-solid fa-user-doctor fs-5 mb-2"></i>
                                <span class="fw-semibold">Especialidades medicas</span>
                            </a>
                        </li>
                        <li class="nav-item mt-5">
                            <a class="nav-link text-white rounded-3 py-3 px-3" href="index.html">
                                <i class="fa-solid fa-right-from-bracket fs-5 mb-2"></i>
                                <span class="fw-semibold">Cerrar Sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            
            <main class="col-md-9 ms-sm-auto mt-5 col-lg-10 px-md-4">
                <h1>Listado de Pacientes</h1>

                <button type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#modalPacientes">
                    <i class="fa-solid fa-plus"></i> Agregar Paciente
                </button>
                
                <div class="container mt-4">
                    <div class="row mt-3">
                        <!-- Buscador -->
                        <form method="GET" action="Pacientes.php" class="mb-3">
                            <div class="input-group">
                                <input type="text" name="buscar" class="form-control" placeholder="Buscar por nombre o CURP" value="<?php echo htmlspecialchars($busqueda); ?>">
                                <button class="btn btn-primary" type="submit">
                                    <i class="fa-solid fa-search"></i> Buscar
                                </button>
                                <?php if ($busqueda): ?>
                                <a href="Pacientes.php" class="btn btn-secondary">
                                    <i class="fa-solid fa-times"></i> Limpiar
                                </a>
                                <?php endif; ?>
                            </div>
                        </form>
                        
                        <!-- Tabla de pacientes -->
                        <div class="table-responsive mt-2">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>CURP</th>
                                        <th>Fecha Nacimiento</th>
                                        <th>Sexo</th>
                                        <th>Teléfono</th>
                                        <th>Correo</th>
                                        <th>Estatus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($pacientes)): ?>
                                    <tr>
                                        <td colspan="8" class="text-center">No hay pacientes registrados</td>
                                    </tr>
                                    <?php else: ?>
                                        <?php foreach ($pacientes as $paciente): ?>
                                        <tr>
                                            <td><?php echo $paciente['id_paciente']; ?></td>
                                            <td><?php echo htmlspecialchars($paciente['nombre'] . ' ' . $paciente['apellido_paterno'] . ' ' . $paciente['apellido_materno']); ?></td>
                                            <td><?php echo $paciente['curp']; ?></td>
                                            <td><?php echo date('d/m/Y', strtotime($paciente['fecha_nacimiento'])); ?></td>
                                            <td><?php echo $paciente['sexo'] == 'M' ? 'Masculino' : 'Femenino'; ?></td>
                                            <td><?php echo $paciente['telefono']; ?></td>
                                            <td><?php echo htmlspecialchars($paciente['correo']); ?></td>
                                            <td>
                                                <span class="badge <?php echo $paciente['estatus'] == 'Activo' ? 'bg-success' : 'bg-danger'; ?>">
                                                    <?php echo $paciente['estatus']; ?>
                                                </span>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Modal para Agregar Paciente -->
    <div class="modal fade" id="modalPacientes" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agregar Paciente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form action="proceso_paciente.php" method="POST">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-control" name="nombre" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Apellido Paterno *</label>
                                <input type="text" class="form-control" name="apellido_paterno" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Apellido Materno *</label>
                                <input type="text" class="form-control" name="apellido_materno" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">CURP *</label>
                                <input type="text" class="form-control" name="curp" maxlength="18" required>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label class="form-label">Fecha Nacimiento *</label>
                                <input type="date" class="form-control" name="fecha_nacimiento" required>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label class="form-label">Sexo *</label>
                                <select class="form-select" name="sexo" required>
                                    <option value="">Seleccionar</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Teléfono *</label>
                                <input type="tel" class="form-control" name="telefono" required>
                            </div>
                            <div class="col-md-8 mb-3">
                                <label class="form-label">Correo Electrónico *</label>
                                <input type="email" class="form-control" name="correo" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Dirección *</label>
                            <input type="text" class="form-control" name="direccion" required>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Contacto de Emergencia</label>
                                <input type="text" class="form-control" name="contacto_emergencia">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Teléfono de Emergencia *</label>
                                <input type="tel" class="form-control" name="telefono_emergencia" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Alergias</label>
                                <textarea class="form-control" name="alergias" rows="2" placeholder="Ninguna"></textarea>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Antecedentes Médicos</label>
                                <textarea class="form-control" name="antecedentes" rows="2" placeholder="Ninguno"></textarea>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Estatus *</label>
                            <select class="form-select" name="estatus" required>
                                <option value="Activo" selected>Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa-solid fa-save"></i> Guardar Paciente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>