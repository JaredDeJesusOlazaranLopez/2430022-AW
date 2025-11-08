let pacientes = [];
let tablaPacientes = document.getElementById('tabla-pacientes');
let botoncillo = document.getElementById('agregarPacientes');
let agregarPacientes = document.getElementById('formPacientes');
let modal;
let pacienteEditando = null;

function cargarPacientes() {
    const pacientesGuardados = localStorage.getItem('pacientes');
    if (pacientesGuardados) {
        pacientes = JSON.parse(pacientesGuardados);
        mostrarTabla();
    }
}

botoncillo.addEventListener('click', e => {
    e.preventDefault();
    pacienteEditando = null;
    document.getElementById('tituloModal').textContent = 'Agregar Paciente';
    document.getElementById('idPaciente').value = '';
    agregarPacientes.reset();
    modal.show();
});

agregarPacientes.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('idPaciente').value;
    const nombreP = document.getElementById('nombreP').value.trim();
    const apellidoPaterno = document.getElementById('apellidoPaterno').value.trim();
    const apellidoMaterno = document.getElementById('apellidoMaterno').value.trim();
    const curpP = document.getElementById('curpP').value.trim().toUpperCase();
    const fechaNP = document.getElementById('fnP').value;
    const sexoP = document.getElementById('sexoP').value;
    const telP = document.getElementById('telP').value.trim();
    const correoP = document.getElementById('correoP').value.trim();
    const direccion = document.getElementById('direccionP').value.trim();
    const telEP = document.getElementById('telEP').value.trim();
    const alergiasP = document.getElementById('alergiasP').value.trim() || 'Ninguna';
    const antecedentesP = document.getElementById('amP').value.trim() || 'Ninguno';
    const estatusP = document.getElementById('estatusP').value;

    if (!nombreP || !apellidoPaterno || !apellidoMaterno || !curpP || !fechaNP || !sexoP || !telP || !correoP || !direccion || !telEP || !estatusP) {
        Swal.fire({
            title: "Error",
            text: "Porfavor introduzca todos los campos",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
        return;
    }

    const fechaNPdos = new Date(fechaNP);
    const fechaActual = new Date();

    fechaNPdos.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaNPdos > fechaActual) {
        Swal.fire({
            title: "Error",
            text: "Pon fechas validas porfavor",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
        return;
    }

    let curpDuplicado = false;
    for (let i = 0; i < pacientes.length; i++) {
        if (pacientes[i].curp === curpP && pacientes[i].id != id) {
            curpDuplicado = true;
            break;
        }
    }

    if (curpDuplicado) {
        Swal.fire('Error', 'Parece que esta CURP ya esta registrada', 'error');
        return;
    }

    const paciente = {
        id: id || Date.now().toString(),
        nombre: nombreP,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        curp: curpP,
        fechaNacimiento: fechaNP,
        sexo: sexoP,
        telefono: telP,
        correo: correoP,
        direccion: direccion,
        telefonoEmergencia: telEP,
        alergias: alergiasP,
        antecedentes: antecedentesP,
        fechaRegistro: id ? pacientes.find(p => p.id === id).fechaRegistro : new Date().toISOString(),
        estatus: estatusP
    };

    if (id) {
        for (let i = 0; i < pacientes.length; i++) {
            if (pacientes[i].id === id) {
                pacientes[i] = paciente;
                break;
            }
        }
    } else {
        pacientes.push(paciente);
    }

    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    Swal.fire({
        title: "Paciente guardado",
        text: "Se guardo el paciente con exito",
        icon: "success",
        confirmButtonText: "Continuar"
    });
    modal.hide();
    agregarPacientes.reset();
    mostrarTabla();
});

function mostrarTabla(lista) {
    tablaPacientes.innerHTML = '';
    const pacientesAMostrar = lista || pacientes;

    for (let i = 0; i < pacientesAMostrar.length; i++) {
        const paciente = pacientesAMostrar[i];
        const fila = tablaPacientes.insertRow();
        const fechaRegistro = new Date(paciente.fechaRegistro);
        
        fila.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.apellidoPaterno}</td>
            <td>${paciente.apellidoMaterno}</td>
            <td>${paciente.curp}</td>
            <td>${paciente.fechaNacimiento}</td>
            <td>${paciente.sexo}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.correo}</td>
            <td>${paciente.direccion}</td>
            <td>${paciente.telefonoEmergencia}</td>
            <td>${paciente.alergias}</td>
            <td>${paciente.antecedentes}</td>
            <td>${fechaRegistro.toLocaleDateString()}</td>
            <td>${paciente.estatus}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarPaciente('${paciente.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPaciente('${paciente.id}')">Eliminar</button>
            </td>
        `;
    }
}

function editarPaciente(id) {
    let paciente = null;
    for (let i = 0; i < pacientes.length; i++) {
        if (pacientes[i].id === id) {
            paciente = pacientes[i];
            break;
        }
    }
    
    if (!paciente) return;

    pacienteEditando = paciente;
    document.getElementById('tituloModal').textContent = 'Editar Paciente';
    document.getElementById('idPaciente').value = paciente.id;
    document.getElementById('nombreP').value = paciente.nombre;
    document.getElementById('apellidoPaterno').value = paciente.apellidoPaterno;
    document.getElementById('apellidoMaterno').value = paciente.apellidoMaterno;
    document.getElementById('curpP').value = paciente.curp;
    document.getElementById('fnP').value = paciente.fechaNacimiento;
    document.getElementById('sexoP').value = paciente.sexo;
    document.getElementById('telP').value = paciente.telefono;
    document.getElementById('correoP').value = paciente.correo;
    document.getElementById('direccionP').value = paciente.direccion;
    document.getElementById('telEP').value = paciente.telefonoEmergencia;
    document.getElementById('alergiasP').value = paciente.alergias;
    document.getElementById('amP').value = paciente.antecedentes;
    document.getElementById('estatusP').value = paciente.estatus;
    
    modal.show();
}

function eliminarPaciente(id) {
    Swal.fire({
        title: 'Estás seguro?',
        text: 'No podras recuperar este paciente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let nuevaLista = [];
            for (let i = 0; i < pacientes.length; i++) {
                if (pacientes[i].id !== id) {
                    nuevaLista.push(pacientes[i]);
                }
            }
            pacientes = nuevaLista;
            
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            mostrarTabla();
            Swal.fire({
                title: 'Eliminado',
                text: 'El paciente ha sido eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        }
    });
}

function buscarPaciente() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    let resultado = [];
    
    for (let i = 0; i < pacientes.length; i++) {
        const nombreCompleto = (pacientes[i].nombre + ' ' + pacientes[i].apellidoPaterno + ' ' + pacientes[i].apellidoMaterno).toLowerCase();
        const curp = pacientes[i].curp.toLowerCase();
        
        if (nombreCompleto.includes(texto) || curp.includes(texto)) {
            resultado.push(pacientes[i]);
        }
    }
    
    mostrarTabla(resultado);
}

document.addEventListener('DOMContentLoaded', function() {
    modal = new bootstrap.Modal(document.getElementById('modalPacientes'));
    cargarPacientes();
    
    document.getElementById('buscar').addEventListener('input', buscarPaciente);
});

window.editarPaciente = editarPaciente;
window.eliminarPaciente = eliminarPaciente;