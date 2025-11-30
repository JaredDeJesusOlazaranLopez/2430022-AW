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

    $sql = "SELECT 
                cm.idMedico,
                cm.nombreCompleto,
                cm.cedulaProfesional,
                cm.horarioAtencion,
                cm.tarifaConsulta,
                cm.estatus,
                COALESCE(e.nombreEspecialidad, 'Sin especialidad') as nombreEspecialidad
            FROM controlMedico cm
            LEFT JOIN especialidades e ON cm.idEspecialidad = e.idEspecialidad
            WHERE cm.estatus = 1
            ORDER BY cm.nombreCompleto ASC";
    
    $stmt = $pdo->query($sql);
    $medicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $medicos]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>