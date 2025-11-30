<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'usuarios';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
             <?php require_once '../sidebar.php'; ?>

            <main class="col-md-9 ms-sm-auto mt-5 col-lg-10 px-md-4">
                <h1>Gestión de Usuarios</h1>

                <button type="button" id="agregarUsuario" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#modalUsuario">
                    <i class="fa-solid fa-plus"></i> Agregar Usuario
                </button>

                <div class="container mt-4">
                    <div class="row mt-3">
                        <input type="text" id="buscar" class="form-control mb-3" placeholder="Buscar por nombre o correo">
                        
                        <div class="table-responsive mt-2">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre de Usuario</th>
                                        <th>Rol</th>
                                        <th>Fecha Registro</th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-usuarios">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalUsuario" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="tituloModal">Agregar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formUsuario">
                        <div class="mb-3">
                            <label class="form-label">Nombre de Usuario / Correo *</label>
                            <input type="email" class="form-control" id="nombreUsuario" required>
                            <small class="text-muted">Este será el correo con el que iniciará sesión</small>
                        </div>
                        
                        <div class="mb-3" id="divContrasena">
                            <label class="form-label">Contraseña *</label>
                            <input type="password" class="form-control" id="contrasena" required>
                            <small class="text-muted">Mínimo 6 caracteres</small>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Rol *</label>
                            <select class="form-select" id="rol" required>
                                <option value="">Seleccionar...</option>
                                <option value="administrador">Administrador</option>
                                <option value="doctor">Doctor</option>
                                <option value="secretaria">Secretaria</option>
                                <option value="usuario">Usuario</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Estatus *</label>
                            <select class="form-select" id="estatus" required>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                        
                        <input type="hidden" id="idUsuario">
                        
                        <button type="button" class="btn btn-primary w-100" onclick="guardarUsuario()">
                            <i class="fa-solid fa-save"></i> Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/scriptUsuarios.js"></script>
</body>

</html>