let usuarios = [];
let modal;

document.addEventListener('DOMContentLoaded', function() {
    modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    cargarUsuarios();
    
    document.getElementById('buscar').addEventListener('input', buscarUsuario);
    
    document.getElementById('agregarUsuario').addEventListener('click', function() {
        limpiarFormulario();
        document.getElementById('tituloModal').textContent = 'Agregar Usuario';
        document.getElementById('divContrasena').style.display = 'block';
        document.getElementById('contrasena').required = true;
    });
});

function cargarUsuarios() {
    fetch('obtener_usuarios.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                usuarios = data.data;
                mostrarUsuarios();
            } else {
                Swal.fire('Error', data.error || 'No se pudieron cargar los usuarios', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarUsuarios(lista) {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';
    
    const usuariosMostrar = lista || usuarios;
    
    if (usuariosMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay usuarios registrados</td></tr>';
        return;
    }
    
    usuariosMostrar.forEach(usuario => {
        const badgeEstatus = usuario.estatus == 1 ? 
            '<span class="badge bg-success">Activo</span>' : 
            '<span class="badge bg-danger">Inactivo</span>';
        
        const badgeRol = getBadgeRol(usuario.rol);
        
        const fila = `
            <tr>
                <td>${usuario.idUsuario}</td>
                <td>${usuario.nombreUsuario}</td>
                <td>${badgeRol}</td>
                <td>${formatearFecha(usuario.fechaRegistro)}</td>
                <td>${badgeEstatus}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.idUsuario})">
                        <i class="fa-solid fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.idUsuario})">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function getBadgeRol(rol) {
    const badges = {
        'administrador': '<span class="badge bg-danger">Administrador</span>',
        'doctor': '<span class="badge bg-primary">Doctor</span>',
        'secretaria': '<span class="badge bg-info text-dark">Secretaria</span>',
        'usuario': '<span class="badge bg-secondary">Usuario</span>'
    };
    return badges[rol] || '<span class="badge bg-secondary">' + rol + '</span>';
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX');
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.idUsuario === id);
    
    if (!usuario) {
        Swal.fire('Error', 'Usuario no encontrado', 'error');
        return;
    }
    
    document.getElementById('tituloModal').textContent = 'Editar Usuario';
    document.getElementById('idUsuario').value = usuario.idUsuario;
    document.getElementById('nombreUsuario').value = usuario.nombreUsuario;
    document.getElementById('rol').value = usuario.rol;
    document.getElementById('estatus').value = usuario.estatus;
    document.getElementById('divContrasena').style.display = 'none';
    document.getElementById('contrasena').required = false;
    document.getElementById('contrasena').value = '';
    
    modal.show();
}

function guardarUsuario() {
    const id = document.getElementById('idUsuario').value;
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const rol = document.getElementById('rol').value;
    const estatus = document.getElementById('estatus').value;
    
    if (!nombreUsuario || !rol) {
        Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    if (!id && contrasena.length < 6) {
        Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    const datos = {
        nombreUsuario: nombreUsuario,
        rol: rol,
        estatus: estatus
    };
    
    if (!id || contrasena) {
        datos.contrasena = contrasena;
    }
    
    if (id) {
        datos.id = parseInt(id);
    }
    
    const url = id ? 'actualizar_usuario.php' : 'proceso_usuario.php';
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success');
            modal.hide();
            cargarUsuarios();
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al guardar usuario', 'error');
    });
}

function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este usuario',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('eliminar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado', data.message, 'success');
                    cargarUsuarios();
                } else {
                    Swal.fire('Error', data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error al eliminar usuario', 'error');
            });
        }
    });
}

function buscarUsuario() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    
    const resultado = usuarios.filter(usuario => 
        usuario.nombreUsuario.toLowerCase().includes(texto) ||
        usuario.rol.toLowerCase().includes(texto)
    );
    
    mostrarUsuarios(resultado);
}

function limpiarFormulario() {
    document.getElementById('idUsuario').value = '';
    document.getElementById('nombreUsuario').value = '';
    document.getElementById('contrasena').value = '';
    document.getElementById('rol').value = '';
    document.getElementById('estatus').value = '1';
}

window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.guardarUsuario = guardarUsuario;