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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        ob_end_clean();
        echo json_encode(['success' => false, 'error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        ob_end_clean();
        echo json_encode(['success' => false, 'error' => 'ID no proporcionado'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = filter_var($data['id'], FILTER_VALIDATE_INT);
    
    if (!$id) {
        ob_end_clean();
        echo json_encode(['success' => false, 'error' => 'ID inválido'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sql = "DELETE FROM gestorPagos WHERE idPago = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    ob_end_clean();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Pago eliminado correctamente'], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['success' => false, 'error' => 'Pago no encontrado'], JSON_UNESCAPED_UNICODE);
    }
    
} catch (PDOException $e) {
    ob_end_clean();
    
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>