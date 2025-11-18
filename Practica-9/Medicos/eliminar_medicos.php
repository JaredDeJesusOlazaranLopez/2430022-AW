<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$port = "3307";
$dbname = "clinica_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
        exit;
    }

    $sql = "DELETE FROM controlMedico WHERE idMedico = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Médico eliminado correctamente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Médico no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>
