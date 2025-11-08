let medicos = [];
let tablaMedicos = document.getElementById('tabla-medicos');
let botoncillo = document.getElementById('agregarMedicos');
let agregarMedicos = document.getElementById('formMedicos');
let modalDoctores;
let medicoEditando = null;

function cargarMedicos() {
    const medicosGuardados = localStorage.getItem('medicos');
    if (medicosGuardados) {
        medicos = JSON.parse(medicosGuardados);
        mostrarTabla();
    }
}

function cargarEspecialidades() {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const select = document.getElementById('especialidadM');
    select.innerHTML = '<option value="">Seleccione una especialidad</option>';
    
    for (let i = 0; i < especialidades.length; i++) {
        if (especialidades[i].estado === 'Activa') {
            const option = document.createElement('option');
            option.value = especialidades[i].id;
            option.textContent = especialidades[i].nombre;
            select.appendChild(option);
        }
    }
}

function obtenerNombreEspecialidad(id) {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    for (let i = 0; i < especialidades.length; i++) {
        if (especialidades[i].id == id) {
            return especialidades[i].nombre;
        }
    }
    return 'Sin especialidad';
}

botoncillo.addEventListener('click', e => {
    e.preventDefault();
    medicoEditando = null;
    document.getElementById('tituloModal').textContent = 'Agregar medico';
    document.getElementById('idMedico').value = '';
    agregarMedicos.reset();
    cargarEspecialidades();
    modalDoctores.show();
});

agregarMedicos.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('idMedico').value;
    const nombreM = document.getElementById('nombreM').value.trim();
    const apellidoPaterno = document.getElementById('apellidoPaterno').value.trim();
    const apellidoMaterno = document.getElementById('apellidoMaterno').value.trim();
    const cedulaM = document.getElementById('cedulaM').value.trim();
    const especialidadM = document.getElementById('especialidadM').value;
    const telefonoM = document.getElementById('telefonoM').value.trim();
    const correoM = document.getElementById('correoM').value.trim();
    const horarioDM = document.getElementById('horarioDM').value;
    const horarioAM = document.getElementById('horarioAM').value;
    const fechaM = document.getElementById('fechaM').value;
    const estatus = document.getElementById('estatusM').value;

    if (!nombreM || !apellidoPaterno || !apellidoMaterno || !cedulaM || !especialidadM || !telefonoM || !correoM || !horarioDM || !horarioAM || !fechaM || !estatus) {
        Swal.fire({
            title: "Error",
            text: "Porfavor introduzca todos los campos",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
        return;
    }

    const fechaMdos = new Date(fechaM);
    const fechaActual = new Date();

    fechaMdos.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaMdos > fechaActual) {
        Swal.fire({
            title: "Error",
            text: "Porfavor seleccione una fecha valida",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
        return;
    }

    let cedulaDuplicada = false;
    for (let i = 0; i < medicos.length; i++) {
        if (medicos[i].cedula === cedulaM && medicos[i].id != id) {
            cedulaDuplicada = true;
            break;
        }
    }

    if (cedulaDuplicada) {
        Swal.fire('Error', 'Ya existe un medico con esta cedula', 'error');
        return;
    }

    const medico = {
        id: id || Date.now().toString(),
        nombre: nombreM,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        cedula: cedulaM,
        especialidad: especialidadM,
        telefono: telefonoM,
        correo: correoM,
        horarioD: horarioDM,
        horarioA: horarioAM,
        fecha: fechaM,
        estatus: estatus
    };

    if (id) {
        for (let i = 0; i < medicos.length; i++) {
            if (medicos[i].id === id) {
                medicos[i] = medico;
                break;
            }
        }
    } else {
        medicos.push(medico);
    }

    localStorage.setItem('medicos', JSON.stringify(medicos));
    mostrarTabla();
    modalDoctores.hide();
    Swal.fire('Éxito', 'Medico guardado correctamente', 'success');
});

function mostrarTabla(lista) {
    tablaMedicos.innerHTML = '';
    const medicosAMostrar = lista || medicos;

    for (let i = 0; i < medicosAMostrar.length; i++) {
        const medico = medicosAMostrar[i];
        const fila = tablaMedicos.insertRow();
        const nombreCompleto = medico.nombre + ' ' + medico.apellidoPaterno + ' ' + medico.apellidoMaterno;
        const especialidad = obtenerNombreEspecialidad(medico.especialidad);
        
        fila.innerHTML = `
            <td>${medico.id}</td>
            <td>${nombreCompleto}</td>
            <td>${medico.cedula}</td>
            <td>${especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.correo}</td>
            <td>${medico.horarioD} - ${medico.horarioA}</td>
            <td>${medico.fecha}</td>
            <td>${medico.estatus}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarMedico('${medico.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarMedico('${medico.id}')">Eliminar</button>
            </td>`;
    }
}

function editarMedico(id) {
    let medico = null;
    for (let i = 0; i < medicos.length; i++) {
        if (medicos[i].id === id) {
            medico = medicos[i];
            break;
        }
    }
    
    if (!medico) return;

    medicoEditando = medico;
    document.getElementById('tituloModal').textContent = 'Editar medico';
    document.getElementById('idMedico').value = medico.id;
    document.getElementById('nombreM').value = medico.nombre;
    document.getElementById('apellidoPaterno').value = medico.apellidoPaterno;
    document.getElementById('apellidoMaterno').value = medico.apellidoMaterno;
    document.getElementById('cedulaM').value = medico.cedula;
    document.getElementById('telefonoM').value = medico.telefono;
    document.getElementById('correoM').value = medico.correo;
    document.getElementById('horarioDM').value = medico.horarioD;
    document.getElementById('horarioAM').value = medico.horarioA;
    document.getElementById('fechaM').value = medico.fecha;
    document.getElementById('estatusM').value = medico.estatus;
    
    cargarEspecialidades();
    document.getElementById('especialidadM').value = medico.especialidad;
    
    modalDoctores.show();
}

function eliminarMedico(id) {
    Swal.fire({
        title: 'Estás seguro?',
        text: 'No podras recuperar este medico',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let nuevaLista = [];
            for (let i = 0; i < medicos.length; i++) {
                if (medicos[i].id !== id) {
                    nuevaLista.push(medicos[i]);
                }
            }
            medicos = nuevaLista;
            
            localStorage.setItem('medicos', JSON.stringify(medicos));
            mostrarTabla();
            Swal.fire({
                title: 'Eliminado',
                text: 'El medico ha sido eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        }
    });
}

function buscarMedico() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    let resultado = [];
    
    for (let i = 0; i < medicos.length; i++) {
        const nombreCompleto = (medicos[i].nombre + ' ' + medicos[i].apellidoPaterno + ' ' + medicos[i].apellidoMaterno).toLowerCase();
        const cedula = medicos[i].cedula.toLowerCase();
        
        if (nombreCompleto.includes(texto) || cedula.includes(texto)) {
            resultado.push(medicos[i]);
        }
    }
    
    mostrarTabla(resultado);
}

document.addEventListener('DOMContentLoaded', function() {
    modalDoctores = new bootstrap.Modal(document.getElementById('modalDoctores'));
    cargarMedicos();
    cargarEspecialidades();
    
    document.getElementById('buscar').addEventListener('input', buscarMedico);
});

window.editarMedico = editarMedico;
window.eliminarMedico = eliminarMedico;