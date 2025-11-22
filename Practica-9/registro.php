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

    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $correo = $data['correo'] ?? '';
    $contrasena = $data['contrasena'] ?? '';

    if (empty($nombre) || empty($correo) || empty($contrasena)) {
        echo json_encode(['success' => false, 'error' => 'Todos los campos son requeridos']);
        exit;
    }

    $sqlCheck = "SELECT idUsuario FROM usuarios WHERE nombreUsuario = :correo";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':correo' => $correo]);
    
    if ($stmtCheck->fetch()) {
        echo json_encode(['success' => false, 'error' => 'El correo ya está registrado']);
        exit;
    }

    $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombreUsuario, contrasena, rol, fechaRegistro, estatus) VALUES (:nombre, :contrasena, 'usuario', NOW(), 1)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre' => $correo,
        ':contrasena' => $contrasenaHash
    ]);

    echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>