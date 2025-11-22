<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Configuración de la base de datos
$host = "localhost";
$port = "3306";
$dbname = "clinica_db";
$user = "root";
$pass = ""; 

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta adaptada a tu estructura real
    $sql = "SELECT 
                id_paciente as idPaciente,
                CONCAT_WS(' ', nombre, apellido_paterno, apellido_materno) as nombreCompleto,
                nombre,
                apellido_paterno,
                apellido_materno,
                curp,
                fecha_nacimiento as fechaNacimiento,
                sexo,
                telefono,
                correo as correoElectronico,
                direccion,
                contacto_emergencia as contactoEmergencia,
                telefono_emergencia as telefonoEmergencia,
                alergias,
                antecedentes_medicos as antecedentesMedicos,
                fecha_registro as fechaRegistro,
                estatus
            FROM controlPacientes
            WHERE estatus = 'activo' OR estatus = '1' OR estatus IS NULL
            ORDER BY nombre ASC, apellido_paterno ASC";
    
    $stmt = $pdo->query($sql);
    $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si no hay pacientes, enviar array vacío
    if (empty($pacientes)) {
        echo json_encode([
            'success' => true, 
            'data' => [],
            'total' => 0,
            'message' => 'No hay pacientes registrados'
        ]);
        exit;
    }

    // Formatear los pacientes
    $pacientesFormateados = [];
    foreach ($pacientes as $paciente) {
        $pacientesFormateados[] = [
            'idPaciente' => (int)$paciente['idPaciente'],
            'nombreCompleto' => trim($paciente['nombreCompleto']) ?: 'Sin nombre',
            'nombre' => $paciente['nombre'],
            'apellido_paterno' => $paciente['apellido_paterno'],
            'apellido_materno' => $paciente['apellido_materno'],
            'curp' => $paciente['curp'],
            'fechaNacimiento' => $paciente['fechaNacimiento'],
            'sexo' => $paciente['sexo'],
            'telefono' => $paciente['telefono'],
            'correoElectronico' => $paciente['correoElectronico'],
            'direccion' => $paciente['direccion'],
            'estatus' => $paciente['estatus']
        ];
    }

    echo json_encode([
        'success' => true, 
        'data' => $pacientesFormateados,
        'total' => count($pacientesFormateados)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error general: ' . $e->getMessage()
    ]);
}
?>

