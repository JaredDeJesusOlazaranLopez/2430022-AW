// scriptAgendar.js - Sistema de gestión de citas médicas
let calendar;
let citaActual = null;
let todasLasCitas = [];

// Inicialización cuando carga el documento
document.addEventListener('DOMContentLoaded', function() {
    inicializarCalendario();
    cargarPacientes();
    cargarMedicos();
    cargarEspecialidades();
    cargarCitas();
    configurarEventos();
});

// Configurar todos los event listeners
function configurarEventos() {
    document.getElementById('agregarCita').addEventListener('click', abrirModalNuevaCita);
    document.getElementById('guardarCita').addEventListener('click', guardarCita);
    document.getElementById('editarCita').addEventListener('click', editarCitaDesdeDetalle);
    document.getElementById('eliminarCita').addEventListener('click', confirmarEliminarCita);
}

// Inicializar FullCalendar
function inicializarCalendario() {
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
            mostrarDetalleCita(info.event.id);
        },
        dateClick: function(info) {
            abrirModalNuevaCita(info.dateStr);
        },
        eventColor: '#0d6efd',
        timeZone: 'local'
    });
    
    calendar.render();
}

// Cargar pacientes en el select
async function cargarPacientes() {
    try {
        const response = await fetch('../Pacientes/obtener_pacientes.php');
        const data = await response.json();
        
        const select = document.getElementById('nombrePaciente');
        select.innerHTML = '<option value="">Seleccione un paciente</option>';
        
        if (data.success && data.data) {
            data.data.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.idPaciente;
                // Usar nombreCompleto si existe, si no construirlo
                const nombreCompleto = paciente.nombreCompleto || 
                    `${paciente.nombre || ''} ${paciente.apellido_paterno || ''} ${paciente.apellido_materno || ''}`.trim();
                option.textContent = nombreCompleto;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        mostrarAlerta('Error al cargar la lista de pacientes', 'danger');
    }
}

// Cargar médicos en el select
async function cargarMedicos() {
    try {
        const response = await fetch('../Medicos/obtener_medicos.php');
        const data = await response.json();
        
        const select = document.getElementById('nombreMedico');
        select.innerHTML = '<option value="">Seleccione un médico</option>';
        
        if (data.success && data.data) {
            data.data.forEach(medico => {
                const option = document.createElement('option');
                option.value = medico.idMedico;
                option.textContent = medico.nombreCompleto;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar médicos:', error);
        mostrarAlerta('Error al cargar la lista de médicos', 'danger');
    }
}

// Cargar especialidades en el select
async function cargarEspecialidades() {
    try {
        const response = await fetch('../Especialidades/obtener_especialidades.php');
        const data = await response.json();
        
        const select = document.getElementById('especialidadCita');
        select.innerHTML = '<option value="">Seleccione una especialidad</option>';
        
        if (data.success && data.data) {
            data.data.forEach(especialidad => {
                const option = document.createElement('option');
                option.value = especialidad.idEspecialidad;
                option.textContent = especialidad.nombreEspecialidad;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar especialidades:', error);
        mostrarAlerta('Error al cargar la lista de especialidades', 'danger');
    }
}

// Cargar todas las citas
async function cargarCitas() {
    try {
        const response = await fetch('obtener_cita.php');
        const data = await response.json();
        
        if (data.success && data.data) {
            todasLasCitas = data.data;
            
            // Convertir citas al formato de FullCalendar
            const eventos = data.data.map(cita => {
                // Extraer solo la hora (HH:MM) si viene en formato completo
                let horaFormateada = cita.hora;
                if (cita.hora && cita.hora.length > 5) {
                    horaFormateada = cita.hora.substring(0, 5);
                }
                
                return {
                    id: cita.id,
                    title: `${cita.nombrePaciente || 'Sin paciente'} - ${cita.nombreMedico || 'Sin médico'}`,
                    start: cita.hora ? `${cita.fecha}T${horaFormateada}` : cita.fecha,
                    backgroundColor: obtenerColorPorEstado(cita.estado),
                    borderColor: obtenerColorPorEstado(cita.estado),
                    extendedProps: {
                        ...cita
                    }
                };
            });
            
            // Actualizar eventos en el calendario
            calendar.removeAllEvents();
            calendar.addEventSource(eventos);
            
            // Actualizar estadísticas
            actualizarEstadisticas(data.data);
            
            // Actualizar próximas citas
            actualizarProximasCitas(data.data);
        }
    } catch (error) {
        console.error('Error al cargar citas:', error);
        mostrarAlerta('Error al cargar las citas', 'danger');
    }
}

// Obtener color según el estado de la cita
function obtenerColorPorEstado(estado) {
    const colores = {
        'Programada': '#0d6efd',
        'Confirmada': '#198754',
        'En Proceso': '#ffc107',
        'Completada': '#6c757d',
        'Cancelada': '#dc3545'
    };
    return colores[estado] || '#0d6efd';
}

// Abrir modal para nueva cita
function abrirModalNuevaCita(fecha = null) {
    citaActual = null;
    document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Nueva Cita';
    
    // Limpiar formulario
    document.getElementById('idCita').value = '';
    document.getElementById('nombrePaciente').value = '';
    document.getElementById('nombreMedico').value = '';
    document.getElementById('especialidadCita').value = '';
    document.getElementById('fechaCita').value = fecha || '';
    document.getElementById('horaCita').value = '';
    document.getElementById('motivoCita').value = '';
    document.getElementById('estadoCita').value = 'Programada';
    document.getElementById('observacionesCita').value = '';
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalCita'));
    modal.show();
}

// Guardar cita (nueva o editar)
async function guardarCita() {
    const idCita = document.getElementById('idCita').value;
    const idPaciente = document.getElementById('nombrePaciente').value;
    const idMedico = document.getElementById('nombreMedico').value;
    const idEspecialidad = document.getElementById('especialidadCita').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora = document.getElementById('horaCita').value;
    const motivo = document.getElementById('motivoCita').value;
    const estado = document.getElementById('estadoCita').value;
    const observaciones = document.getElementById('observacionesCita').value;
    
    // Validar campos requeridos
    if (!idPaciente || !idMedico || !fecha || !hora) {
        mostrarAlerta('Por favor complete todos los campos obligatorios', 'warning');
        return;
    }
    
    const datos = {
        idPaciente,
        idMedico,
        idEspecialidad: idEspecialidad || null,
        fecha,
        hora,
        motivo,
        estado,
        observaciones
    };
    
    try {
        let url, metodo;
        
        if (idCita) {
            // Editar cita existente
            url = 'actualizar_cita.php';
            metodo = 'POST';
            datos.id = idCita;
        } else {
            // Nueva cita
            url = 'proceso_cita.php';
            metodo = 'POST';
        }
        
        const response = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(result.message || 'Cita guardada correctamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCita'));
            modal.hide();
            
            // Recargar citas
            await cargarCitas();
        } else {
            mostrarAlerta(result.error || 'Error al guardar la cita', 'danger');
        }
    } catch (error) {
        console.error('Error al guardar cita:', error);
        mostrarAlerta('Error al procesar la solicitud', 'danger');
    }
}

// Mostrar detalle de una cita
async function mostrarDetalleCita(idCita) {
    try {
        const response = await fetch(`actualizar_cita.php?id=${idCita}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            citaActual = data.data;
            
            // Obtener nombres completos de las citas cargadas
            const citaCompleta = todasLasCitas.find(c => c.id == idCita);
            
            const paciente = citaCompleta?.nombrePaciente || 'N/A';
            const medico = citaCompleta?.nombreMedico || 'N/A';
            const especialidad = citaCompleta?.nombreEspecialidad || 'N/A';
            
            // Llenar modal de detalle
            document.getElementById('detallePaciente').textContent = paciente;
            document.getElementById('detalleMedico').textContent = medico;
            document.getElementById('detalleEspecialidad').textContent = especialidad;
            document.getElementById('detalleFecha').textContent = formatearFecha(data.data.fecha);
            document.getElementById('detalleHora').textContent = data.data.hora;
            document.getElementById('detalleEstado').textContent = data.data.estado;
            document.getElementById('detalleMotivo').textContent = data.data.motivo || 'Sin especificar';
            document.getElementById('detalleObservaciones').textContent = data.data.observaciones || 'Sin observaciones';
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalDetalleCita'));
            modal.show();
        }
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        mostrarAlerta('Error al cargar los detalles de la cita', 'danger');
    }
}

// Editar cita desde el modal de detalle
async function editarCitaDesdeDetalle() {
    if (!citaActual) return;
    
    // Cerrar modal de detalle
    const modalDetalle = bootstrap.Modal.getInstance(document.getElementById('modalDetalleCita'));
    modalDetalle.hide();
    
    // Llenar formulario de edición
    document.getElementById('modalCitaLabel').innerHTML = '<i class="fa-solid fa-calendar-edit"></i> Editar Cita';
    document.getElementById('idCita').value = citaActual.id;
    document.getElementById('nombrePaciente').value = citaActual.idPaciente;
    document.getElementById('nombreMedico').value = citaActual.idMedico;
    document.getElementById('especialidadCita').value = citaActual.idEspecialidad || '';
    document.getElementById('fechaCita').value = citaActual.fecha;
    document.getElementById('horaCita').value = citaActual.hora;
    document.getElementById('motivoCita').value = citaActual.motivo || '';
    document.getElementById('estadoCita').value = citaActual.estado;
    document.getElementById('observacionesCita').value = citaActual.observaciones || '';
    
    // Abrir modal de edición
    const modal = new bootstrap.Modal(document.getElementById('modalCita'));
    modal.show();
}

// Confirmar eliminación de cita
function confirmarEliminarCita() {
    if (!citaActual) return;
    
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
        eliminarCita(citaActual.id);
    }
}

// Eliminar cita
async function eliminarCita(idCita) {
    try {
        const response = await fetch('eliminar_cita.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idCita })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta('Cita eliminada correctamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalleCita'));
            modal.hide();
            
            // Recargar citas
            await cargarCitas();
        } else {
            mostrarAlerta(result.error || 'Error al eliminar la cita', 'danger');
        }
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        mostrarAlerta('Error al procesar la solicitud', 'danger');
    }
}

// Actualizar estadísticas
function actualizarEstadisticas(citas) {
    const total = citas.length;
    
    // Citas del mes actual
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    
    const citasMes = citas.filter(cita => {
        const fechaCita = new Date(cita.fecha + 'T00:00:00');
        return fechaCita.getMonth() === mesActual && fechaCita.getFullYear() === añoActual;
    }).length;
    
    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('monthAppointments').textContent = citasMes;
}

// Actualizar próximas citas
function actualizarProximasCitas(citas) {
    const container = document.getElementById('upcomingAppointments');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Filtrar y ordenar próximas citas
    const proximasCitas = citas
        .filter(cita => {
            const fechaCita = new Date(cita.fecha + 'T00:00:00');
            return fechaCita >= hoy && cita.estado !== 'Cancelada' && cita.estado !== 'Completada';
        })
        .sort((a, b) => {
            const fechaHoraA = new Date(`${a.fecha}T${a.hora || '00:00:00'}`);
            const fechaHoraB = new Date(`${b.fecha}T${b.hora || '00:00:00'}`);
            return fechaHoraA - fechaHoraB;
        })
        .slice(0, 5);
    
    if (proximasCitas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay citas próximas</p>';
        return;
    }
    
    container.innerHTML = proximasCitas.map(cita => `
        <div class="border-bottom pb-2 mb-2">
            <small class="text-muted">${formatearFecha(cita.fecha)} ${cita.hora ? '- ' + cita.hora.substring(0, 5) : ''}</small>
            <p class="mb-0"><strong>${cita.nombrePaciente || 'Sin paciente'}</strong></p>
            <small>${cita.nombreMedico || 'Sin médico'}</small>
        </div>
    `).join('');
}

// Formatear fecha
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', opciones);
}

// Mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertContainer.style.zIndex = '9999';
    alertContainer.style.minWidth = '300px';
    alertContainer.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        alertContainer.remove();
    }, 4000);
}