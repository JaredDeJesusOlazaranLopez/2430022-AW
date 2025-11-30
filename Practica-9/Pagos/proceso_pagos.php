<?php
header('Content-Type: application/json; charset=utf-8');

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
    
    if (!$data) {
        echo json_encode(['success' => false, 'error' => 'Datos JSON inválidos']);
        exit;
    }
    
    $idPaciente = filter_var($data['idPaciente'] ?? null, FILTER_VALIDATE_INT);
    $idMedico = filter_var($data['idMedico'] ?? null, FILTER_VALIDATE_INT);
    $idCita = filter_var($data['idCita'] ?? null, FILTER_VALIDATE_INT);
    $idTarifa = isset($data['idTarifa']) && $data['idTarifa'] !== '' ? filter_var($data['idTarifa'], FILTER_VALIDATE_INT) : null;
    $tipoServicio = $data['tipoServicio'] ?? '';
    $descripcionServicio = $data['descripcionServicio'] ?? '';
    $monto = $data['monto'] ?? 0;
    $metodoPago = $data['metodoPago'] ?? '';
    $estatus = filter_var($data['estatus'] ?? 1, FILTER_VALIDATE_INT);

    if (!$idPaciente || !$idCita || !$tipoServicio || $monto <= 0 || empty($metodoPago)) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos o inválidos']);
        exit;
    }

    // Insertar pago
    $sql = "INSERT INTO gestorPagos 
            (idPaciente, idMedico, idCita, idTarifa, tipoServicio, descripcionServicio, monto, metodoPago, fechaPago, estatus) 
            VALUES 
            (:idPaciente, :idMedico, :idCita, :idTarifa, :tipoServicio, :descripcionServicio, :monto, :metodoPago, NOW(), :estatus)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPaciente' => $idPaciente,
        ':idMedico' => $idMedico,
        ':idCita' => $idCita,
        ':idTarifa' => $idTarifa,
        ':tipoServicio' => $tipoServicio,
        ':descripcionServicio' => $descripcionServicio,
        ':monto' => $monto,
        ':metodoPago' => $metodoPago,
        ':estatus' => $estatus
    ]);

    $idPago = $pdo->lastInsertId();

    echo json_encode([
        'success' => true, 
        'message' => 'Pago registrado correctamente',
        'idPago' => $idPago
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>