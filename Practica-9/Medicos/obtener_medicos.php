<?php
header('Content-Type: application/json; charset=utf-8');

// configuracion de la base de datos
$host = "localhost";
$port = "3306";
$dbname = "clinica_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener todos los medicos
    $sql = "SELECT * FROM controlMedico ORDER BY idMedico DESC";
    $stmt = $pdo->query($sql);
    $medicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear los datos para la respuesta
    $data = [];
    foreach ($medicos as $medico) {
        $data[] = [
            'id' => $medico['idMedico'],
            'nombre_completo' => $medico['nombreCompleto'],
            'cedula' => $medico['cedulaProfesional'],
            'especialidad' => $medico['idEspecialidad'],
            'telefono' => $medico['telefono'],
            'correo' => $medico['correoElectronico'],
            'horario' => $medico['horarioAtencion'],
            'fecha_ingreso' => $medico['fechaIngreso'],
            'estatus' => $medico['estatus']
        ];
    }

    echo json_encode(['success' => true, 'data' => $data, 'total' => count($data)]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>

