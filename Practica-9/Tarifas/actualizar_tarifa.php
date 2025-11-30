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
    
    $idMedico = $data['idMedico'] ?? null;
    $tarifaConsulta = $data['tarifaConsulta'] ?? 0;

    if (!$idMedico || $tarifaConsulta < 0) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
        exit;
    }

    $sql = "UPDATE controlMedico SET 
            tarifaConsulta = :tarifaConsulta
            WHERE idMedico = :idMedico";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idMedico' => $idMedico,
        ':tarifaConsulta' => $tarifaConsulta
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Tarifa actualizada correctamente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se realizaron cambios']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>