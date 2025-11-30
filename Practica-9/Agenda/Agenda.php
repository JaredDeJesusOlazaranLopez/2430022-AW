<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'agenda';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda de Citas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/6.1.8/index.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../styles/stylesD.css">

</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
             <?php require_once '../sidebar.php'; ?>

            <main class="col-md-9 mt-3 ms-sm-auto col-lg-10 px-md-4">
                <div class="container-fluid">
                    <div class="header-section">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <h1 class="mb-2">Agendar Citas</h1>
                            </div>
                            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                <button class="btn btn-primary btn-lg" id="agregarCita">
                                    <i class="fa-solid fa-plus"></i> Nueva Cita
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-9">
                            <div id="calendar"></div>
                        </div>
                        <div class="col-lg-3 mt-4 mt-lg-0">
                            <div class="card shadow-sm">
                                <div class="card-header bg-primary text-white">
                                    <h5 class="mb-0">Próximas Citas</h5>
                                </div>
                                <div class="card-body" id="upcomingAppointments">
                                    <p class="text-muted">No hay citas próximas</p>
                                </div>
                            </div>

                            <div class="card shadow-sm mt-3">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">Estadísticas</h5>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Total de citas:</span>
                                        <strong id="totalAppointments">0</strong>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <span>Este mes:</span>
                                        <strong id="monthAppointments">0</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <div class="modal fade" id="modalCita" tabindex="-1" aria-labelledby="modalCitaLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalCitaLabel">
                        <i class="fa-solid fa-calendar-plus"></i> Nueva Cita
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nombrePaciente" class="form-label">
                                 Paciente
                            </label>
                            <select class="form-select" id="nombrePaciente" required>
                                <option value="">Seleccione un paciente</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="nombreMedico" class="form-label">
                               Médico
                            </label>
                            <select class="form-select" id="nombreMedico" required>
                                <option value="">Seleccione un médico</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="fechaCita" class="form-label">
                               Fecha
                            </label>
                            <input type="date" class="form-control" id="fechaCita" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="horaCita" class="form-label">
                             Hora
                            </label>
                            <input type="time" class="form-control" id="horaCita" required>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="especialidadCita" class="form-label"> Especialidad
                            </label>
                            <select class="form-select" id="especialidadCita" required>
                                <option value="">Seleccione una especialidad</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="estadoCita" class="form-label">
                               Estado
                            </label>
                            <select class="form-select" id="estadoCita" required>
                                <option value="Programada">Programada</option>
                                <option value="Confirmada">Confirmada</option>
                                <option value="En Proceso">En Proceso</option>
                                <option value="Completada">Completada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="motivoCita" class="form-label">
                            Motivo de la Cita
                        </label>
                        <textarea class="form-control" id="motivoCita" rows="3"
                            placeholder="Describa el motivo de la cita"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="observacionesCita" class="form-label">
                         Observaciones
                        </label>
                        <textarea class="form-control" id="observacionesCita" rows="2"
                            placeholder="Observaciones adicionales (opcional)"></textarea>
                    </div>

                    <input type="hidden" id="idCita">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id="guardarCita">
                       Guardar Cita
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalDetalleCita" tabindex="-1" aria-labelledby="modalDetalleCitaLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-info text-white">
                    <h5 class="modal-title" id="modalDetalleCitaLabel">
                        <i class="fa-solid fa-info-circle"></i> Detalles de la Cita
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h6>Paciente:</h6>
                            <p id="detallePaciente" class="ms-3">-</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h6>Médico:</h6>
                            <p id="detalleMedico" class="ms-3">-</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h6>Fecha:</h6>
                            <p id="detalleFecha" class="ms-3">-</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h6>Hora:</h6>
                            <p id="detalleHora" class="ms-3">-</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h6>Especialidad:</h6>
                            <p id="detalleEspecialidad" class="ms-3">-</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h6>Estado:</h6>
                            <p id="detalleEstado" class="ms-3">-</p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <h6>Motivo:</h6>
                        <p id="detalleMotivo" class="ms-3">-</p>
                    </div>
                    <div class="mb-3">
                        <h6>Observaciones:</h6>
                        <p id="detalleObservaciones" class="ms-3">-</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" id="editarCita">
                        <i class="fa-solid fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger" id="eliminarCita">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fa-solid fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/6.1.8/index.global.min.js"></script>
    <script src="../js/scriptAgendar.js"></script>
</body>

</html>