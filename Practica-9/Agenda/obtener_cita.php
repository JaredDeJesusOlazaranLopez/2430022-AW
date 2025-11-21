
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

    // Consulta para obtener todas las citas con información relacionada
    $sql = "SELECT 
                ca.idCita,
                ca.idPaciente,
                ca.idMedico,
                ca.idEspecialidad,
                ca.fechaCita,
                ca.horaCita,
                ca.motivoConsulta,
                ca.estadoCita,
                ca.observaciones,
                ca.fechaRegistro,
                CONCAT(cp.nombre, ' ', cp.apellido_paterno, ' ', cp.apellido_materno) as nombrePaciente,
                CONCAT(cm.nombreCompleto) as nombreMedico,
                e.nombreEspecialidad as nombreEspecialidad
            FROM controlAgenda ca
            LEFT JOIN controlPacientes cp ON ca.idPaciente = cp.id_paciente
            LEFT JOIN controlMedico cm ON ca.idMedico = cm.idMedico
            LEFT JOIN especialidades e ON ca.idEspecialidad = e.idEspecialidad
            ORDER BY ca.fechaCita DESC, ca.horaCita DESC";
    
    $stmt = $pdo->query($sql);
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear las citas para el calendario
    $citasFormateadas = [];
    foreach ($citas as $cita) {
        $citasFormateadas[] = [
            'id' => $cita['idCita'],
            'idPaciente' => $cita['idPaciente'],
            'idMedico' => $cita['idMedico'],
            'idEspecialidad' => $cita['idEspecialidad'],
            'fecha' => $cita['fechaCita'],
            'hora' => substr($cita['horaCita'], 0, 5), // Formato HH:MM
            'motivo' => $cita['motivoConsulta'],
            'estado' => $cita['estadoCita'],
            'observaciones' => $cita['observaciones'],
            'nombrePaciente' => $cita['nombrePaciente'],
            'nombreMedico' => $cita['nombreMedico'],
            'nombreEspecialidad' => $cita['nombreEspecialidad'],
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