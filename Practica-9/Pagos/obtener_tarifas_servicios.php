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

    $sql = "SELECT 
                idTarifa,
                nombreServicio,
                descripcion,
                costo,
                fechaRegistro,
                estatus
            FROM gestorTarifas
            WHERE estatus = 1
            ORDER BY nombreServicio ASC";
    
    $stmt = $pdo->query($sql);
    $tarifas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    ob_end_clean();

    echo json_encode(['success' => true, 'data' => $tarifas], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    ob_end_clean();
    
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>