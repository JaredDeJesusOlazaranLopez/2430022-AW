// Variables globales
let pagosData = [];
let citasData = [];
let modalPago;
let modalDetallePago;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    modalPago = new bootstrap.Modal(document.getElementById('modalPago'));
    modalDetallePago = new bootstrap.Modal(document.getElementById('modalDetallePago'));
    
    cargarPagos();
    cargarCitas();
    cargarTarifas();
    
    // Event listeners
    document.getElementById('buscarPago').addEventListener('input', filtrarPagos);
    document.getElementById('filtroEstado').addEventListener('change', filtrarPagos);
    document.getElementById('filtroMetodo').addEventListener('change', filtrarPagos);
    document.getElementById('idCitaPago').addEventListener('change', cargarDatosCita);
    document.getElementById('tipoServicio').addEventListener('change', mostrarSeccionServicio);
    document.getElementById('idTarifaPago').addEventListener('change', actualizarMontoServicio);
    
    // Limpiar formulario al cerrar modal
    document.getElementById('modalPago').addEventListener('hidden.bs.modal', limpiarFormulario);
});

// Cargar lista de pagos
async function cargarPagos() {
    try {
        const response = await fetch('obtener_pagos.php');
        const data = await response.json();
        
        if (data.success) {
            pagosData = data.data;
            mostrarPagos(pagosData);
        } else {
            mostrarError('Error al cargar pagos: ' + data.error);
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
        console.error('Error completo:', error);
    }
}

// Mostrar pagos en la tabla
function mostrarPagos(pagos) {
    const tbody = document.getElementById('listaPagos');
    
    if (pagos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">No hay pagos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = pagos.map(pago => `
        <tr>
            <td>${pago.idPago}</td>
            <td>${pago.nombrePaciente}</td>
            <td>${pago.nombreMedico || 'N/A'}</td>
            <td>${pago.descripcionServicio}</td>
            <td class="fw-bold text-success">$${parseFloat(pago.monto).toFixed(2)}</td>
            <td><span class="badge bg-secondary">${pago.metodoPago}</span></td>
            <td>${formatearFecha(pago.fechaPago)}</td>
            <td>
                ${pago.estatus == 1 
                    ? '<span class="badge bg-success">Pagado</span>' 
                    : '<span class="badge bg-warning">Pendiente</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verDetalle(${pago.idPago})" title="Ver detalles">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPago(${pago.idPago})" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filtrar pagos
function filtrarPagos() {
    const busqueda = document.getElementById('buscarPago').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value;
    const metodo = document.getElementById('filtroMetodo').value;
    
    const pagosFiltrados = pagosData.filter(pago => {
        const cumpleBusqueda = pago.nombrePaciente.toLowerCase().includes(busqueda) ||
                               (pago.nombreMedico && pago.nombreMedico.toLowerCase().includes(busqueda)) ||
                               pago.descripcionServicio.toLowerCase().includes(busqueda);
        const cumpleEstado = estado === '' || pago.estatus == estado;
        const cumpleMetodo = metodo === '' || pago.metodoPago === metodo;
        
        return cumpleBusqueda && cumpleEstado && cumpleMetodo;
    });
    
    mostrarPagos(pagosFiltrados);
}

// Cargar citas
async function cargarCitas() {
    try {
        const response = await fetch('../Agenda/obtener_cita.php');
        const data = await response.json();
        
        if (data.success) {
            citasData = data.data;
            const select = document.getElementById('idCitaPago');
            select.innerHTML = '<option value="">Seleccione una cita</option>' +
                citasData.map(c => 
                    `<option value="${c.id}" 
                        data-paciente="${c.nombrePaciente}" 
                        data-id-paciente="${c.idPaciente}"
                        data-medico="${c.nombreMedico}"
                        data-id-medico="${c.idMedico}">
                        ${c.nombrePaciente} - ${c.nombreMedico} - ${c.fecha} ${c.hora}
                    </option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error al cargar citas:', error);
    }
}

// Cargar datos de la cita seleccionada
async function cargarDatosCita() {
    const select = document.getElementById('idCitaPago');
    const selectedOption = select.options[select.selectedIndex];
    
    if (select.value === '') {
        document.getElementById('detallesCita').style.display = 'none';
        document.getElementById('seccionTipo').style.display = 'none';
        document.getElementById('seccionConsulta').style.display = 'none';
        document.getElementById('seccionServicio').style.display = 'none';
        document.getElementById('seccionPago').style.display = 'none';
        document.getElementById('seccionEstado').style.display = 'none';
        document.getElementById('btnGuardarPago').style.display = 'none';
        return;
    }
    
    const nombrePaciente = selectedOption.getAttribute('data-paciente');
    const idPaciente = selectedOption.getAttribute('data-id-paciente');
    const nombreMedico = selectedOption.getAttribute('data-medico');
    const idMedico = selectedOption.getAttribute('data-id-medico');
    
    document.getElementById('nombrePacienteInfo').value = nombrePaciente;
    document.getElementById('idPacientePago').value = idPaciente;
    document.getElementById('nombreMedicoInfo').value = nombreMedico;
    document.getElementById('idMedicoPago').value = idMedico;
    
    // Obtener la tarifa del médico
    try {
        const response = await fetch(`obtener_tarifa_medico.php?idMedico=${idMedico}`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('tarifaConsultaHidden').value = data.tarifa;
            document.getElementById('tarifaConsultaInfo').textContent = parseFloat(data.tarifa).toFixed(2);
            document.getElementById('nombreMedicoTarifa').textContent = nombreMedico;
        }
    } catch (error) {
        console.error('Error al obtener tarifa del médico:', error);
    }
    
    document.getElementById('detallesCita').style.display = 'flex';
    document.getElementById('seccionTipo').style.display = 'block';
}

// Mostrar sección según tipo de servicio
function mostrarSeccionServicio() {
    const tipoServicio = document.getElementById('tipoServicio').value;
    
    document.getElementById('seccionConsulta').style.display = 'none';
    document.getElementById('seccionServicio').style.display = 'none';
    document.getElementById('seccionPago').style.display = 'none';
    document.getElementById('seccionEstado').style.display = 'none';
    document.getElementById('btnGuardarPago').style.display = 'none';
    
    if (tipoServicio === 'consulta') {
        // Mostrar sección de consulta médica
        const tarifaConsulta = document.getElementById('tarifaConsultaHidden').value;
        document.getElementById('montoPago').value = parseFloat(tarifaConsulta).toFixed(2);
        document.getElementById('idTarifaPago').value = '';
        
        document.getElementById('seccionConsulta').style.display = 'block';
        document.getElementById('seccionPago').style.display = 'flex';
        document.getElementById('seccionEstado').style.display = 'block';
        document.getElementById('btnGuardarPago').style.display = 'block';
        
    } else if (tipoServicio === 'servicio') {
        // Mostrar sección de servicios adicionales
        document.getElementById('seccionServicio').style.display = 'block';
        document.getElementById('seccionPago').style.display = 'flex';
        document.getElementById('seccionEstado').style.display = 'block';
        document.getElementById('btnGuardarPago').style.display = 'block';
    }
}

// Cargar tarifas de servicios adicionales
async function cargarTarifas() {
    try {
        const response = await fetch('obtener_tarifas_servicios.php');
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('idTarifaPago');
            select.innerHTML = '<option value="">Seleccione un servicio</option>' +
                data.data.map(t => 
                    `<option value="${t.idTarifa}" data-costo="${t.costo}">${t.nombreServicio} - $${parseFloat(t.costo).toFixed(2)}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error al cargar tarifas:', error);
    }
}

// Actualizar monto al seleccionar servicio adicional
function actualizarMontoServicio() {
    const select = document.getElementById('idTarifaPago');
    const selectedOption = select.options[select.selectedIndex];
    const costo = selectedOption.getAttribute('data-costo');
    
    if (costo) {
        document.getElementById('montoPago').value = parseFloat(costo).toFixed(2);
    }
}

// Guardar pago
async function guardarPago() {
    const idCita = document.getElementById('idCitaPago').value;
    const idPaciente = document.getElementById('idPacientePago').value;
    const idMedico = document.getElementById('idMedicoPago').value;
    const tipoServicio = document.getElementById('tipoServicio').value;
    const monto = document.getElementById('montoPago').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const estatus = document.getElementById('estatusPago').value;
    
    // Validaciones
    if (!idCita || !idPaciente || !tipoServicio || !monto || !metodoPago) {
        Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    let descripcionServicio = '';
    let idTarifa = null;
    
    if (tipoServicio === 'consulta') {
        descripcionServicio = 'Consulta Médica - Dr(a). ' + document.getElementById('nombreMedicoInfo').value;
    } else if (tipoServicio === 'servicio') {
        idTarifa = document.getElementById('idTarifaPago').value;
        if (!idTarifa) {
            Swal.fire('Error', 'Por favor seleccione un servicio adicional', 'error');
            return;
        }
        const selectTarifa = document.getElementById('idTarifaPago');
        descripcionServicio = selectTarifa.options[selectTarifa.selectedIndex].text.split(' - ')[0];
    }
    
    const datos = {
        idPaciente,
        idMedico,
        idCita,
        idTarifa,
        tipoServicio,
        descripcionServicio,
        monto,
        metodoPago,
        estatus
    };
    
    try {
        const response = await fetch('proceso_pagos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success');
            modalPago.hide();
            cargarPagos();
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
        console.error('Error completo:', error);
    }
}

// Ver detalle del pago
function verDetalle(id) {
    const pago = pagosData.find(p => p.idPago == id);
    
    if (pago) {
        document.getElementById('detalleIdPago').textContent = pago.idPago;
        document.getElementById('detallePacientePago').textContent = pago.nombrePaciente;
        document.getElementById('detalleMedicoPago').textContent = pago.nombreMedico || 'N/A';
        document.getElementById('detalleServicio').textContent = pago.descripcionServicio;
        document.getElementById('detalleMontoPago').textContent = '$' + parseFloat(pago.monto).toFixed(2);
        document.getElementById('detalleMetodoPago').textContent = pago.metodoPago;
        document.getElementById('detalleFechaPago').textContent = formatearFecha(pago.fechaPago);
        document.getElementById('detalleEstadoPago').innerHTML = pago.estatus == 1 
            ? '<span class="badge bg-success">Pagado</span>' 
            : '<span class="badge bg-warning">Pendiente</span>';
        
        modalDetallePago.show();
    }
}

// Eliminar pago
async function eliminarPago(id) {
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
            const response = await fetch('eliminar_pago.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            const data = await response.json();
            
            if (data.success) {
                Swal.fire('Eliminado', data.message, 'success');
                cargarPagos();
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
        }
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formPago').reset();
    document.getElementById('idPago').value = '';
    document.getElementById('detallesCita').style.display = 'none';
    document.getElementById('seccionTipo').style.display = 'none';
    document.getElementById('seccionConsulta').style.display = 'none';
    document.getElementById('seccionServicio').style.display = 'none';
    document.getElementById('seccionPago').style.display = 'none';
    document.getElementById('seccionEstado').style.display = 'none';
    document.getElementById('btnGuardarPago').style.display = 'none';
    document.getElementById('tituloModalPago').innerHTML = 
        '<i class="fa-solid fa-money-bill"></i> Registrar Pago';
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar error
function mostrarError(mensaje) {
    document.getElementById('listaPagos').innerHTML = 
        `<tr><td colspan="9" class="text-center text-danger py-4">${mensaje}</td></tr>`;
}