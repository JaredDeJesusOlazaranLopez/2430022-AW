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

    $sql = "SELECT idUsuario, nombreUsuario, rol, fechaRegistro, estatus 
            FROM usuarios 
            ORDER BY fechaRegistro DESC";
    
    $stmt = $pdo->query($sql);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true, 
        'data' => $usuarios
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>