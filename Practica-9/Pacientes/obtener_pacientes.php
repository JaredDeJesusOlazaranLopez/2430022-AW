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

    // Consulta SELECT con los nombres REALES de columnas
    $sql = "SELECT id_paciente, nombre, apellido_paterno, apellido_materno, curp, fecha_nacimiento, 
            sexo, telefono, correo, direccion, contacto_emergencia, telefono_emergencia, 
            alergias, antecedentes_medicos, fecha_registro, estatus 
            FROM controlPacientes 
            ORDER BY id_paciente DESC LIMIT 100";
    
    $stmt = $pdo->query($sql);
    $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Normalizar nombres para el frontend (renombrar id_paciente a id)
    $pacientes_normalizados = [];
    foreach ($pacientes as $paciente) {
        $paciente['id'] = $paciente['id_paciente'];
        unset($paciente['id_paciente']);
        $pacientes_normalizados[] = $paciente;
    }

    echo json_encode([
        'success' => true, 
        'data' => $pacientes_normalizados,
        'total' => count($pacientes_normalizados)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>


