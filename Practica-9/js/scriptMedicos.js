//Variables globales y tablas y botones
let medicos = [];
let tablaMedicos = document.getElementById('tabla-medicos');
let botoncillo = document.getElementById('agregarMedicos');
let agregarMedicos = document.getElementById('formMedicos');
let modalDoctores;

//Esta funcion sirve para poder cargar los medicos desde la base de datos
function cargarMedicos() {
    fetch('./obtener_medicos.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                medicos = result.data;
                mostrarMedicos(medicos);
            } else {
                console.error('Error:', result.error);
                Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

//Esta funcion sirve para cargar las especialidades en el select del modal
function cargarEspecialidades() {
    fetch('./obtener_especialidades.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const select = document.getElementById('especialidadM');
                select.innerHTML = '<option value="">Seleccione una especialidad</option>';
                
                result.data.forEach(esp => {
                    const option = document.createElement('option');
                    option.value = esp.idEspecialidad;
                    option.textContent = esp.nombreEspecialidad;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error cargando especialidades:', error));
}

//Evento para el boton de agregar medico donde abre el modal
botoncillo.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('tituloModal').textContent = 'Agregar médico';
    document.getElementById('idMedico').value = '';
    agregarMedicos.reset();
    cargarEspecialidades();
    modalDoctores.show();
});

//Evento para el formulario del modal de agregar medico
agregarMedicos.addEventListener('submit', e => {
    e.preventDefault();
    guardarActualizacion();
});

//Funcion para guardar o actualizar el medico dependiendo si tiene id o no
function guardarActualizacion() {
    const id = document.getElementById('idMedico').value;
    const nombre = document.getElementById('nombreM').value.trim();
    const apellido_paterno = document.getElementById('apellidoPaterno').value.trim();
    const apellido_materno = document.getElementById('apellidoMaterno').value.trim();
    const cedula = document.getElementById('cedulaM').value.trim();
    const especialidad = document.getElementById('especialidadM').value;
    const telefono = document.getElementById('telefonoM').value.trim();
    const correo = document.getElementById('correoM').value.trim();
    const horario_desde = document.getElementById('horarioDM').value;
    const horario_hasta = document.getElementById('horarioAM').value;
    const fecha_ingreso = document.getElementById('fechaM').value;
    const estatus = document.getElementById('estatusM').value;

    if (!nombre || !apellido_paterno || !apellido_materno || !cedula || !especialidad || !telefono || !correo || !horario_desde || !horario_hasta || !fecha_ingreso || !estatus) {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
        return;
    }

    const data = {
        id: id,
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        cedula: cedula,
        especialidad: especialidad,
        telefono: telefono,
        correo: correo,
        horario_desde: horario_desde,
        horario_hasta: horario_hasta,
        fecha_ingreso: fecha_ingreso,
        estatus: estatus
    };

    const url = id ? './actualizar_medicos.php' : './proceso_medicos.php';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            Swal.fire('Éxito', result.message || 'Médico guardado correctamente', 'success');
            modalDoctores.hide();
            limpiarFormulario();
            cargarMedicos();
        } else {
            Swal.fire('Error', result.error || 'Error al guardar', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

//Funcion para mostrar los medicos en la tabla 
function mostrarMedicos(lista) {
    tablaMedicos.innerHTML = '';

    for (let i = 0; i < lista.length; i++) {
        const medico = lista[i];
        const fila = tablaMedicos.insertRow();
        const estatus = medico.estatus == 1 ? 'Activo' : 'Inactivo';
        
        fila.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.nombre_completo}</td>
            <td>${medico.cedula}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.correo}</td>
            <td>${medico.horario}</td>
            <td>${medico.fecha_ingreso}</td>
            <td>${estatus}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarMedico(${medico.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${medico.id})">Eliminar</button>
            </td>`;
    }
}

//Funcion para editar medico, aqui uso como parametro el id del medico lo cual hace que la funcion de guardarActualizacion sepa si es para guardar o actualizar
function editarMedico(id) {
    fetch('actualizar_medicos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            const medico = result.data;
            document.getElementById('tituloModal').textContent = 'Editar médico';
            document.getElementById('idMedico').value = medico.id;
            document.getElementById('nombreM').value = medico.nombre;
            document.getElementById('apellidoPaterno').value = medico.apellido_paterno;
            document.getElementById('apellidoMaterno').value = medico.apellido_materno;
            document.getElementById('cedulaM').value = medico.cedula;
            document.getElementById('telefonoM').value = medico.telefono;
            document.getElementById('correoM').value = medico.correo;
            document.getElementById('horarioDM').value = medico.horario_desde;
            document.getElementById('horarioAM').value = medico.horario_hasta;
            document.getElementById('fechaM').value = medico.fecha_ingreso;
            document.getElementById('estatusM').value = medico.estatus == 1 ? 'Activo' : 'Inactivo';
            cargarEspecialidades();
            document.getElementById('especialidadM').value = medico.especialidad;
            modalDoctores.show();
        } else {
            Swal.fire('Error', result.error || 'No se pudo cargar el médico', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

//Funcion para eliminar medico por medio de su id
function eliminarMedico(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este médico',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('./eliminar_medicos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Swal.fire('Eliminado', 'El médico ha sido eliminado correctamente', 'success');
                    cargarMedicos();
                } else {
                    Swal.fire('Error', result.error || 'Error al eliminar', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error de conexión', 'error');
            });
        }
    });
}

//Funcion para limpiar el formulario del modal
function limpiarFormulario() {
    document.getElementById('idMedico').value = '';
    document.getElementById('nombreM').value = '';
    document.getElementById('apellidoPaterno').value = '';
    document.getElementById('apellidoMaterno').value = '';
    document.getElementById('cedulaM').value = '';
    document.getElementById('especialidadM').value = '';
    document.getElementById('telefonoM').value = '';
    document.getElementById('correoM').value = '';
    document.getElementById('horarioDM').value = '';
    document.getElementById('horarioAM').value = '';
    document.getElementById('fechaM').value = '';
    document.getElementById('estatusM').value = 'Activo';
}

//Funcion para buscar medico en la tabla por nombre o cedula
function buscarMedico() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    let resultado = [];
    
    for (let i = 0; i < medicos.length; i++) {
        const nombre = medicos[i].nombre_completo.toLowerCase();
        const cedula = medicos[i].cedula.toLowerCase();
        
        if (nombre.includes(texto) || cedula.includes(texto)) {
            resultado.push(medicos[i]);
        }
    }
    
    mostrarMedicos(resultado);
}

//Inicializacion del modal y carga de medicos al cargar la pagina
document.addEventListener('DOMContentLoaded', function() {
    modalDoctores = new bootstrap.Modal(document.getElementById('modalDoctores'));
    cargarMedicos();
    
    document.getElementById('buscar').addEventListener('input', buscarMedico);
});

//Hacer funciones globales para poder llamarlas desde el HTML
window.editarMedico = editarMedico;
window.eliminarMedico = eliminarMedico;
window.limpiarFormulario = limpiarFormulario;