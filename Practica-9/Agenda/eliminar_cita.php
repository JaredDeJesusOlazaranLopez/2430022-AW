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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'success' => false, 
            'error' => 'Método no permitido'
        ]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['id'])) {
        echo json_encode([
            'success' => false, 
            'error' => 'ID no proporcionado'
        ]);
        exit;
    }

    $id = $data['id'];
    $sql = "DELETE FROM controlAgenda WHERE idCita = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true, 
            'message' => 'Cita eliminada correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'error' => 'Cita no encontrada'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>