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

    $sql = "INSERT INTO controlPacientes 
            (nombre, apellido_paterno, apellido_materno, curp, fecha_nacimiento, 
             sexo, telefono, correo, direccion, contacto_emergencia, telefono_emergencia, 
             alergias, antecedentes_medicos, estatus, fecha_registro) 
            VALUES 
            (:nombre, :apellido_paterno, :apellido_materno, :curp, :fecha_nacimiento,
             :sexo, :telefono, :correo, :direccion, :contacto_emergencia, :telefono_emergencia,
             :alergias, :antecedentes_medicos, :estatus, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nombre', $data['nombre']);
    $stmt->bindParam(':apellido_paterno', $data['apellido_paterno']);
    $stmt->bindParam(':apellido_materno', $data['apellido_materno']);
    $stmt->bindParam(':curp', $data['curp']);
    $stmt->bindParam(':fecha_nacimiento', $data['fecha_nacimiento']);
    $stmt->bindParam(':sexo', $data['sexo']);
    $stmt->bindParam(':telefono', $data['telefono']);
    $stmt->bindParam(':correo', $data['correo']);
    $stmt->bindParam(':direccion', $data['direccion']);
    $stmt->bindParam(':contacto_emergencia', $data['contacto_emergencia']);
    $stmt->bindParam(':telefono_emergencia', $data['telefono_emergencia']);
    $stmt->bindParam(':alergias', $data['alergias']);
    $stmt->bindParam(':antecedentes_medicos', $data['antecedentes_medicos']);
    $stmt->bindParam(':estatus', $data['estatus']);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Paciente guardado correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>

