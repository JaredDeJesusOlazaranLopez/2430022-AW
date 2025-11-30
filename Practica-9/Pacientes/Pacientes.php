<?php
$paginaActual = 'pacientes';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <?php require_once '../sidebar.php'; ?>
            <main class="col-md-9 ms-sm-auto mt-5 col-lg-10 px-md-4">
                <h1>Listado de Pacientes</h1>

                <button type="button" id="agregarPacientes" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#modalPacientes">
                    <i class="fa-solid fa-plus"></i> Agregar Pacientes
                </button>   
                <div class="container mt-4">
                    <div class="row mt-3">
                        <input type="text" id="buscar" class="form-control" placeholder="Buscar por nombre o CURP">
                        <div class="table-responsive mt-2">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Apellido Paterno</th>
                                        <th>Apellido Materno</th>
                                        <th>CURP</th>
                                        <th>Fecha Nacimiento</th>
                                        <th>Sexo</th>
                                        <th>Telefono</th>
                                        <th>Correo</th>
                                        <th>Direccion</th>
                                        <th>Tel. Emergencia</th>
                                        <th>Alergias</th>
                                        <th>Antecedentes</th>
                                        <th>Fecha Registro</th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-pacientes" class="table-group-divider">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <div class="modal fade" id="modalPacientes" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="tituloModal">Agregar Paciente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form action="proceso_paciente.php" method="POST">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Apellido Paterno</label>
                            <input type="text" class="form-control" id="apellido_paterno" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Apellido Materno</label>
                            <input type="text" class="form-control" id="apellido_materno" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">CURP</label>
                            <input type="text" class="form-control" id="curp" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Fecha Nacimiento</label>
                            <input type="date" class="form-control" id="fecha_nacimiento" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sexo</label>
                            <select class="form-select" id="sexo">
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Telefono</label>
                            <input type="tel" class="form-control" id="telefono" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Direccion</label>
                            <input type="text" class="form-control" id="direccion" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Contacto de Emergencia</label>
                            <input type="text" class="form-control" id="contacto_emergencia" placeholder="Opcional">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Telefono de Emergencia</label>
                            <input type="tel" class="form-control" id="telefono_emergencia" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Alergias</label>
                            <input type="text" class="form-control" id="alergias" placeholder="Ninguna">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Antecedentes Medicos</label>
                            <input type="text" class="form-control" id="antecedentes" placeholder="Ninguno">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Estatus</label>
                            <select class="form-select" id="estatus">
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <input type="hidden" id="idPaciente">
                        <button type="button" class="btn btn-primary w-100" onclick="guardarActualizacion()">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/scriptPacientes.js"></script>
</body>

</html>