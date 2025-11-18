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

    $nombre = $data['nombre'] ?? '';
    $descripcion = $data['descripcion'] ?? '';

    if (!$nombre) {
        echo json_encode(['success' => false, 'error' => 'El nombre de la especialidad es requerido']);
        exit;
    }

    $sql = "INSERT INTO especialidades (nombreEspecialidad, descripcion) 
            VALUES (:nombre, :descripcion)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Especialidad guardada correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>
