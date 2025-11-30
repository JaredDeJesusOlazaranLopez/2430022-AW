<?php
header('Content-Type: application/json; charset=utf-8');
ob_start();

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
        ob_end_clean();
        echo json_encode(['success' => false, 'error' => 'ID de médico no proporcionado'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $idMedico = filter_var($_GET['idMedico'], FILTER_VALIDATE_INT);
    
    if (!$idMedico) {
        ob_end_clean();
        echo json_encode(['success' => false, 'error' => 'ID de médico inválido'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sql = "SELECT tarifaConsulta FROM controlMedico WHERE idMedico = :idMedico";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idMedico' => $idMedico]);
    
    $medico = $stmt->fetch(PDO::FETCH_ASSOC);

    ob_end_clean();

    if ($medico) {
        echo json_encode([
            'success' => true, 
            'tarifa' => $medico['tarifaConsulta'] ?? 0
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['success' => false, 'error' => 'Médico no encontrado'], JSON_UNESCAPED_UNICODE);
    }
    
} catch (PDOException $e) {
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
