<?php
$host = "localhost";
$port = "3306";
$dbname = "clinica_db";
$user = "root";
$pass = "";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $pass);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO controlPacientes 
        (nombre, apellido_paterno, apellido_materno, curp, fecha_nacimiento, 
         sexo, telefono, correo, direccion, contacto_emergencia, telefono_emergencia, 
         alergias, antecedentes_medicos, estatus, fecha_registro)
        VALUES 
        (:nombre, :apellido_paterno, :apellido_materno, :curp, :fecha_nacimiento,
         :sexo, :telefono, :correo, :direccion, :contacto_emergencia, :telefono_emergencia,
         :alergias, :antecedentes, :estatus, NOW())";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':nombre', $_POST['nombre']);
    $stmt->bindParam(':apellido_paterno', $_POST['apellido_paterno']);
    $stmt->bindParam(':apellido_materno', $_POST['apellido_materno']);
    $stmt->bindParam(':curp', $_POST['curp']);
    $stmt->bindParam(':fecha_nacimiento', $_POST['fecha_nacimiento']);
    $stmt->bindParam(':sexo', $_POST['sexo']);
    $stmt->bindParam(':telefono', $_POST['telefono']);
    $stmt->bindParam(':correo', $_POST['correo']);
    $stmt->bindParam(':direccion', $_POST['direccion']);
    $stmt->bindParam(':contacto_emergencia', $_POST['contacto_emergencia']);
    $stmt->bindParam(':telefono_emergencia', $_POST['telefono_emergencia']);
    $stmt->bindParam(':alergias', $_POST['alergias']);
    $stmt->bindParam(':antecedentes', $_POST['antecedentes']);
    $stmt->bindParam(':estatus', $_POST['estatus']);

    $stmt->execute();

    echo "<h3 style='color:green;'>Paciente guardado correctamente.</h3>";

} catch (PDOException $e) {
    echo "<h3 style='color:red;'>Error al guardar: " . $e->getMessage() . "</h3>";
}
?>