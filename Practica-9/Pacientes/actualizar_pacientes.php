<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$port = "3307";
$dbname = "clinica_db";
$user = "root";
$pass = ""; 

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (!isset($_GET['id'])) {
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
            exit;
        }

        $id = $_GET['id'];
        $sql = "SELECT id_paciente, nombre, apellido_paterno, apellido_materno, curp, 
                fecha_nacimiento, sexo, telefono, correo, direccion, contacto_emergencia, 
                telefono_emergencia, alergias, antecedentes_medicos, estatus 
                FROM controlPacientes 
                WHERE id_paciente = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $paciente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($paciente) {
            $paciente['id'] = $paciente['id_paciente'];
            unset($paciente['id_paciente']);
            echo json_encode(['success' => true, 'data' => $paciente]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Paciente no encontrado']);
        }
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
            exit;
        }

        $id = $data['id'];

        $sql = "UPDATE controlPacientes 
                SET nombre = :nombre, 
                    apellido_paterno = :apellido_paterno, 
                    apellido_materno = :apellido_materno, 
                    curp = :curp, 
                    fecha_nacimiento = :fecha_nacimiento, 
                    sexo = :sexo, 
                    telefono = :telefono, 
                    correo = :correo, 
                    direccion = :direccion, 
                    contacto_emergencia = :contacto_emergencia, 
                    telefono_emergencia = :telefono_emergencia, 
                    alergias = :alergias, 
                    antecedentes_medicos = :antecedentes_medicos, 
                    estatus = :estatus 
                WHERE id_paciente = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $data['nombre'] ?? '');
        $stmt->bindParam(':apellido_paterno', $data['apellido_paterno'] ?? '');
        $stmt->bindParam(':apellido_materno', $data['apellido_materno'] ?? '');
        $stmt->bindParam(':curp', $data['curp'] ?? '');
        $stmt->bindParam(':fecha_nacimiento', $data['fecha_nacimiento'] ?? '');
        $stmt->bindParam(':sexo', $data['sexo'] ?? '');
        $stmt->bindParam(':telefono', $data['telefono'] ?? '');
        $stmt->bindParam(':correo', $data['correo'] ?? '');
        $stmt->bindParam(':direccion', $data['direccion'] ?? '');
        $stmt->bindParam(':contacto_emergencia', $data['contacto_emergencia'] ?? '');
        $stmt->bindParam(':telefono_emergencia', $data['telefono_emergencia'] ?? '');
        $stmt->bindParam(':alergias', $data['alergias'] ?? '');
        $stmt->bindParam(':antecedentes_medicos', $data['antecedentes_medicos'] ?? '');
        $stmt->bindParam(':estatus', $data['estatus'] ?? '');
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Paciente actualizado correctamente']);
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