<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$port = "3307";
$dbname = "banco_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT rfc, nombre, correo, institucion, cuenta, monto FROM banco_db";
    $stmt = $pdo->query($sql);

    $data = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $data[] = [
            'rfc' => $row['rfc'],
            'nombre' => $row['nombre'],
            'correo' => $row['correo'],
            'institucion' => $row['institucion'],
            'cuenta' => $row['cuenta'],
            'monto' => $row['monto']
        ];
    }

    echo json_encode(['success' => true, 'data' => $data, 'total' => count($data)]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>