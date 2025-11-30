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
                gp.idPago,
                gp.idPaciente,
                gp.idMedico,
                gp.idCita,
                gp.idTarifa,
                gp.tipoServicio,
                gp.descripcionServicio,
                gp.monto,
                gp.metodoPago,
                gp.fechaPago,
                gp.estatus,
                CONCAT_WS(' ', cp.nombre, cp.apellido_paterno, cp.apellido_materno) as nombrePaciente,
                cm.nombreCompleto as nombreMedico
            FROM gestorPagos gp
            INNER JOIN controlPacientes cp ON gp.idPaciente = cp.id_paciente
            LEFT JOIN controlMedico cm ON gp.idMedico = cm.idMedico
            ORDER BY gp.fechaPago DESC";
    
    $stmt = $pdo->query($sql);
    $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true, 
        'data' => $pagos,
        'total' => count($pagos)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>