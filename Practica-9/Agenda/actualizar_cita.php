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

        $id = $_GET['id'];

        // Consulta para obtener los datos de la cita
        $sql = "SELECT idCita, idPaciente, idMedico, idEspecialidad, 
                fechaCita, horaCita, motivoConsulta, estadoCita, observaciones 
                FROM controlAgenda 
                WHERE idCita = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        $cita = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cita) {
            // Formatear la respuesta
            $citaFormateada = [
                'id' => $cita['idCita'],
                'idPaciente' => $cita['idPaciente'],
                'idMedico' => $cita['idMedico'],
                'idEspecialidad' => $cita['idEspecialidad'],
                'fecha' => $cita['fechaCita'],
                'hora' => substr($cita['horaCita'], 0, 5),
                'motivo' => $cita['motivoConsulta'],
                'estado' => $cita['estadoCita'],
                'observaciones' => $cita['observaciones']
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
        
        if (!isset($data['id'])) {
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
            exit;
        }

        // Actualización de la cita
        $sql = "UPDATE controlAgenda SET 
                idPaciente = :idPaciente,
                idMedico = :idMedico,
                idEspecialidad = :idEspecialidad,
                fechaCita = :fechaCita,
                horaCita = :horaCita,
                motivoConsulta = :motivoConsulta,
                estadoCita = :estadoCita,
                observaciones = :observaciones
                WHERE idCita = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $data['id'],
            ':idPaciente' => $data['idPaciente'],
            ':idMedico' => $data['idMedico'],
            ':idEspecialidad' => $data['idEspecialidad'] ?? null,
            ':fechaCita' => $data['fecha'],
            ':horaCita' => $data['hora'],
            ':motivoConsulta' => $data['motivo'] ?? '',
            ':estadoCita' => $data['estado'] ?? 'Programada',
            ':observaciones' => $data['observaciones'] ?? ''
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Cita actualizada correctamente']);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se realizaron cambios']);
        }
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Método no permitido']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
}
?>