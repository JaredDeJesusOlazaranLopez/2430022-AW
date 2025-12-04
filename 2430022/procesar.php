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

    $data = json_decode(file_get_contents('php://input'), true);

    $rfc = $data['rfc'] ?? '';
    $nombre = $data['name'] ?? ''; 
    $email = $data['email'] ?? '';
    $bank = $data['bank'] ?? '';
    $account = $data['account'] ?? '';
    $amount = $data['amount'] ?? '';
    $sql = "INSERT INTO `banco_db`(`rfc`, `nombre`, `correo`, `institucion`, `cuenta`, `monto`) VALUES (:rfc, :nombre, :email, :bank, :account, :amount)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':rfc', $rfc);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':bank', $bank);
    $stmt->bindParam(':account', $account);
    $stmt->bindParam(':amount', $amount);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Especialidad guardada correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}