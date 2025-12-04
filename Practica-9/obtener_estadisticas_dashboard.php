<?php
header('Content-Type: application/json; charset=utf-8');
ob_start();

$host = "localhost";
$port = "3306";
$dbname = "clinica_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sqlTotalDinero = "SELECT COALESCE(SUM(monto), 0) as totalRecaudado 
                       FROM gestorPagos 
                       WHERE estatus = 1";
    $stmtDinero = $pdo->query($sqlTotalDinero);
    $totalRecaudado = $stmtDinero->fetch(PDO::FETCH_ASSOC)['totalRecaudado'];

    $sqlTotalPagos = "SELECT COUNT(*) as totalPagos 
                      FROM gestorPagos";
    $stmtPagos = $pdo->query($sqlTotalPagos);
    $totalPagos = $stmtPagos->fetch(PDO::FETCH_ASSOC)['totalPagos'];

    $sqlPagosPendientes = "SELECT COUNT(*) as pagosPendientes 
                           FROM gestorPagos 
                           WHERE estatus = 0";
    $stmtPendientes = $pdo->query($sqlPagosPendientes);
    $pagosPendientes = $stmtPendientes->fetch(PDO::FETCH_ASSOC)['pagosPendientes'];

    $sqlDineroMes = "SELECT COALESCE(SUM(monto), 0) as totalMes 
                     FROM gestorPagos 
                     WHERE estatus = 1 
                     AND MONTH(fechaPago) = MONTH(CURRENT_DATE())
                     AND YEAR(fechaPago) = YEAR(CURRENT_DATE())";
    $stmtDineroMes = $pdo->query($sqlDineroMes);
    $totalMes = $stmtDineroMes->fetch(PDO::FETCH_ASSOC)['totalMes'];

    $sqlRecaudacionMensual = "SELECT 
                                MONTH(fechaPago) as mes,
                                YEAR(fechaPago) as anio,
                                COALESCE(SUM(monto), 0) as total
                              FROM gestorPagos
                              WHERE estatus = 1
                              AND fechaPago >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
                              GROUP BY YEAR(fechaPago), MONTH(fechaPago)
                              ORDER BY YEAR(fechaPago), MONTH(fechaPago)";
    $stmtRecaudacion = $pdo->query($sqlRecaudacionMensual);
    $recaudacionMensual = $stmtRecaudacion->fetchAll(PDO::FETCH_ASSOC);

    $sqlPorMetodo = "SELECT 
                        metodoPago,
                        COUNT(*) as cantidad,
                        COALESCE(SUM(monto), 0) as total
                     FROM gestorPagos
                     WHERE estatus = 1
                     GROUP BY metodoPago";
    $stmtMetodo = $pdo->query($sqlPorMetodo);
    $pagosPorMetodo = $stmtMetodo->fetchAll(PDO::FETCH_ASSOC);

    $sqlTotalPacientes = "SELECT COUNT(*) as totalPacientes FROM controlPacientes WHERE estatus = 'Activo'";
    $stmtPacientes = $pdo->query($sqlTotalPacientes);
    $totalPacientes = $stmtPacientes->fetch(PDO::FETCH_ASSOC)['totalPacientes'];

    $sqlTotalCitas = "SELECT COUNT(*) as totalCitas FROM controlAgenda";
    $stmtCitas = $pdo->query($sqlTotalCitas);
    $totalCitas = $stmtCitas->fetch(PDO::FETCH_ASSOC)['totalCitas'];

    ob_end_clean();

    echo json_encode([
        'success' => true,
        'data' => [
            'totalRecaudado' => floatval($totalRecaudado),
            'totalPagos' => intval($totalPagos),
            'pagosPendientes' => intval($pagosPendientes),
            'totalMes' => floatval($totalMes),
            'recaudacionMensual' => $recaudacionMensual,
            'pagosPorMetodo' => $pagosPorMetodo,
            'totalPacientes' => intval($totalPacientes),
            'totalCitas' => intval($totalCitas)
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    ob_end_clean();
    
    echo json_encode([
        'success' => false, 
        'error' => 'Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>