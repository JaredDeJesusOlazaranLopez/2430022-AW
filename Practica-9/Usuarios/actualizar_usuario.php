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
    
    $id = $data['id'] ?? null;
    $nombreUsuario = $data['nombreUsuario'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    $rol = $data['rol'] ?? '';
    $estatus = $data['estatus'] ?? 1;

    if (!$id || empty($nombreUsuario) || empty($rol)) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
        exit;
    }

    if (!empty($contrasena)) {
        $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);
        
        $sql = "UPDATE usuarios SET 
                nombreUsuario = :nombreUsuario,
                contrasena = :contrasena,
                rol = :rol,
                estatus = :estatus
                WHERE idUsuario = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':nombreUsuario' => $nombreUsuario,
            ':contrasena' => $contrasenaHash,
            ':rol' => $rol,
            ':estatus' => $estatus
        ]);
    } else {
        $sql = "UPDATE usuarios SET 
                nombreUsuario = :nombreUsuario,
                rol = :rol,
                estatus = :estatus
                WHERE idUsuario = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':nombreUsuario' => $nombreUsuario,
            ':rol' => $rol,
            ':estatus' => $estatus
        ]);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se realizaron cambios']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>