<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'medicos';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medicos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <?php require_once '../sidebar.php'; ?>
            <main class="col-md-9 mt-5 ms-sm-auto col-lg-10 px-md-4">
                <h1>Listado de medicos</h1>

                <button type="button" id="agregarMedicos" class="btn btn-primary mt-3">
                    <i class="fa-solid fa-plus"></i> Agregar medicos
                </button>
                <div class="container mt-4">
                    <div class="row mt-3">
                        <input type="text" id="buscar" class="form-control" placeholder="Buscar por nombre o cedula">
                        <div class="table-responsive mt-3">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID medico</th>
                                        <th>Nombre Completo</th>
                                        <th>Cedula Profesional</th>
                                        <th>Especialidad</th>
                                        <th>Telefono</th>
                                        <th>Correo</th>
                                        <th>Horario</th>
                                        <th>Fecha ingreso</th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-medicos" class="table-group-divider">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <div class="modal fade" id="modalDoctores" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="tituloModal">Agregar medico</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formMedicos">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombreM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Apellido Paterno</label>
                            <input type="text" class="form-control" id="apellidoPaterno" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Apellido Materno</label>
                            <input type="text" class="form-control" id="apellidoMaterno" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cedula Profesional</label>
                            <input type="text" class="form-control" id="cedulaM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Especialidad</label>
                            <select class="form-select" id="especialidadM" required>
                                <option value="">Seleccione una especialidad</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Telefono</label>
                            <input type="text" class="form-control" id="telefonoM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correoM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Horario de atencion</label>
                            <label>De:</label>
                            <input type="time" class="form-control" id="horarioDM" required>
                            <label>A:</label>
                            <input type="time" class="form-control" id="horarioAM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Fecha Ingreso</label>
                            <input type="date" class="form-control" id="fechaM" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Estatus</label>
                            <select class="form-select" id="estatusM">
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <input type="hidden" id="idMedico">
                        <button type="submit" class="btn btn-primary w-100">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/scriptMedicos.js"></script>
</body>

</html>