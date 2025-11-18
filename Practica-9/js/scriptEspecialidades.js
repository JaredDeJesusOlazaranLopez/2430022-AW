let especialidades = [];
let modalEspecialidad;
let modalDetalleEspecialidad;

function cargarEspecialidades() {
    especialidades = [];
    fetch('obtener_especialidades.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                especialidades = result.data;
                mostrarEspecialidades(especialidades);
            } else {
                Swal.fire('Error', 'No se pudieron cargar las especialidades', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarEspecialidades(lista) {
    const contenedor = document.getElementById('contenedorEspecialidades');
    const especialidadesMostrar = lista || especialidades;

    if (especialidadesMostrar.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted mt-3">No hay especialidades registradas</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < especialidadesMostrar.length; i++) {
        const esp = especialidadesMostrar[i];
        const badge = esp.estado === 'Activa' ?
            '<span class="badge bg-success">Activa</span>' :
            '<span class="badge bg-secondary">Inactiva</span>';

        const descripcion = esp.descripcion ? esp.descripcion.substring(0, 80) + '...' : 'Sin descripción';

        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card especialidad-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${esp.nombre}</h5>
                        <div class="mb-2">${badge}</div>
                        <p class="card-text text-muted small">${descripcion}</p>
                    </div>
                    <div class="card-footer bg-light">
                        <button class="btn btn-sm btn-primary" onclick="verDetalles(${esp.id})">Ver</button>
                        <button class="btn btn-sm btn-warning" onclick="editarEspecialidad(${esp.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarEspecialidad(${esp.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

function verDetalles(id) {
    const esp = especialidades.find(e => e.id === id);
    if (esp) {
        document.getElementById('detalleNombre').textContent = esp.nombre;
        document.getElementById('detalleDescripcion').textContent = esp.descripcion || 'Sin descripción';
        document.getElementById('detalleEstadoBadge').textContent = esp.estado;
        document.getElementById('detalleEstadoBadge').className = esp.estado === 'Activa' ? 'badge bg-success' : 'badge bg-secondary';
        modalDetalleEspecialidad.show();
    }
}

function editarEspecialidad(id) {
    const esp = especialidades.find(e => e.id === id);
    
    if (esp) {
        document.getElementById('modalEspecialidadLabel').textContent = 'Editar Especialidad';
        document.getElementById('idEspecialidad').value = esp.id;
        document.getElementById('nombreEspecialidad').value = esp.nombre;
        document.getElementById('descripcionEspecialidad').value = esp.descripcion || '';
        
        modalEspecialidad.show();
    } else {
        Swal.fire('Error', 'Especialidad no encontrada', 'error');
    }
}

function eliminarEspecialidad(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar esta especialidad',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('eliminar_especialidades.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire('Eliminada', 'Especialidad eliminada correctamente', 'success');
                        cargarEspecialidades();
                    } else {
                        Swal.fire('Error', result.error || 'Error al eliminar', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error al eliminar especialidad', 'error');
                });
        }
    });
}

function guardarEspecialidad() {
    const id = document.getElementById('idEspecialidad').value;
    const nombre = document.getElementById('nombreEspecialidad').value.trim();
    const descripcion = document.getElementById('descripcionEspecialidad').value.trim();
    
    let estado = 'Activa';
    if (document.getElementById('estadoEspecialidad')) {
        estado = document.getElementById('estadoEspecialidad').value;
    }

    if (!nombre) {
        Swal.fire('Error', 'El nombre es requerido', 'error');
        return;
    }

    const data = { nombre, descripcion, estado };
    if (id) data.id = parseInt(id);

    const url = id ? 'actualizar_especialidades.php' : 'proceso_especialidades.php';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire('Éxito', result.message, 'success');
                modalEspecialidad.hide();
                limpiarFormulario();
                cargarEspecialidades();
            } else {
                Swal.fire('Error', result.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al guardar especialidad', 'error');
        });
}

function limpiarFormulario() {
    document.getElementById('idEspecialidad').value = '';
    document.getElementById('nombreEspecialidad').value = '';
    document.getElementById('descripcionEspecialidad').value = '';
    
    if (document.getElementById('estadoEspecialidad')) {
        document.getElementById('estadoEspecialidad').value = 'Activa';
    }
    
    document.getElementById('modalEspecialidadLabel').textContent = 'Nueva Especialidad';
}

function buscarEspecialidad() {
    const texto = document.getElementById('buscarEspecialidad').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value;

    let resultado = especialidades.filter(esp => {
        const cumpleTexto = esp.nombre.toLowerCase().includes(texto) ||
            (esp.descripcion && esp.descripcion.toLowerCase().includes(texto));
        const cumpleEstado = !estado || esp.estado === estado;
        return cumpleTexto && cumpleEstado;
    });

    mostrarEspecialidades(resultado);
}

document.addEventListener('DOMContentLoaded', function () {
    modalEspecialidad = new bootstrap.Modal(document.getElementById('modalEspecialidad'));
    modalDetalleEspecialidad = new bootstrap.Modal(document.getElementById('modalDetalleEspecialidad'));

    cargarEspecialidades();

    document.getElementById('agregarEspecialidad').addEventListener('click', () => {
        limpiarFormulario();
        modalEspecialidad.show();
    });

    document.getElementById('guardarEspecialidad').addEventListener('click', guardarEspecialidad);
    document.getElementById('buscarEspecialidad').addEventListener('input', buscarEspecialidad);
    document.getElementById('filtroEstado').addEventListener('change', buscarEspecialidad);
    document.getElementById('limpiarFiltros').addEventListener('click', () => {
        document.getElementById('buscarEspecialidad').value = '';
        document.getElementById('filtroEstado').value = '';
        mostrarEspecialidades();
    });
});

window.verDetalles = verDetalles;
window.editarEspecialidad = editarEspecialidad;
window.eliminarEspecialidad = eliminarEspecialidad;