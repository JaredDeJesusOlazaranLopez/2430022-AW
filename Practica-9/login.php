<?php
session_start();
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
    
    $correo = $data['correo'] ?? '';
    $contrasena = $data['contrasena'] ?? '';

    if (empty($correo) || empty($contrasena)) {
        echo json_encode(['success' => false, 'error' => 'Todos los campos son requeridos']);
        exit;
    }

    $sql = "SELECT * FROM usuarios WHERE nombreUsuario = :correo AND estatus = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':correo' => $correo]);
    
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($contrasena, $usuario['contrasena'])) {
        $_SESSION['usuario_id'] = $usuario['idUsuario'];
        $_SESSION['usuario_nombre'] = $usuario['nombreUsuario'];
        $_SESSION['usuario_rol'] = $usuario['rol'];
        
        echo json_encode([
            'success' => true, 
            'message' => 'Inicio de sesión exitoso',
            'usuario' => [
                'nombre' => $usuario['nombreUsuario'],
                'rol' => $usuario['rol']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Correo o contraseña incorrectos']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>