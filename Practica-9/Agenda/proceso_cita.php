<?php
header('Content-Type: application/json; charset=utf-8');

// MODO DEBUG - Comentar estas líneas después de probar
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

    // Obtener datos del request
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    // DEBUG: Log de datos recibidos (eliminar después)
    file_put_contents('debug_cita.log', date('Y-m-d H:i:s') . " - Raw data: " . $rawData . "\n", FILE_APPEND);
    file_put_contents('debug_cita.log', date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . "\n", FILE_APPEND);

    // Validar que el JSON se haya parseado correctamente
    if (!$data) {
        echo json_encode([
            'success' => false, 
            'error' => 'Datos JSON inválidos',
            'raw' => $rawData
        ]);
        exit;
    }

    // Validar y limpiar campos requeridos
    $idPaciente = filter_var($data['idPaciente'] ?? null, FILTER_VALIDATE_INT);
    $idMedico = filter_var($data['idMedico'] ?? null, FILTER_VALIDATE_INT);
    $fecha = $data['fecha'] ?? null;
    $hora = $data['hora'] ?? null;

    // DEBUG: Log de validación
    file_put_contents('debug_cita.log', date('Y-m-d H:i:s') . " - idPaciente: " . var_export($idPaciente, true) . "\n", FILE_APPEND);
    file_put_contents('debug_cita.log', date('Y-m-d H:i:s') . " - idMedico: " . var_export($idMedico, true) . "\n", FILE_APPEND);

    if (!$idPaciente || $idPaciente === false) {
        echo json_encode([
            'success' => false, 
            'error' => 'ID de paciente inválido',
            'recibido' => $data['idPaciente'] ?? 'no enviado',
            'tipo' => gettype($data['idPaciente'] ?? null)
        ]);
        exit;
    }

    if (!$idMedico || $idMedico === false) {
        echo json_encode([
            'success' => false, 
            'error' => 'ID de médico inválido',
            'recibido' => $data['idMedico'] ?? 'no enviado',
            'tipo' => gettype($data['idMedico'] ?? null)
        ]);
        exit;
    }

    if (empty($fecha) || empty($hora)) {
        echo json_encode([
            'success' => false, 
            'error' => 'Fecha y hora son requeridos',
            'fecha_recibida' => $fecha,
            'hora_recibida' => $hora
        ]);
        exit;
    }

    // Combinar fecha y hora en datetime
    $fechaHora = $fecha . ' ' . $hora . ':00';

    // Inserción de nueva cita
    $sql = "INSERT INTO controlAgenda 
            (idPaciente, idMedico, fechaCita, 
             motivoConsulta, estadoCita, observaciones, fechaRegistro) 
            VALUES 
            (:idPaciente, :idMedico, :fechaCita,
             :motivoConsulta, :estadoCita, :observaciones, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPaciente' => $idPaciente,
        ':idMedico' => $idMedico,
        ':fechaCita' => $fechaHora,
        ':motivoConsulta' => $data['motivo'] ?? '',
        ':estadoCita' => $data['estado'] ?? 'Programada',
        ':observaciones' => $data['observaciones'] ?? ''
    ]);

    $idCita = $pdo->lastInsertId();

    echo json_encode([
        'success' => true, 
        'message' => 'Cita guardada correctamente',
        'idCita' => $idCita
    ]);
} catch (PDOException $e) {
    // Log del error
    file_put_contents('debug_cita.log', date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n", FILE_APPEND);
    
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>