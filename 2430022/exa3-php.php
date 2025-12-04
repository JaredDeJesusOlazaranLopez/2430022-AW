<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examen 3</title>
</head>
<body>
    <h1>Banco</h1>
    <h2>Información de la Cuenta</h2>
    <table>
        <tr>
            <th>RFC</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Institución Bancaria</th>
            <th>Número de Cuenta</th>
            <th>Cantidad a Depositar</th>
        </tr>
        <?php
        $host = "localhost";
        $port = "3307";
        $dbname = "banco_db";
        $user = "root";
        $pass = "";

        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
            $pdo = new PDO($dsn, $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "SELECT rfc, nombre, correo, institucion, cuenta, monto FROM banco_db";
            $stmt = $pdo->query($sql);

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['rfc']) . "</td>";
                echo "<td>" . htmlspecialchars($row['nombre']) . "</td>";
                echo "<td>" . htmlspecialchars($row['correo']) . "</td>";
                echo "<td>" . htmlspecialchars($row['institucion']) . "</td>";
                echo "<td>" . htmlspecialchars($row['cuenta']) . "</td>";
                echo "<td>" . htmlspecialchars($row['monto']) . "</td>";
                echo "</tr>";
            }
        } catch (PDOException $e) {
            echo "<tr><td colspan='6'>Error: " . htmlspecialchars($e->getMessage()) . "</td></tr>";
        }
        ?>
        </table>
    <h2>Formulario de Depósito</h2>
    <form action="procesar.php" method="post">
        <label for="rfc">RFC:</label>
        <input type="text" id="rfc" name="rfc" minlength="13" maxlength="13" required><br><br>

        <label for="name">Nombre:</label></label>
        <input type="text" id="name" name="name" required><br><br>

        <label for="email">Dirección de Correo Electrónico:</label>
        <input type="email" id="text" name="text" required><br><br>

        <label for="bank">CLABE interbancaria:</label>
        <input type="text" id="bank" name="bank" minlength="17" maxlength="17" required><br><br>

        <label for="account">Institucion:</label>
        <select id="account" name="account" required>
            <option value="">Seleccione una cuenta</option>
            <option value="cuenta1">BBVA</option>
            <option value="cuenta2">Banamex</option>
            <option value="cuenta3">Santander</option>
            <option value="cuenta4">HSBC</option>
            <option value="cuenta5">Scotiabank</option>
        </select><br><br>

        <label for="amount">Cantidad a depositar:</label>
        <input type="number" id="amount" name="amount" required><br><br>
        <input type="submit" value="Enviar">
    </form>
</body>
</html>