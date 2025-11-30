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

    if (!isset($_GET['idMedico'])) {
        echo json_encode(['success' => false, 'error' => 'ID de médico no proporcionado']);
        exit;
    }

    $idMedico = filter_var($_GET['idMedico'], FILTER_VALIDATE_INT);
    
    if (!$idMedico) {
        echo json_encode(['success' => false, 'error' => 'ID de médico inválido']);
        exit;
    }

    $sql = "SELECT tarifaConsulta FROM controlMedico WHERE idMedico = :idMedico";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idMedico' => $idMedico]);
    
    $medico = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($medico) {
        echo json_encode([
            'success' => true, 
            'tarifa' => $medico['tarifaConsulta'] ?? 0
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Médico no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>