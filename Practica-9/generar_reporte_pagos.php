<?php
require_once 'verificar_sesion.php';

// Verificar permisos
if (!tienePermiso('reportes')) {
    die('No tienes permisos para generar reportes');
}

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

    // Obtener parámetros de filtro
    $fechaInicio = $_GET['fecha_inicio'] ?? date('Y-m-01');
    $fechaFin = $_GET['fecha_fin'] ?? date('Y-m-d');
    $metodoPago = $_GET['metodo_pago'] ?? '';
    $estatus = $_GET['estatus'] ?? '';

    // Construir consulta SQL con filtros
    $sql = "SELECT 
                gp.idPago,
                gp.monto,
                gp.metodoPago,
                gp.fechaPago,
                gp.estatus,
                CONCAT_WS(' ', cp.nombre, cp.apellido_paterno, cp.apellido_materno) as nombrePaciente,
                gt.nombreServicio,
                gt.descripcion as descripcionServicio
            FROM gestorPagos gp
            LEFT JOIN controlPacientes cp ON gp.idPaciente = cp.id_paciente
            LEFT JOIN gestorTarifas gt ON gp.idTarifa = gt.idTarifa
            WHERE gp.fechaPago BETWEEN :fecha_inicio AND :fecha_fin";
    
    if (!empty($metodoPago)) {
        $sql .= " AND gp.metodoPago = :metodo_pago";
    }
    
    if ($estatus !== '') {
        $sql .= " AND gp.estatus = :estatus";
    }
    
    $sql .= " ORDER BY gp.fechaPago DESC";
    
    $stmt = $pdo->prepare($sql);
    $params = [
        ':fecha_inicio' => $fechaInicio,
        ':fecha_fin' => $fechaFin
    ];
    
    if (!empty($metodoPago)) {
        $params[':metodo_pago'] = $metodoPago;
    }
    
    if ($estatus !== '') {
        $params[':estatus'] = $estatus;
    }
    
    $stmt->execute($params);
    $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calcular totales
    $totalGeneral = 0;
    $totalCompletados = 0;
    $totalPendientes = 0;
    $cantidadPagos = count($pagos);
    
    foreach ($pagos as $pago) {
        $monto = floatval($pago['monto']);
        $totalGeneral += $monto;
        
        if ($pago['estatus'] == 1) {
            $totalCompletados += $monto;
        } else {
            $totalPendientes += $monto;
        }
    }

} catch (PDOException $e) {
    die('Error de base de datos: ' . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pagos - <?php echo date('d/m/Y'); ?></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
        }
        
        .header {
            border-bottom: 3px solid #8a0674;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #8a0674;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header p {
            color: #666;
            font-size: 14px;
        }
        
        .info-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .info-box p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .resumen {
            display: flex;
            gap: 15px;
            margin: 20px 0;
        }
        
        .resumen-card {
            flex: 1;
            background: #8a0674;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }
        
        .resumen-card h3 {
            font-size: 14px;
            margin-bottom: 8px;
            opacity: 0.9;
        }
        
        .resumen-card .valor {
            font-size: 24px;
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        table thead {
            background: #8a0674;
            color: white;
        }
        
        table th {
            padding: 12px 8px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
        }
        
        table td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
        }
        
        table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        table tbody tr:hover {
            background: #f0f0f0;
        }
        
        .status-completado {
            color: #28a745;
            font-weight: bold;
        }
        
        .status-pendiente {
            color: #ffc107;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .btn-print {
            background: #8a0674;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px 0;
        }
        
        .btn-print:hover {
            background: #690404;
        }
        
        @media print {
            .btn-print, .no-print {
                display: none !important;
            }
            
            body {
                padding: 0;
            }
            
            .header {
                page-break-after: avoid;
            }
            
            table {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="btn-print" onclick="window.print()">
            🖨️ Imprimir / Guardar como PDF
        </button>
        <button class="btn-print" onclick="window.close()" style="background: #666;">
            ✖️ Cerrar
        </button>
    </div>

    <div class="header">
        <h1>🏥 CLÍNICA - REPORTE DE PAGOS</h1>
        <p>Sistema de Gestión Médica</p>
    </div>

    <div class="info-box">
        <p><strong>Período:</strong> <?php echo date('d/m/Y', strtotime($fechaInicio)); ?> al <?php echo date('d/m/Y', strtotime($fechaFin)); ?></p>
        <p><strong>Fecha de Generación:</strong> <?php echo date('d/m/Y H:i:s'); ?></p>
        <p><strong>Generado por:</strong> <?php echo htmlspecialchars($nombreUsuario); ?></p>
        <?php if (!empty($metodoPago)): ?>
        <p><strong>Método de Pago:</strong> <?php echo htmlspecialchars($metodoPago); ?></p>
        <?php endif; ?>
        <?php if ($estatus !== ''): ?>
        <p><strong>Estatus:</strong> <?php echo $estatus == 1 ? 'Completados' : 'Pendientes'; ?></p>
        <?php endif; ?>
    </div>

    <div class="resumen">
        <div class="resumen-card">
            <h3>Total de Pagos</h3>
            <div class="valor"><?php echo $cantidadPagos; ?></div>
        </div>
        <div class="resumen-card">
            <h3>Total General</h3>
            <div class="valor">$<?php echo number_format($totalGeneral, 2); ?></div>
        </div>
        <div class="resumen-card">
            <h3>Completados</h3>
            <div class="valor">$<?php echo number_format($totalCompletados, 2); ?></div>
        </div>
        <div class="resumen-card">
            <h3>Pendientes</h3>
            <div class="valor">$<?php echo number_format($totalPendientes, 2); ?></div>
        </div>
    </div>

    <h2 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Detalle de Pagos</h2>

    <?php if (empty($pagos)): ?>
        <p style="text-align: center; padding: 40px; color: #666;">
            No se encontraron pagos en el período seleccionado.
        </p>
    <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Servicio</th>
                    <th>Método</th>
                    <th style="text-align: right;">Monto</th>
                    <th>Estatus</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($pagos as $pago): ?>
                <tr>
                    <td><?php echo $pago['idPago']; ?></td>
                    <td><?php echo date('d/m/Y', strtotime($pago['fechaPago'])); ?></td>
                    <td><?php echo htmlspecialchars($pago['nombrePaciente'] ?: 'N/A'); ?></td>
                    <td><?php echo htmlspecialchars($pago['nombreServicio'] ?: 'N/A'); ?></td>
                    <td><?php echo htmlspecialchars($pago['metodoPago']); ?></td>
                    <td style="text-align: right; font-weight: bold;">
                        $<?php echo number_format($pago['monto'], 2); ?>
                    </td>
                    <td>
                        <span class="<?php echo $pago['estatus'] == 1 ? 'status-completado' : 'status-pendiente'; ?>">
                            <?php echo $pago['estatus'] == 1 ? 'Pagado' : 'Pendiente'; ?>
                        </span>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>

    <div class="footer">
        <p>Este es un documento generado automáticamente por el Sistema de Gestión de Clínica</p>
        <p>Generado el <?php echo date('d/m/Y H:i:s'); ?></p>
    </div>

    <script>
        window.onload = function() { window.print(); }
    </script>
</body>
</html>