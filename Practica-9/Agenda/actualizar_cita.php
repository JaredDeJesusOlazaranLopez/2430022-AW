<?php
header('Content-Type: application/json; charset=utf-8');

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

    // Manejo de solicitudes GET y POST
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (!isset($_GET['id'])) {
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
            exit;
        }

        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        
        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'ID inválido']);
            exit;
        }

        // Consulta para obtener los datos de la cita
        $sql = "SELECT idCita, idPaciente, idMedico, 
                fechaCita, motivoConsulta, estadoCita, observaciones 
                FROM controlAgenda 
                WHERE idCita = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        $cita = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cita) {
            // Separar fecha y hora si fechaCita es datetime
            $fechaCita = $cita['fechaCita'];
            $fecha = date('Y-m-d', strtotime($fechaCita));
            $hora = date('H:i', strtotime($fechaCita));
            
            // Formatear la respuesta
            $citaFormateada = [
                'id' => (int)$cita['idCita'],
                'idPaciente' => (int)$cita['idPaciente'],
                'idMedico' => (int)$cita['idMedico'],
                'idEspecialidad' => null,
                'fecha' => $fecha,
                'hora' => $hora,
                'motivo' => $cita['motivoConsulta'] ?? '',
                'estado' => $cita['estadoCita'] ?? 'Programada',
                'observaciones' => $cita['observaciones'] ?? ''
            ];
            echo json_encode(['success' => true, 'data' => $citaFormateada]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Cita no encontrada']);
        }
        exit;
    }

    // Manejo de solicitud POST para actualizar
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar que el JSON se haya parseado correctamente
        if (!$data) {
            echo json_encode(['success' => false, 'error' => 'Datos JSON inválidos']);
            exit;
        }
        
        if (!isset($data['id'])) {
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
            exit;
        }

        // Validar y limpiar campos
        $idCita = filter_var($data['id'], FILTER_VALIDATE_INT);
        $idPaciente = filter_var($data['idPaciente'] ?? null, FILTER_VALIDATE_INT);
        $idMedico = filter_var($data['idMedico'] ?? null, FILTER_VALIDATE_INT);
        $fecha = $data['fecha'] ?? null;
        $hora = $data['hora'] ?? null;

        if (!$idCita || $idCita === false) {
            echo json_encode(['success' => false, 'error' => 'ID de cita inválido']);
            exit;
        }

        if (!$idPaciente || $idPaciente === false) {
            echo json_encode(['success' => false, 'error' => 'ID de paciente inválido']);
            exit;
        }

        if (!$idMedico || $idMedico === false) {
            echo json_encode(['success' => false, 'error' => 'ID de médico inválido']);
            exit;
        }

        if (empty($fecha) || empty($hora)) {
            echo json_encode(['success' => false, 'error' => 'Fecha y hora son requeridos']);
            exit;
        }

        // Combinar fecha y hora en datetime
        $fechaHora = $fecha . ' ' . $hora . ':00';

        // Actualización de la cita
        $sql = "UPDATE controlAgenda SET 
                idPaciente = :idPaciente,
                idMedico = :idMedico,
                fechaCita = :fechaCita,
                motivoConsulta = :motivoConsulta,
                estadoCita = :estadoCita,
                observaciones = :observaciones
                WHERE idCita = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $idCita,
            ':idPaciente' => $idPaciente,
            ':idMedico' => $idMedico,
            ':fechaCita' => $fechaHora,
            ':motivoConsulta' => $data['motivo'] ?? '',
            ':estadoCita' => $data['estado'] ?? 'Programada',
            ':observaciones' => $data['observaciones'] ?? ''
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Cita actualizada correctamente']);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se realizaron cambios o la cita no existe']);
        }
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Método no permitido']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>