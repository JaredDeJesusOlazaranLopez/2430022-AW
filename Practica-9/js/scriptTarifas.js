let medicos = [];
let modal;

document.addEventListener('DOMContentLoaded', function() {
    modal = new bootstrap.Modal(document.getElementById('modalTarifa'));
    cargarTarifas();
    
    document.getElementById('buscar').addEventListener('input', buscarTarifa);
});

function cargarTarifas() {
    fetch('obtener_tarifas.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                medicos = data.data;
                mostrarTarifas();
            } else {
                Swal.fire('Error', data.error || 'No se pudieron cargar las tarifas', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarTarifas(lista) {
    const tbody = document.getElementById('listaTarifas');
    tbody.innerHTML = '';
    
    const medicosMostrar = lista || medicos;
    
    if (medicosMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay médicos registrados</td></tr>';
        return;
    }
    
    medicosMostrar.forEach(medico => {
        const tarifa = medico.tarifaConsulta ? parseFloat(medico.tarifaConsulta).toFixed(2) : '0.00';
        const badgeTarifa = medico.tarifaConsulta > 0 ? 
            `<span class="text-success fw-bold">$${tarifa}</span>` : 
            `<span class="text-danger">Sin tarifa</span>`;
        
        const fila = `
            <tr>
                <td>${medico.idMedico}</td>
                <td>${medico.nombreCompleto}</td>
                <td>${medico.nombreEspecialidad}</td>
                <td>${medico.cedulaProfesional}</td>
                <td>${medico.horarioAtencion || 'N/A'}</td>
                <td class="text-end">${badgeTarifa}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarTarifa(${medico.idMedico})">
                        <i class="fa-solid fa-edit"></i> Actualizar
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function editarTarifa(idMedico) {
    const medico = medicos.find(m => m.idMedico === idMedico);
    
    if (!medico) {
        Swal.fire('Error', 'Médico no encontrado', 'error');
        return;
    }
    
    document.getElementById('idMedico').value = medico.idMedico;
    document.getElementById('nombreMedico').value = medico.nombreCompleto;
    document.getElementById('especialidad').value = medico.nombreEspecialidad;
    document.getElementById('tarifaConsulta').value = medico.tarifaConsulta || 0;
    
    modal.show();
}

function guardarTarifa() {
    const idMedico = document.getElementById('idMedico').value;
    const tarifaConsulta = document.getElementById('tarifaConsulta').value;
    
    if (!idMedico || tarifaConsulta < 0) {
        Swal.fire('Error', 'Por favor ingrese una tarifa válida', 'error');
        return;
    }
    
    fetch('actualizar_tarifa.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idMedico: parseInt(idMedico),
            tarifaConsulta: parseFloat(tarifaConsulta)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success');
            modal.hide();
            cargarTarifas();
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al guardar la tarifa', 'error');
    });
}

function buscarTarifa() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    
    const resultado = medicos.filter(medico => 
        medico.nombreCompleto.toLowerCase().includes(texto) ||
        medico.nombreEspecialidad.toLowerCase().includes(texto) ||
        medico.cedulaProfesional.toLowerCase().includes(texto)
    );
    
    mostrarTarifas(resultado);
}

window.editarTarifa = editarTarifa;
window.guardarTarifa = guardarTarifa;