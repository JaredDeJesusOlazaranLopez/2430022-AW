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

    $data = json_decode(file_get_contents('php://input'), true);

    $nombreCompleto = $data['nombre'] . ' ' . $data['apellido_paterno'] . ' ' . $data['apellido_materno'];
    $horarioAtencion = $data['horario_desde'] . ' - ' . $data['horario_hasta'];
    $estatus = ($data['estatus'] === 'Activo') ? 1 : 0;

    $sql = "UPDATE controlMedico SET 
            nombreCompleto = :nombreCompleto,
            cedulaProfesional = :cedulaProfesional,
            idEspecialidad = :idEspecialidad,
            telefono = :telefono,
            correoElectronico = :correoElectronico,
            horarioAtencion = :horarioAtencion,
            fechaIngreso = :fechaIngreso,
            estatus = :estatus
            WHERE idMedico = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
    $stmt->bindParam(':nombreCompleto', $nombreCompleto);
    $stmt->bindParam(':cedulaProfesional', $data['cedula']);
    $stmt->bindParam(':idEspecialidad', $data['especialidad']);
    $stmt->bindParam(':telefono', $data['telefono']);
    $stmt->bindParam(':correoElectronico', $data['correo']);
    $stmt->bindParam(':horarioAtencion', $horarioAtencion);
    $stmt->bindParam(':fechaIngreso', $data['fecha_ingreso']);
    $stmt->bindParam(':estatus', $estatus, PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Médico actualizado correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>
