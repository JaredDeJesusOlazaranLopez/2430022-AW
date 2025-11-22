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

    // Consulta para obtener todos los médicos activos con su especialidad
    $sql = "SELECT 
                cm.idMedico,
                cm.nombreCompleto,
                cm.cedulaProfesional,
                cm.idEspecialidad,
                cm.telefono,
                cm.correoElectronico,
                cm.horarioAtencion,
                cm.estatus,
                COALESCE(e.nombreEspecialidad, 'Sin especialidad') as nombreEspecialidad
            FROM controlMedico cm
            LEFT JOIN especialidades e ON cm.idEspecialidad = e.idEspecialidad
            WHERE cm.estatus = 1
            ORDER BY cm.nombreCompleto ASC";
    
    $stmt = $pdo->query($sql);
    $medicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear los médicos con los nombres de campo correctos
    $medicosFormateados = [];
    foreach ($medicos as $medico) {
        $medicosFormateados[] = [
            'idMedico' => (int)$medico['idMedico'],
            'nombreCompleto' => $medico['nombreCompleto'] ?? 'Sin nombre',
            'cedulaProfesional' => $medico['cedulaProfesional'] ?? '',
            'idEspecialidad' => $medico['idEspecialidad'],
            'nombreEspecialidad' => $medico['nombreEspecialidad'],
            'telefono' => $medico['telefono'] ?? '',
            'correoElectronico' => $medico['correoElectronico'] ?? '',
            'horarioAtencion' => $medico['horarioAtencion'] ?? '',
            'estatus' => $medico['estatus']
        ];
    }

    echo json_encode([
        'success' => true, 
        'data' => $medicosFormateados,
        'total' => count($medicosFormateados)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error de base de datos: ' . $e->getMessage()
    ]);
}
?>