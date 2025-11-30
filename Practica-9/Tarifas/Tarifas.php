<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'tarifas';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarifas por Médico</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
            <?php require_once '../sidebar.php'; ?>
            
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <h1 class="mb-4">Tarifas de Consultas por Médico</h1>

                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="mb-3">
                            <input type="text" id="buscar" class="form-control" placeholder="Buscar por médico o especialidad...">
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Médico</th>
                                        <th>Especialidad</th>
                                        <th>Cédula</th>
                                        <th>Horario</th>
                                        <th class="text-end">Tarifa Consulta</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="listaTarifas">
                                    <tr>
                                        <td colspan="7" class="text-center text-muted py-4">
                                            Cargando tarifas...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Modal para editar tarifa -->
    <div class="modal fade" id="modalTarifa" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="tituloModal">Actualizar Tarifa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formTarifa">
                        <div class="mb-3">
                            <label class="form-label">Médico</label>
                            <input type="text" class="form-control" id="nombreMedico" readonly>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Especialidad</label>
                            <input type="text" class="form-control" id="especialidad" readonly>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Tarifa de Consulta *</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number" class="form-control" id="tarifaConsulta" step="0.01" min="0" required>
                            </div>
                            <small class="text-muted">Ingrese la tarifa de consulta para este médico</small>
                        </div>
                        
                        <input type="hidden" id="idMedico">
                        
                        <button type="button" class="btn btn-primary w-100" onclick="guardarTarifa()">
                            <i class="fa-solid fa-save"></i> Guardar Tarifa
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/scriptTarifas.js"></script>
</body>

</html>