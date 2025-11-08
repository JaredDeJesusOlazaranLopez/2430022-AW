var especialidades = [];
var especialidadActual = null;
var modalEspecialidad;
var modalDetalleEspecialidad;

function cargarDatos() {
    var datos = localStorage.getItem('especialidades');
    if (datos) {
        especialidades = JSON.parse(datos);
    }
}

function guardarDatos() {
    localStorage.setItem('especialidades', JSON.stringify(especialidades));
}

function contarMedicos(idEspecialidad) {
    var medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    var contador = 0;
    for (var i = 0; i < medicos.length; i++) {
        if (medicos[i].especialidad == idEspecialidad) {
            contador++;
        }
    }
    return contador;
}

function mostrarEspecialidades(lista) {
    var contenedor = document.getElementById('contenedorEspecialidades');
    var especialidadesMostrar = lista || especialidades;

    if (especialidadesMostrar.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted mt-3">No hay especialidades registradas</p></div>';
        return;
    }

    var html = '';
    for (var i = 0; i < especialidadesMostrar.length; i++) {
        var esp = especialidadesMostrar[i];
        var numMedicos = contarMedicos(esp.id);
        var badge = '';
        if (esp.estado === 'Activa') {
            badge = '<span class="badge bg-success">Activa</span>';
        } else {
            badge = '<span class="badge bg-secondary">Inactiva</span>';
        }
        
        var descripcionMostrar = '';
        if (esp.descripcion) {
            var descripcionCorta = esp.descripcion.substring(0, 80);
            if (esp.descripcion.length > 80) {
                descripcionMostrar = descripcionCorta + '...';
            } else {
                descripcionMostrar = descripcionCorta;
            }
        }
        
        var textoMedicos = '';
        if (numMedicos !== 1) {
            textoMedicos = 's';
        }

        html += '<div class="col-md-6 col-lg-4 mb-3">';
        html += '<div class="card especialidad-card h-100 shadow-sm" data-id="' + esp.id + '">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + esp.nombre + '</h5>';
        html += badge;
        if (descripcionMostrar) {
            html += '<p class="text-muted small mt-2 mb-2">' + descripcionMostrar + '</p>';
        }
        html += '<hr>';
        html += '<div class="text-center small text-muted">';
        html += '<i class="fa-solid fa-user-doctor text-primary"></i> ' + numMedicos + ' medico' + textoMedicos;
        html += '</div>';
        html += '</div></div></div>';
    }
    contenedor.innerHTML = html;

    var tarjetas = contenedor.getElementsByClassName('especialidad-card');
    for (var j = 0; j < tarjetas.length; j++) {
        tarjetas[j].onclick = function() {
            var id = this.getAttribute('data-id');
            verDetalle(id);
        };
    }
}

function verDetalle(id) {
    var especialidad = null;
    for (var i = 0; i < especialidades.length; i++) {
        if (especialidades[i].id === id) {
            especialidad = especialidades[i];
            break;
        }
    }
    
    if (!especialidad) return;

    especialidadActual = especialidad;
    var numMedicos = contarMedicos(especialidad.id);

    document.getElementById('detalleNombre').textContent = especialidad.nombre;
    
    var badge = document.getElementById('detalleEstadoBadge');
    badge.textContent = especialidad.estado;
    if (especialidad.estado === 'Activa') {
        badge.className = 'badge bg-success';
    } else {
        badge.className = 'badge bg-secondary';
    }
    
    var descripcionTexto = especialidad.descripcion || 'Sin descripcion';
    document.getElementById('detalleDescripcion').textContent = descripcionTexto;
    
    var elementoDuracion = document.getElementById('detalleDuracion');
    if (elementoDuracion) {
        var duracionTexto = 'No especificado';
        if (especialidad.duracionConsulta) {
            duracionTexto = especialidad.duracionConsulta + ' minutos';
        }
        elementoDuracion.textContent = duracionTexto;
    }
    
    var elementoCosto = document.getElementById('detalleCosto');
    if (elementoCosto) {
        var costoTexto = 'No especificado';
        if (especialidad.costoConsulta) {
            costoTexto = '$' + parseFloat(especialidad.costoConsulta).toFixed(2);
        }
        elementoCosto.textContent = costoTexto;
    }
    
    var fecha = new Date(especialidad.fechaCreacion);
    document.getElementById('detalleFechaCreacion').textContent = fecha.toLocaleDateString('es-MX');
    
    var textoMedicos = ' medico';
    if (numMedicos !== 1) {
        textoMedicos = ' medicos';
    }
    document.getElementById('detalleMedicosAsignados').textContent = numMedicos + textoMedicos;

    modalDetalleEspecialidad.show();
}

function limpiarFormulario() {
    document.getElementById('idEspecialidad').value = '';
    document.getElementById('nombreEspecialidad').value = '';
    document.getElementById('estadoEspecialidad').value = 'Activa';
    document.getElementById('descripcionEspecialidad').value = '';
    document.getElementById('duracionConsulta').value = '';
    document.getElementById('costoConsulta').value = '';
    document.getElementById('modalEspecialidadLabel').textContent = 'Nueva Especialidad';
}

function buscar() {
    var texto = document.getElementById('buscarEspecialidad').value.toLowerCase();
    var estado = document.getElementById('filtroEstado').value;

    var resultado = [];
    for (var i = 0; i < especialidades.length; i++) {
        var esp = especialidades[i];
        var nombreCoincide = esp.nombre.toLowerCase().indexOf(texto) !== -1;
        var descripcionCoincide = false;
        if (esp.descripcion) {
            descripcionCoincide = esp.descripcion.toLowerCase().indexOf(texto) !== -1;
        }
        var coincideTexto = nombreCoincide || descripcionCoincide;
        var coincideEstado = !estado || esp.estado === estado;
        
        if (coincideTexto && coincideEstado) {
            resultado.push(esp);
        }
    }

    mostrarEspecialidades(resultado);
}

document.addEventListener('DOMContentLoaded', function() {
    modalEspecialidad = new bootstrap.Modal(document.getElementById('modalEspecialidad'));
    modalDetalleEspecialidad = new bootstrap.Modal(document.getElementById('modalDetalleEspecialidad'));

    cargarDatos();
    mostrarEspecialidades();

    document.getElementById('agregarEspecialidad').addEventListener('click', function() {
        limpiarFormulario();
        modalEspecialidad.show();
    });

    document.getElementById('guardarEspecialidad').addEventListener('click', function() {
        var id = document.getElementById('idEspecialidad').value;
        var nombre = document.getElementById('nombreEspecialidad').value.trim();
        var estado = document.getElementById('estadoEspecialidad').value;
        var descripcion = document.getElementById('descripcionEspecialidad').value.trim();
        var duracion = document.getElementById('duracionConsulta').value;
        var costo = document.getElementById('costoConsulta').value;

        if (!nombre) {
            alert('Por favor ingrese el nombre de la especialidad');
            return;
        }

        var nombreDuplicado = false;
        for (var i = 0; i < especialidades.length; i++) {
            if (especialidades[i].nombre.toLowerCase() === nombre.toLowerCase() && especialidades[i].id !== id) {
                nombreDuplicado = true;
                break;
            }
        }
        
        if (nombreDuplicado) {
            alert('Ya existe una especialidad con ese nombre');
            return;
        }

        var fechaCreacion = new Date().toISOString();
        if (id) {
            for (var j = 0; j < especialidades.length; j++) {
                if (especialidades[j].id === id) {
                    fechaCreacion = especialidades[j].fechaCreacion;
                    break;
                }
            }
        }

        var especialidad = {
            id: id || Date.now().toString(),
            nombre: nombre,
            estado: estado,
            descripcion: descripcion,
            duracionConsulta: duracion || null,
            costoConsulta: costo || null,
            fechaCreacion: fechaCreacion
        };

        if (id) {
            for (var k = 0; k < especialidades.length; k++) {
                if (especialidades[k].id === id) {
                    especialidades[k] = especialidad;
                    break;
                }
            }
        } else {
            especialidades.push(especialidad);
        }

        guardarDatos();
        mostrarEspecialidades();
        modalEspecialidad.hide();
        limpiarFormulario();
        alert('Especialidad guardada exitosamente');
    });

    document.getElementById('editarEspecialidad').addEventListener('click', function() {
        if (!especialidadActual) return;

        document.getElementById('idEspecialidad').value = especialidadActual.id;
        document.getElementById('nombreEspecialidad').value = especialidadActual.nombre;
        document.getElementById('estadoEspecialidad').value = especialidadActual.estado;
        document.getElementById('descripcionEspecialidad').value = especialidadActual.descripcion || '';
        document.getElementById('duracionConsulta').value = especialidadActual.duracionConsulta || '';
        document.getElementById('costoConsulta').value = especialidadActual.costoConsulta || '';
        document.getElementById('modalEspecialidadLabel').textContent = 'Editar Especialidad';

        modalDetalleEspecialidad.hide();
        modalEspecialidad.show();
    });

    document.getElementById('eliminarEspecialidad').addEventListener('click', function() {
        if (!especialidadActual) return;

        var numMedicos = contarMedicos(especialidadActual.id);
        if (numMedicos > 0) {
            alert('No se puede eliminar. Tiene ' + numMedicos + ' medicos asignados');
            return;
        }

        if (confirm('Eliminar ' + especialidadActual.nombre + '?')) {
            var nuevaLista = [];
            for (var i = 0; i < especialidades.length; i++) {
                if (especialidades[i].id !== especialidadActual.id) {
                    nuevaLista.push(especialidades[i]);
                }
            }
            especialidades = nuevaLista;
            
            guardarDatos();
            mostrarEspecialidades();
            modalDetalleEspecialidad.hide();
            especialidadActual = null;
            alert('Especialidad eliminada');
        }
    });

    document.getElementById('buscarEspecialidad').addEventListener('input', buscar);
    document.getElementById('filtroEstado').addEventListener('change', buscar);

    document.getElementById('limpiarFiltros').addEventListener('click', function() {
        document.getElementById('buscarEspecialidad').value = '';
        document.getElementById('filtroEstado').value = '';
        mostrarEspecialidades();
    });
});