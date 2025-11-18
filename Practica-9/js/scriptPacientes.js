document.addEventListener('DOMContentLoaded', function () {
    cargarPacientes();
    
    const buscador = document.getElementById('buscar');
    if (buscador) {
        buscador.addEventListener('keyup', buscarPaciente);
    }
    
    const btnAgregar = document.getElementById('agregarPacientes');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            limpiarFormulario();
            document.getElementById('tituloModal').textContent = 'Agregar Paciente';
            document.getElementById('idPaciente').value = '';
        });
    }
});

function cargarPacientes() {
    fetch('obtener_pacientes.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarPacientes(data.data);
            } else {
                console.error('Error:', data.error);
                mostrarError('Error al cargar pacientes: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            mostrarError('Error de conexión al servidor');
        });
}

function mostrarPacientes(pacientes) {
    const tabla = document.getElementById('tabla-pacientes');
    tabla.innerHTML = '';

    if (!pacientes || pacientes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="16" class="text-center text-muted py-4"><em>No hay pacientes registrados</em></td></tr>';
        return;
    }

    pacientes.forEach(paciente => {
        const badgeClass = paciente.estatus === 'Activo' ? 'bg-success' : 'bg-danger';
        const alergias = paciente.alergias ? paciente.alergias : '<em>N/A</em>';
        const antecedentes = paciente.antecedentes_medicos ? paciente.antecedentes_medicos : '<em>N/A</em>';
        
        const fila = `
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nombre || ''}</td>
                <td>${paciente.apellido_paterno || ''}</td>
                <td>${paciente.apellido_materno || ''}</td>
                <td>${paciente.curp || ''}</td>
                <td>${paciente.fecha_nacimiento || ''}</td>
                <td>${paciente.sexo || ''}</td>
                <td>${paciente.telefono || ''}</td>
                <td>${paciente.correo || ''}</td>
                <td>${paciente.direccion || ''}</td>
                <td>${paciente.telefono_emergencia || ''}</td>
                <td>${alergias}</td>
                <td>${antecedentes}</td>
                <td>${formatearFecha(paciente.fecha_registro)}</td>
                <td><span class="badge ${badgeClass}">${paciente.estatus || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente(${paciente.id})" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPaciente(${paciente.id})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX');
}

function mostrarError(mensaje) {
    const tabla = document.getElementById('tabla-pacientes');
    tabla.innerHTML = `<tr><td colspan="16" class="text-center text-danger py-4"><strong>${mensaje}</strong></td></tr>`;
}

function buscarPaciente() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    
    const filas = document.querySelectorAll('#tabla-pacientes tr');
    
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        let coincide = false;
        
        for (let i = 1; i < 5 && !coincide; i++) {
            if (celdas[i] && celdas[i].textContent.toLowerCase().includes(texto)) {
                coincide = true;
            }
        }
        
        fila.style.display = coincide ? '' : 'none';
    });
}

function editarPaciente(id) {
    fetch('actualizar_pacientes.php?id=' + id)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const p = data.data;
            document.getElementById('tituloModal').textContent = 'Editar Paciente';
            document.getElementById('nombre').value = p.nombre || '';
            document.getElementById('apellido_paterno').value = p.apellido_paterno || '';
            document.getElementById('apellido_materno').value = p.apellido_materno || '';
            document.getElementById('curp').value = p.curp || '';
            document.getElementById('fecha_nacimiento').value = p.fecha_nacimiento || '';
            document.getElementById('sexo').value = p.sexo || '';
            document.getElementById('telefono').value = p.telefono || '';
            document.getElementById('correo').value = p.correo || '';
            document.getElementById('direccion').value = p.direccion || '';
            document.getElementById('contacto_emergencia').value = p.contacto_emergencia || '';
            document.getElementById('telefono_emergencia').value = p.telefono_emergencia || '';
            document.getElementById('alergias').value = p.alergias || '';
            document.getElementById('antecedentes').value = p.antecedentes_medicos || '';
            document.getElementById('estatus').value = p.estatus || '';
            document.getElementById('idPaciente').value = id;
            
            const modal = new bootstrap.Modal(document.getElementById('modalPacientes'));
            modal.show();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar datos del paciente');
    });
}

function eliminarPaciente(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
        fetch('eliminar_pacientes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Paciente eliminado correctamente');
                cargarPacientes();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar paciente');
        });
    }
}

function guardarActualizacion() {
    const id = document.getElementById('idPaciente').value;
    
    const datos = {
        nombre: document.getElementById('nombre').value,
        apellido_paterno: document.getElementById('apellido_paterno').value,
        apellido_materno: document.getElementById('apellido_materno').value,
        curp: document.getElementById('curp').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        sexo: document.getElementById('sexo').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        direccion: document.getElementById('direccion').value,
        contacto_emergencia: document.getElementById('contacto_emergencia').value,
        telefono_emergencia: document.getElementById('telefono_emergencia').value,
        alergias: document.getElementById('alergias').value,
        antecedentes_medicos: document.getElementById('antecedentes').value,
        estatus: document.getElementById('estatus').value
    };

    if (id) {
        datos.id = parseInt(id);
        fetch('actualizar_pacientes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.text())  
        .then(texto => {
            console.log('Respuesta del servidor:', texto); 
            try {
                const data = JSON.parse(texto);
                if (data.success) {
                    alert('Paciente actualizado correctamente');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalPacientes'));
                    modal.hide();
                    cargarPacientes();
                } else {
                    console.error('Error del servidor:', data.error);
                    alert('Error: ' + data.error);
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                console.error('Texto recibido:', texto);
                alert('Error del servidor. Revisa la consola para más detalles.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            alert('Error al guardar cambios: ' + error.message);
        });
    } else {
        fetch('proceso_paciente.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.text()) 
        .then(texto => {
            console.log('Respuesta del servidor:', texto);
            try {
                const data = JSON.parse(texto);
                if (data.success) {
                    alert('Paciente agregado correctamente');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalPacientes'));
                    modal.hide();
                    cargarPacientes();
                } else {
                    console.error('Error del servidor:', data.error);
                    alert('Error: ' + data.error);
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                console.error('Texto recibido:', texto);
                alert('Error del servidor. Revisa la consola para más detalles.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            alert('Error al agregar paciente: ' + error.message);
        });
    }
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido_paterno').value = '';
    document.getElementById('apellido_materno').value = '';
    document.getElementById('curp').value = '';
    document.getElementById('fecha_nacimiento').value = '';
    document.getElementById('sexo').value = 'M';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('contacto_emergencia').value = '';
    document.getElementById('telefono_emergencia').value = '';
    document.getElementById('alergias').value = '';
    document.getElementById('antecedentes').value = '';
    document.getElementById('estatus').value = 'Activo';
}