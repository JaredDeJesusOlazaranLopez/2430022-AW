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

    $sql = "SELECT idEspecialidad, nombreEspecialidad, descripcion FROM especialidades ORDER BY idEspecialidad DESC";
    $stmt = $pdo->query($sql);
    $especialidades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($especialidades as $esp) {
        $data[] = [
            'id' => $esp['idEspecialidad'],
            'nombre' => $esp['nombreEspecialidad'],
            'descripcion' => $esp['descripcion'],
            'estado' => 'Activa'
        ];
    }

    echo json_encode(['success' => true, 'data' => $data, 'total' => count($data)]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>
