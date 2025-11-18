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
    $nombre = $data['nombre'] ?? '';
    $descripcion = $data['descripcion'] ?? '';

    if (!$id || !$nombre) {
        echo json_encode(['success' => false, 'error' => 'ID y nombre son requeridos']);
        exit;
    }

    $sql = "UPDATE especialidades SET 
            nombreEspecialidad = :nombre,
            descripcion = :descripcion
            WHERE idEspecialidad = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Especialidad actualizada correctamente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se encontró la especialidad']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>
