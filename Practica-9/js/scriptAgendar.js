let calendario;
let citas = [];
let citaActual = null;
let modalCita;
let modalDetalleCita;

function cargarDatos() {
    const citasGuardadas = localStorage.getItem('citas');
    if (citasGuardadas) {
        citas = JSON.parse(citasGuardadas);
    }
}

function guardarDatos() {
    localStorage.setItem('citas', JSON.stringify(citas));
}

function cargarPacientes() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const selectPaciente = document.getElementById('nombrePaciente');
    selectPaciente.innerHTML = '<option value="">Seleccione un paciente</option>';

    pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id;
        option.textContent = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;
        selectPaciente.appendChild(option);
    });
}

function cargarMedicos() {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const selectMedico = document.getElementById('nombreMedico');
    selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';

    medicos.forEach(medico => {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = `Dr. ${medico.nombre} ${medico.apellidoPaterno}`;
        selectMedico.appendChild(option);
    });
}

function cargarEspecialidades() {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const selectEspecialidad = document.getElementById('especialidadCita');
    selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';

    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        selectEspecialidad.appendChild(option);
    });
}
function obtenerNombrePaciente(idPaciente) {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(p => p.id == idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}` : 'Paciente no encontrado';
}

function obtenerNombreMedico(idMedico) {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = medicos.find(m => m.id == idMedico);
    return medico ? `Dr. ${medico.nombre} ${medico.apellidoPaterno}` : 'Médico no encontrado';
}

function obtenerNombreEspecialidad(idEspecialidad) {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const especialidad = especialidades.find(e => e.id == idEspecialidad);
    return especialidad ? especialidad.nombre : 'Especialidad no encontrada';
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
        title: obtenerNombrePaciente(cita.idPaciente),
        start: `${cita.fecha}T${cita.hora}`,
        backgroundColor: obtenerColorEstado(cita.estado),
        borderColor: obtenerColorEstado(cita.estado),
        extendedProps: {
            idPaciente: cita.idPaciente,
            idMedico: cita.idMedico,
            idEspecialidad: cita.idEspecialidad,
            estado: cita.estado,
            motivo: cita.motivo,
            observaciones: cita.observaciones
        }
    }));
}

// Función para actualizar el calendario
function actualizarCalendario() {
    calendario.removeAllEvents();
    calendario.addEventSource(convertirCitasAEventos());
    actualizarProximasCitas();
    actualizarEstadisticas();
}

// Función para actualizar próximas citas
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
                    <strong>${obtenerNombrePaciente(cita.idPaciente)}</strong>
                    <br>
                    <small class="text-muted">
                        <i class="fa-solid fa-user-doctor"></i> ${obtenerNombreMedico(cita.idMedico)}
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
    document.getElementById('detallePaciente').textContent = obtenerNombrePaciente(cita.idPaciente);
    document.getElementById('detalleMedico').textContent = obtenerNombreMedico(cita.idMedico);
    document.getElementById('detalleFecha').textContent = formatearFecha(cita.fecha);
    document.getElementById('detalleHora').textContent = cita.hora;
    document.getElementById('detalleEspecialidad').textContent = obtenerNombreEspecialidad(cita.idEspecialidad);

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
    actualizarProximasCitas();
    actualizarEstadisticas();
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

        const cita = {
            id: idCita || Date.now().toString(),
            idPaciente,
            idMedico,
            fecha,
            hora,
            idEspecialidad,
            estado,
            motivo,
            observaciones,
            fechaCreacion: new Date().toISOString()
        };

        if (idCita) {
            const indice = citas.findIndex(c => c.id === idCita);
            if (indice !== -1) {
                citas[indice] = cita;
            }
        } else {
            citas.push(cita);
        }

        guardarDatos();
        actualizarCalendario();
        modalCita.hide();
        limpiarFormulario();

        alert('Cita guardada exitosamente');
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
            citas = citas.filter(c => c.id !== citaActual.id);
            guardarDatos();
            actualizarCalendario();
            modalDetalleCita.hide();
            citaActual = null;
            alert('Cita eliminada exitosamente');
        }
    });
});