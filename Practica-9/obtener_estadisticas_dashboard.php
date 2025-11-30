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

    // Total de dinero recaudado (solo pagos completados)
    $sqlTotalDinero = "SELECT COALESCE(SUM(monto), 0) as totalRecaudado 
                       FROM gestorPagos 
                       WHERE estatus = 1";
    $stmtDinero = $pdo->query($sqlTotalDinero);
    $totalRecaudado = $stmtDinero->fetch(PDO::FETCH_ASSOC)['totalRecaudado'];

    // Total de pagos recibidos
    $sqlTotalPagos = "SELECT COUNT(*) as totalPagos 
                      FROM gestorPagos";
    $stmtPagos = $pdo->query($sqlTotalPagos);
    $totalPagos = $stmtPagos->fetch(PDO::FETCH_ASSOC)['totalPagos'];

    // Pagos pendientes
    $sqlPagosPendientes = "SELECT COUNT(*) as pagosPendientes 
                           FROM gestorPagos 
                           WHERE estatus = 0";
    $stmtPendientes = $pdo->query($sqlPagosPendientes);
    $pagosPendientes = $stmtPendientes->fetch(PDO::FETCH_ASSOC)['pagosPendientes'];

    // Dinero recaudado este mes
    $sqlDineroMes = "SELECT COALESCE(SUM(monto), 0) as totalMes 
                     FROM gestorPagos 
                     WHERE estatus = 1 
                     AND MONTH(fechaPago) = MONTH(CURRENT_DATE())
                     AND YEAR(fechaPago) = YEAR(CURRENT_DATE())";
    $stmtDineroMes = $pdo->query($sqlDineroMes);
    $totalMes = $stmtDineroMes->fetch(PDO::FETCH_ASSOC)['totalMes'];

    // Recaudación por mes (últimos 12 meses)
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

    // Pagos por método de pago
    $sqlPorMetodo = "SELECT 
                        metodoPago,
                        COUNT(*) as cantidad,
                        COALESCE(SUM(monto), 0) as total
                     FROM gestorPagos
                     WHERE estatus = 1
                     GROUP BY metodoPago";
    $stmtMetodo = $pdo->query($sqlPorMetodo);
    $pagosPorMetodo = $stmtMetodo->fetchAll(PDO::FETCH_ASSOC);

    // Total de pacientes
    $sqlTotalPacientes = "SELECT COUNT(*) as totalPacientes FROM controlPacientes WHERE estatus = 'Activo'";
    $stmtPacientes = $pdo->query($sqlTotalPacientes);
    $totalPacientes = $stmtPacientes->fetch(PDO::FETCH_ASSOC)['totalPacientes'];

    // Total de citas
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