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

    $data = json_decode(file_get_contents('php://input'), true);

    // Validar campos requeridos
    if (!isset($data['idPaciente']) || !isset($data['idMedico']) || 
        !isset($data['fecha']) || !isset($data['hora'])) {
        echo json_encode([
            'success' => false, 
            'error' => 'Faltan campos requeridos'
        ]);
        exit;
    }

    // Inserción de nueva cita
    $sql = "INSERT INTO controlAgenda 
            (idPaciente, idMedico, idEspecialidad, fechaCita, horaCita, 
             motivoConsulta, estadoCita, observaciones, fechaRegistro) 
            VALUES 
            (:idPaciente, :idMedico, :idEspecialidad, :fechaCita, :horaCita,
             :motivoConsulta, :estadoCita, :observaciones, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPaciente' => $data['idPaciente'],
        ':idMedico' => $data['idMedico'],
        ':idEspecialidad' => $data['idEspecialidad'] ?? null,
        ':fechaCita' => $data['fecha'],
        ':horaCita' => $data['hora'],
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
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>