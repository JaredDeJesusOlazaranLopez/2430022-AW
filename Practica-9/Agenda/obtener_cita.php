<?php
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

    // Consulta adaptada a la estructura real de tu BD
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
            LEFT JOIN especialidades e ON cm.idEspecialidad = e.idEspecialidad
            ORDER BY ca.fechaCita DESC";
    
    $stmt = $pdo->query($sql);
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
        'total' => count($citasFormateadas)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>