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
    
    $nombreUsuario = $data['nombreUsuario'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    $rol = $data['rol'] ?? '';
    $estatus = $data['estatus'] ?? 1;

    if (empty($nombreUsuario) || empty($contrasena) || empty($rol)) {
        echo json_encode(['success' => false, 'error' => 'Todos los campos son requeridos']);
        exit;
    }

    $sqlCheck = "SELECT idUsuario FROM usuarios WHERE nombreUsuario = :nombreUsuario";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':nombreUsuario' => $nombreUsuario]);
    
    if ($stmtCheck->fetch()) {
        echo json_encode(['success' => false, 'error' => 'El usuario ya existe']);
        exit;
    }

    $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);
    $sql = "INSERT INTO usuarios (nombreUsuario, contrasena, rol, fechaRegistro, estatus) 
            VALUES (:nombreUsuario, :contrasena, :rol, NOW(), :estatus)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombreUsuario' => $nombreUsuario,
        ':contrasena' => $contrasenaHash,
        ':rol' => $rol,
        ':estatus' => $estatus
    ]);

    echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>