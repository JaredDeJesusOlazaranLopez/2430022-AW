<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header('Location: index.html');
    exit;
}
function tienePermiso($permisoRequerido) {
    $rol = $_SESSION['usuario_rol'] ?? '';
    
    $permisos = [
        'administrador' => ['pacientes', 'medicos', 'especialidades', 'agenda', 'pagos', 'tarifas', 'reportes', 'bitacoras'],
        'doctor' => ['pacientes', 'agenda', 'reportes'],
        'secretaria' => ['pacientes', 'agenda', 'medicos', 'especialidades', 'reportes'],
        'usuario' => ['agenda']
    ];
    
    if (!isset($permisos[$rol])) {
        return false;
    }
    
    return in_array($permisoRequerido, $permisos[$rol]);
}
$nombreUsuario = $_SESSION['usuario_nombre'] ?? 'Usuario';
$rolUsuario = $_SESSION['usuario_rol'] ?? 'usuario';
?>