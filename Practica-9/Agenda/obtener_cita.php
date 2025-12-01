<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$host = "localhost";
$port = "3306";
$dbname = "clinica_db";
$user = "root";
$pass = ""; 

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener rol e ID del usuario de la sesión
    $rolUsuario = $_SESSION['rol'] ?? '';
    $idUsuarioSesion = $_SESSION['idUsuario'] ?? null;

    // Base de la consulta
    $sql = "SELECT 
                ca.idCita,
                ca.idPaciente,
                ca.idMedico,
                ca.fechaCita,
                ca.motivoConsulta,
                ca.estadoCita,
                ca.observaciones,
                ca.fechaRegistro,
                CONCAT_WS(' ', cp.nombre, cp.apellido_paterno, cp.apellido_materno) as nombrePaciente,
                cm.nombreCompleto as nombreMedico,
                e.nombreEspecialidad as nombreEspecialidad
            FROM controlAgenda ca
            LEFT JOIN controlPacientes cp ON ca.idPaciente = cp.id_paciente
            LEFT JOIN controlMedico cm ON ca.idMedico = cm.idMedico
            LEFT JOIN especialidades e ON cm.idEspecialidad = e.idEspecialidad";
    
    // Filtrar según el rol del usuario
    if ($rolUsuario === 'usuario') {
        // Los usuarios/pacientes solo ven sus propias citas
        // Obtener el id_paciente asociado al usuario
        $sqlPaciente = "SELECT id_paciente FROM controlPacientes WHERE idUsuario = :idUsuario";
        $stmtPaciente = $pdo->prepare($sqlPaciente);
        $stmtPaciente->execute([':idUsuario' => $idUsuarioSesion]);
        $paciente = $stmtPaciente->fetch(PDO::FETCH_ASSOC);
        
        if ($paciente) {
            $sql .= " WHERE ca.idPaciente = :idPaciente";
        } else {
            // Si no se encuentra el paciente, devolver array vacío
            echo json_encode([
                'success' => true, 
                'data' => [],
                'total' => 0,
                'mensaje' => 'No se encontró información del paciente asociado a este usuario'
            ]);
            exit;
        }
    } elseif ($rolUsuario === 'doctor') {
        // Los doctores solo ven las citas asignadas a ellos
        // Obtener el idMedico asociado al usuario
        $sqlMedico = "SELECT idMedico FROM controlMedico WHERE idUsuario = :idUsuario";
        $stmtMedico = $pdo->prepare($sqlMedico);
        $stmtMedico->execute([':idUsuario' => $idUsuarioSesion]);
        $medico = $stmtMedico->fetch(PDO::FETCH_ASSOC);
        
        if ($medico) {
            $sql .= " WHERE ca.idMedico = :idMedico";
        } else {
            echo json_encode([
                'success' => true, 
                'data' => [],
                'total' => 0,
                'mensaje' => 'No se encontró información del médico asociado a este usuario'
            ]);
            exit;
        }
    }
    // Si es administrador o secretaria, no se filtra (ve todas las citas)
    
    $sql .= " ORDER BY ca.fechaCita DESC";
    
    $stmt = $pdo->prepare($sql);
    
    // Ejecutar con parámetros según el rol
    if ($rolUsuario === 'usuario' && isset($paciente)) {
        $stmt->execute([':idPaciente' => $paciente['id_paciente']]);
    } elseif ($rolUsuario === 'doctor' && isset($medico)) {
        $stmt->execute([':idMedico' => $medico['idMedico']]);
    } else {
        $stmt->execute();
    }
    
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear las citas para el calendario
    $citasFormateadas = [];
    foreach ($citas as $cita) {
        // Separar fecha y hora si fechaCita es datetime
        $fechaCita = $cita['fechaCita'];
        $fecha = date('Y-m-d', strtotime($fechaCita));
        $hora = date('H:i', strtotime($fechaCita));
        
        $citasFormateadas[] = [
            'id' => (int)$cita['idCita'],
            'idPaciente' => (int)$cita['idPaciente'],
            'idMedico' => (int)$cita['idMedico'],
            'idEspecialidad' => null,
            'fecha' => $fecha,
            'hora' => $hora,
            'motivo' => $cita['motivoConsulta'] ?? '',
            'estado' => $cita['estadoCita'] ?? 'Programada',
            'observaciones' => $cita['observaciones'] ?? '',
            'nombrePaciente' => trim($cita['nombrePaciente']) ?: 'Sin asignar',
            'nombreMedico' => $cita['nombreMedico'] ?? 'Sin asignar',
            'nombreEspecialidad' => $cita['nombreEspecialidad'] ?? 'N/A',
            'fechaCreacion' => $cita['fechaRegistro']
        ];
    }

    echo json_encode([
        'success' => true, 
        'data' => $citasFormateadas,
        'total' => count($citasFormateadas),
        'rol' => $rolUsuario // Para debug
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>