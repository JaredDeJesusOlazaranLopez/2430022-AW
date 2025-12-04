document.addEventListener('DOMContentLoaded', function() {
    cargarPacientes();
    
    document.getElementById('buscar').addEventListener('input', function(e) {
        const termino = e.target.value.toLowerCase();
        filtrarPacientes(termino);
    });

    document.getElementById('agregarPacientes').addEventListener('click', function() {
        limpiarFormulario();
        document.getElementById('tituloModal').textContent = 'Agregar Paciente';
        document.getElementById('idPaciente').value = '';
    });
});

function cargarPacientes() {
    fetch('obtener_pacientes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarPacientes(data.data);
            } else {
                console.error('Error:', data.error);
                document.getElementById('tabla-pacientes').innerHTML = 
                    '<tr><td colspan="8" class="text-center text-danger">Error al cargar pacientes: ' + (data.error || 'Desconocido') + '</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('tabla-pacientes').innerHTML = 
                '<tr><td colspan="8" class="text-center text-danger">Error de conexión con el servidor</td></tr>';
        });
}

function mostrarPacientes(pacientes) {
    const tbody = document.getElementById('tabla-pacientes');
    
    if (!pacientes || pacientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay pacientes registrados</td></tr>';
        return;
    }

    let html = '';
    pacientes.forEach(paciente => {
        const nombre = paciente.nombre || '';
        const apellidoP = paciente.apellido_paterno || '';
        const apellidoM = paciente.apellido_materno || '';
        const nombreCompleto = `${nombre} ${apellidoP} ${apellidoM}`.trim() || 'Sin nombre';
        
        let sexoTexto = 'N/A';
        if (paciente.sexo === 'M' || paciente.sexo === 'm') {
            sexoTexto = 'Masculino';
        } else if (paciente.sexo === 'F' || paciente.sexo === 'f') {
            sexoTexto = 'Femenino';
        }
        
        html += `
            <tr>
                <td>${paciente.idPaciente || 'N/A'}</td>
                <td><strong>${nombreCompleto}</strong></td>
                <td>${sexoTexto}</td>
                <td>${paciente.curp || 'N/A'}</td>
                <td>${paciente.direccion || 'N/A'}</td>
                <td>${paciente.telefono || 'N/A'}</td>
                <td>${paciente.correoElectronico || paciente.correo || 'N/A'}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarPaciente(${paciente.idPaciente})" title="Editar">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminacion(${paciente.idPaciente}, '${nombreCompleto}')" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function filtrarPacientes(termino) {
    const filas = document.querySelectorAll('#tabla-pacientes tr');
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(termino)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function guardarActualizacion() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellidoP = document.getElementById('apellido_paterno').value.trim();
    const curp = document.getElementById('curp').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    
    if (!nombre || !apellidoP || !curp || !telefono || !correo) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    const idPaciente = document.getElementById('idPaciente').value;
    const url = idPaciente ? 'actualizar_pacientes.php' : 'proceso_paciente.php';
    
    const datos = {
        id: idPaciente,
        nombre: nombre,
        apellido_paterno: apellidoP,
        apellido_materno: document.getElementById('apellido_materno').value.trim(),
        curp: curp,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        sexo: document.getElementById('sexo').value,
        telefono: telefono,
        correo: correo,
        direccion: document.getElementById('direccion').value.trim(),
        contacto_emergencia: document.getElementById('contacto_emergencia').value.trim(),
        telefono_emergencia: document.getElementById('telefono_emergencia').value.trim(),
        alergias: document.getElementById('alergias').value.trim(),
        antecedentes_medicos: document.getElementById('antecedentes').value.trim(),
        estatus: document.getElementById('estatus').value
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message || 'Paciente guardado correctamente');
            const modalElement = document.getElementById('modalPacientes');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            cargarPacientes();
            limpiarFormulario();
        } else {
            alert('Error: ' + (data.error || 'No se pudo guardar el paciente'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión al guardar el paciente');
    });
}

function editarPaciente(id) {
    fetch(`actualizar_pacientes.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const paciente = data.data;
                
                document.getElementById('idPaciente').value = paciente.id || paciente.id_paciente;
                document.getElementById('nombre').value = paciente.nombre || '';
                document.getElementById('apellido_paterno').value = paciente.apellido_paterno || '';
                document.getElementById('apellido_materno').value = paciente.apellido_materno || '';
                document.getElementById('curp').value = paciente.curp || '';
                document.getElementById('fecha_nacimiento').value = paciente.fecha_nacimiento || '';
                document.getElementById('sexo').value = paciente.sexo || 'M';
                document.getElementById('telefono').value = paciente.telefono || '';
                document.getElementById('correo').value = paciente.correo || '';
                document.getElementById('direccion').value = paciente.direccion || '';
                document.getElementById('contacto_emergencia').value = paciente.contacto_emergencia || '';
                document.getElementById('telefono_emergencia').value = paciente.telefono_emergencia || '';
                document.getElementById('alergias').value = paciente.alergias || '';
                document.getElementById('antecedentes').value = paciente.antecedentes_medicos || '';
                document.getElementById('estatus').value = paciente.estatus || 'Activo';
                
                document.getElementById('tituloModal').textContent = 'Editar Paciente';
                
                const modal = new bootstrap.Modal(document.getElementById('modalPacientes'));
                modal.show();
            } else {
                alert('Error: ' + (data.error || 'No se pudo cargar el paciente'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los datos del paciente');
        });
}

function confirmarEliminacion(id, nombre) {
    if (confirm(`¿Está seguro de que desea eliminar al paciente "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarPaciente(id);
    }
}

function eliminarPaciente(id) {
    fetch('eliminar_pacientes.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message || 'Paciente eliminado correctamente');
            cargarPacientes();
        } else {
            alert('Error: ' + (data.error || 'No se pudo eliminar el paciente'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el paciente');
    });
}

function limpiarFormulario() {
    document.getElementById('idPaciente').value = '';
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