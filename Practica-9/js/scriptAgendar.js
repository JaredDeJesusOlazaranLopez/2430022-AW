let calendario;
let citas = [];
let citaActual = null;
let modalCita;
let modalDetalleCita;

// Cargar citas desde el servidor
function cargarDatos() {
    fetch('obtener_cita.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                citas = data.data;
                actualizarCalendario();
            } else {
                console.error('Error:', data.error);
                alert('Error al cargar citas: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            alert('Error de conexión al servidor');
        });
}

// Cargar pacientes desde el servidor
function cargarPacientes() {
    fetch('../Pacientes/obtener_pacientes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const selectPaciente = document.getElementById('nombrePaciente');
                selectPaciente.innerHTML = '<option value="">Seleccione un paciente</option>';
                
                data.data.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id;
                    option.textContent = `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}`;
                    selectPaciente.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar pacientes:', error));
}

// Cargar médicos desde el servidor
function cargarMedicos() {
    fetch('../Medicos/obtener_medicos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const selectMedico = document.getElementById('nombreMedico');
                selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';
                
                data.data.forEach(medico => {
                    const option = document.createElement('option');
                    option.value = medico.id;
                    option.textContent = `Dr. ${medico.nombre} ${medico.apellido_paterno}`;
                    selectMedico.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar médicos:', error));
}

// Cargar especialidades desde el servidor
function cargarEspecialidades() {
    fetch('../Especialidades/obtener_especialidades.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const selectEspecialidad = document.getElementById('especialidadCita');
                selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';
                
                data.data.forEach(especialidad => {
                    const option = document.createElement('option');
                    option.value = especialidad.id;
                    option.textContent = especialidad.nombre;
                    selectEspecialidad.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar especialidades:', error));
}

function obtenerNombrePaciente(idPaciente) {
    const cita = citas.find(c => c.idPaciente == idPaciente);
    return cita ? cita.nombrePaciente : 'Paciente no encontrado';
}

function obtenerNombreMedico(idMedico) {
    const cita = citas.find(c => c.idMedico == idMedico);
    return cita ? cita.nombreMedico : 'Médico no encontrado';
}

function obtenerNombreEspecialidad(idEspecialidad) {
    const cita = citas.find(c => c.idEspecialidad == idEspecialidad);
    return cita ? cita.nombreEspecialidad : 'Especialidad no encontrada';
}

function obtenerColorEstado(estado) {
    const colores = {
        'Programada': '#6c757d',
        'Confirmada': '#0d6efd',
        'En Proceso': '#ffc107',
        'Completada': '#198754',
        'Cancelada': '#dc3545'
    };
    return colores[estado] || '#6c757d';
}

function convertirCitasAEventos() {
    return citas.map(cita => ({
        id: cita.id,
        title: cita.nombrePaciente,
        start: `${cita.fecha}T${cita.hora}`,
        backgroundColor: obtenerColorEstado(cita.estado),
        borderColor: obtenerColorEstado(cita.estado),
        extendedProps: {
            idPaciente: cita.idPaciente,
            idMedico: cita.idMedico,
            idEspecialidad: cita.idEspecialidad,
            estado: cita.estado,
            motivo: cita.motivo,
            observaciones: cita.observaciones,
            nombreMedico: cita.nombreMedico,
            nombreEspecialidad: cita.nombreEspecialidad
        }
    }));
}

function actualizarCalendario() {
    calendario.removeAllEvents();
    calendario.addEventSource(convertirCitasAEventos());
    actualizarProximasCitas();
    actualizarEstadisticas();
}

function actualizarProximasCitas() {
    const contenedor = document.getElementById('upcomingAppointments');
    const ahora = new Date();

    const proximasCitas = citas
        .filter(cita => {
            const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
            return fechaCita > ahora && cita.estado !== 'Cancelada';
        })
        .sort((a, b) => {
            const fechaA = new Date(`${a.fecha}T${a.hora}`);
            const fechaB = new Date(`${b.fecha}T${b.hora}`);
            return fechaA - fechaB;
        })
        .slice(0, 5);

    if (proximasCitas.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No hay citas próximas</p>';
        return;
    }

    contenedor.innerHTML = proximasCitas.map(cita => `
        <div class="border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${cita.nombrePaciente}</strong>
                    <br>
                    <small class="text-muted">
                        <i class="fa-solid fa-user-doctor"></i> ${cita.nombreMedico}
                    </small>
                    <br>
                    <small class="text-muted">
                        <i class="fa-solid fa-calendar"></i> ${formatearFecha(cita.fecha)}
                    </small>
                    <br>
                    <span class="badge badge-time">
                        <i class="fa-solid fa-clock"></i> ${cita.hora}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function actualizarEstadisticas() {
    const totalCitas = citas.filter(c => c.estado !== 'Cancelada').length;
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();

    const citasMes = citas.filter(cita => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita.getMonth() === mesActual &&
            fechaCita.getFullYear() === anioActual &&
            cita.estado !== 'Cancelada';
    }).length;

    document.getElementById('totalAppointments').textContent = totalCitas;
    document.getElementById('monthAppointments').textContent = citasMes;
}

function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-MX', opciones);
}

function limpiarFormulario() {
    document.getElementById('idCita').value = '';
    document.getElementById('nombrePaciente').value = '';
    document.getElementById('nombreMedico').value = '';
    document.getElementById('fechaCita').value = '';
    document.getElementById('horaCita').value = '';
    document.getElementById('especialidadCita').value = '';
    document.getElementById('estadoCita').value = 'Programada';
    document.getElementById('motivoCita').value = '';
    document.getElementById('observacionesCita').value = '';
    document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Nueva Cita';
}

function mostrarDetallesCita(cita) {
    citaActual = cita;
    document.getElementById('detallePaciente').textContent = cita.nombrePaciente;
    document.getElementById('detalleMedico').textContent = cita.nombreMedico;
    document.getElementById('detalleFecha').textContent = formatearFecha(cita.fecha);
    document.getElementById('detalleHora').textContent = cita.hora;
    document.getElementById('detalleEspecialidad').textContent = cita.nombreEspecialidad;

    const estadoElement = document.getElementById('detalleEstado');
    estadoElement.innerHTML = `<span class="badge" style="background-color: ${obtenerColorEstado(cita.estado)}">${cita.estado}</span>`;

    document.getElementById('detalleMotivo').textContent = cita.motivo || 'Sin especificar';
    document.getElementById('detalleObservaciones').textContent = cita.observaciones || 'Sin observaciones';

    modalDetalleCita.show();
}

document.addEventListener('DOMContentLoaded', function () {
    modalCita = new bootstrap.Modal(document.getElementById('modalCita'));
    modalDetalleCita = new bootstrap.Modal(document.getElementById('modalDetalleCita'));

    cargarDatos();
    cargarPacientes();
    cargarMedicos();
    cargarEspecialidades();

    const elementoCalendario = document.getElementById('calendar');
    calendario = new FullCalendar.Calendar(elementoCalendario, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista'
        },
        height: 'auto',
        navLinks: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events: convertirCitasAEventos(),

        eventClick: function (info) {
            const cita = citas.find(c => c.id == info.event.id);
            if (cita) {
                mostrarDetallesCita(cita);
            }
        },
        select: function (info) {
            const fechaSeleccionada = info.startStr;
            document.getElementById('fechaCita').value = fechaSeleccionada;
            limpiarFormulario();
            document.getElementById('fechaCita').value = fechaSeleccionada;
            modalCita.show();
        }
    });

    calendario.render();

    document.getElementById('agregarCita').addEventListener('click', function () {
        limpiarFormulario();
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaCita').value = hoy;
        modalCita.show();
    });

    document.getElementById('guardarCita').addEventListener('click', function () {
        const idCita = document.getElementById('idCita').value;
        const idPaciente = document.getElementById('nombrePaciente').value;
        const idMedico = document.getElementById('nombreMedico').value;
        const fecha = document.getElementById('fechaCita').value;
        const hora = document.getElementById('horaCita').value;
        const idEspecialidad = document.getElementById('especialidadCita').value;
        const estado = document.getElementById('estadoCita').value;
        const motivo = document.getElementById('motivoCita').value;
        const observaciones = document.getElementById('observacionesCita').value;

        if (!idPaciente || !idMedico || !fecha || !hora || !idEspecialidad) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        const datos = {
            idPaciente,
            idMedico,
            fecha,
            hora,
            idEspecialidad,
            estado,
            motivo,
            observaciones
        };

        // Actualizar o crear nueva cita
        const url = idCita ? 'actualizar_cita.php' : 'proceso_cita.php';
        if (idCita) {
            datos.id = parseInt(idCita);
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(idCita ? 'Cita actualizada correctamente' : 'Cita guardada correctamente');
                modalCita.hide();
                limpiarFormulario();
                cargarDatos();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al guardar la cita');
        });
    });

    document.getElementById('editarCita').addEventListener('click', function () {
        if (!citaActual) { 
            return; 
        }

        document.getElementById('idCita').value = citaActual.id;
        document.getElementById('nombrePaciente').value = citaActual.idPaciente;
        document.getElementById('nombreMedico').value = citaActual.idMedico;
        document.getElementById('fechaCita').value = citaActual.fecha;
        document.getElementById('horaCita').value = citaActual.hora;
        document.getElementById('especialidadCita').value = citaActual.idEspecialidad;
        document.getElementById('estadoCita').value = citaActual.estado;
        document.getElementById('motivoCita').value = citaActual.motivo;
        document.getElementById('observacionesCita').value = citaActual.observaciones;
        document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-edit"></i> Editar Cita';

        modalDetalleCita.hide();
        modalCita.show();
    });

    document.getElementById('eliminarCita').addEventListener('click', function () {
        if (!citaActual) {
            return;
        }

        if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
            fetch('eliminar_cita.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: citaActual.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cita eliminada correctamente');
                    modalDetalleCita.hide();
                    citaActual = null;
                    cargarDatos();
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar la cita');
            });
        }
    });
});