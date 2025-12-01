// Variables globales
let calendar;
let citasData = [];
let pacientesData = [];
let medicosData = [];
let especialidadesData = [];
let modalCita;
let modalDetalleCita;
let citaSeleccionadaId = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modales
    modalCita = new bootstrap.Modal(document.getElementById('modalCita'));
    modalDetalleCita = new bootstrap.Modal(document.getElementById('modalDetalleCita'));
    
    // Inicializar calendario
    initCalendar();
    
    // Cargar datos iniciales
    cargarCitas();
    cargarPacientes();
    cargarMedicos();
    cargarEspecialidades();
    
    // Event listeners
    document.getElementById('agregarCita').addEventListener('click', () => {
        limpiarFormulario();
        document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Nueva Cita';
        modalCita.show();
    });
    
    document.getElementById('guardarCita').addEventListener('click', guardarCita);
    document.getElementById('editarCita').addEventListener('click', editarCitaDesdeDetalle);
    document.getElementById('eliminarCita').addEventListener('click', () => eliminarCita(citaSeleccionadaId));
    
    // Establecer fecha mínima a hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaCita').setAttribute('min', hoy);
});

// Inicializar FullCalendar
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: [],
        eventClick: function(info) {
            const citaId = info.event.id;
            mostrarDetalleCita(citaId);
        },
        dateClick: function(info) {
            document.getElementById('fechaCita').value = info.dateStr;
            limpiarFormulario();
            modalCita.show();
        }
    });
    calendar.render();
}

// Cargar citas desde el servidor
async function cargarCitas() {
    try {
        const response = await fetch('obtener_cita.php');
        const data = await response.json();
        
        if (data.success) {
            citasData = data.data;
            actualizarCalendario();
            actualizarProximasCitas();
            actualizarEstadisticas();
        } else {
            console.error('Error al cargar citas:', data.error);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Actualizar eventos del calendario
function actualizarCalendario() {
    const eventos = citasData.map(cita => ({
        id: cita.id,
        title: `${cita.nombrePaciente} - ${cita.nombreMedico}`,
        start: `${cita.fecha}T${cita.hora}`,
        backgroundColor: getColorByEstado(cita.estado),
        borderColor: getColorByEstado(cita.estado)
    }));
    
    calendar.removeAllEvents();
    calendar.addEventSource(eventos);
}

// Obtener color según estado
function getColorByEstado(estado) {
    const colores = {
        'Programada': '#6c757d',
        'Confirmada': '#0dcaf0',
        'En Proceso': '#ffc107',
        'Completada': '#198754',
        'Cancelada': '#dc3545'
    };
    return colores[estado] || '#6c757d';
}

// Cargar lista de pacientes
async function cargarPacientes() {
    try {
        const response = await fetch('../Pacientes/obtener_pacientes.php');
        const data = await response.json();
        
        if (data.success) {
            pacientesData = data.data;
            const select = document.getElementById('nombrePaciente');
            const rolUsuario = document.getElementById('rolUsuarioActual')?.value;
            const idUsuarioSesion = document.getElementById('idUsuarioSesion')?.value;
            
            if (rolUsuario === 'usuario') {
                // Si es paciente, buscar su información y bloquear el select
                const pacienteActual = data.data.find(p => p.idUsuario == idUsuarioSesion);
                
                if (pacienteActual) {
                    select.innerHTML = `<option value="${pacienteActual.id}" selected>${pacienteActual.nombreCompleto}</option>`;
                    select.disabled = true;
                } else {
                    select.innerHTML = '<option value="">No se encontró tu información de paciente</option>';
                    select.disabled = true;
                }
            } else {
                // Si es admin/secretaria/doctor, mostrar todos los pacientes
                select.innerHTML = '<option value="">Seleccione un paciente</option>' +
                    data.data.map(p => `<option value="${p.id}">${p.nombreCompleto}</option>`).join('');
            }
        }
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
    }
}

// Cargar lista de médicos
async function cargarMedicos() {
    try {
        const response = await fetch('../Medicos/obtener_medicos.php');
        const data = await response.json();
        
        if (data.success) {
            medicosData = data.data;
            const select = document.getElementById('nombreMedico');
            select.innerHTML = '<option value="">Seleccione un médico</option>' +
                data.data.map(m => `<option value="${m.idMedico}">${m.nombreCompleto}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar médicos:', error);
    }
}

// Cargar lista de especialidades
async function cargarEspecialidades() {
    try {
        const response = await fetch('../Especialidades/obtener_especialidades.php');
        const data = await response.json();
        
        if (data.success) {
            especialidadesData = data.data;
            const select = document.getElementById('especialidadCita');
            select.innerHTML = '<option value="">Seleccione una especialidad</option>' +
                data.data.map(e => `<option value="${e.idEspecialidad}">${e.nombreEspecialidad}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar especialidades:', error);
    }
}

// Guardar cita (nueva o editar)
async function guardarCita() {
    const idCita = document.getElementById('idCita').value;
    const rolUsuario = document.getElementById('rolUsuarioActual')?.value;
    
    let idPaciente;
    
    if (rolUsuario === 'usuario') {
        // Si es paciente, obtener su ID del select (ya pre-cargado)
        idPaciente = document.getElementById('nombrePaciente').value;
    } else {
        // Si es admin/secretaria, tomar el paciente seleccionado
        idPaciente = document.getElementById('nombrePaciente').value;
    }
    
    const idMedico = document.getElementById('nombreMedico').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora = document.getElementById('horaCita').value;
    const motivo = document.getElementById('motivoCita').value;
    const estado = document.getElementById('estadoCita').value;
    const observaciones = document.getElementById('observacionesCita').value;
    
    // Validaciones
    if (!idPaciente || !idMedico || !fecha || !hora) {
        Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    const datos = {
        idPaciente: parseInt(idPaciente),
        idMedico: parseInt(idMedico),
        fecha,
        hora,
        motivo,
        estado,
        observaciones
    };
    
    try {
        let url = 'proceso_cita.php';
        if (idCita) {
            url = 'actualizar_cita.php';
            datos.id = parseInt(idCita);
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success');
            modalCita.hide();
            cargarCitas();
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    }
}

// Mostrar detalle de la cita
function mostrarDetalleCita(citaId) {
    const cita = citasData.find(c => c.id == citaId);
    
    if (cita) {
        citaSeleccionadaId = citaId;
        
        document.getElementById('detallePaciente').textContent = cita.nombrePaciente;
        document.getElementById('detalleMedico').textContent = cita.nombreMedico;
        document.getElementById('detalleFecha').textContent = formatearFecha(cita.fecha);
        document.getElementById('detalleHora').textContent = cita.hora;
        document.getElementById('detalleEspecialidad').textContent = cita.nombreEspecialidad;
        document.getElementById('detalleEstado').innerHTML = `<span class="badge" style="background-color: ${getColorByEstado(cita.estado)}">${cita.estado}</span>`;
        document.getElementById('detalleMotivo').textContent = cita.motivo || '-';
        document.getElementById('detalleObservaciones').textContent = cita.observaciones || '-';
        
        modalDetalleCita.show();
    }
}

// Editar cita desde el modal de detalle
function editarCitaDesdeDetalle() {
    modalDetalleCita.hide();
    
    const cita = citasData.find(c => c.id == citaSeleccionadaId);
    
    if (cita) {
        document.getElementById('idCita').value = cita.id;
        document.getElementById('nombrePaciente').value = cita.idPaciente;
        document.getElementById('nombreMedico').value = cita.idMedico;
        document.getElementById('fechaCita').value = cita.fecha;
        document.getElementById('horaCita').value = cita.hora;
        document.getElementById('motivoCita').value = cita.motivo;
        document.getElementById('estadoCita').value = cita.estado;
        document.getElementById('observacionesCita').value = cita.observaciones;
        
        document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-edit"></i> Editar Cita';
        modalCita.show();
    }
}

// Eliminar cita
async function eliminarCita(citaId) {
    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch('eliminar_cita.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: citaId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                Swal.fire('Eliminado', data.message, 'success');
                modalDetalleCita.hide();
                cargarCitas();
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
        }
    }
}

// Actualizar próximas citas
function actualizarProximasCitas() {
    const ahora = new Date();
    const proximasCitas = citasData
        .filter(c => {
            const fechaCita = new Date(`${c.fecha}T${c.hora}`);
            return fechaCita > ahora && c.estado !== 'Cancelada' && c.estado !== 'Completada';
        })
        .sort((a, b) => {
            const fechaA = new Date(`${a.fecha}T${a.hora}`);
            const fechaB = new Date(`${b.fecha}T${b.hora}`);
            return fechaA - fechaB;
        })
        .slice(0, 5);
    
    const container = document.getElementById('upcomingAppointments');
    
    if (proximasCitas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay citas próximas</p>';
        return;
    }
    
    container.innerHTML = proximasCitas.map(cita => `
        <div class="border-bottom pb-2 mb-2">
            <small class="text-muted">${formatearFecha(cita.fecha)} ${cita.hora}</small>
            <p class="mb-0"><strong>${cita.nombrePaciente}</strong></p>
            <p class="mb-0 small">Dr(a). ${cita.nombreMedico}</p>
        </div>
    `).join('');
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const total = citasData.length;
    
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();
    
    const citasMes = citasData.filter(c => {
        const fecha = new Date(c.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    }).length;
    
    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('monthAppointments').textContent = citasMes;
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('idCita').value = '';
    const rolUsuario = document.getElementById('rolUsuarioActual')?.value;
    
    // Solo limpiar el select de paciente si NO es un usuario/paciente
    if (rolUsuario !== 'usuario') {
        document.getElementById('nombrePaciente').value = '';
    }
    
    document.getElementById('nombreMedico').value = '';
    document.getElementById('fechaCita').value = '';
    document.getElementById('horaCita').value = '';
    document.getElementById('especialidadCita').value = '';
    document.getElementById('estadoCita').value = 'Programada';
    document.getElementById('motivoCita').value = '';
    document.getElementById('observacionesCita').value = '';
    
    document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Nueva Cita';
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}