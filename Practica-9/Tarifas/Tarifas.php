<?php 
require_once '../verificar_sesion.php'; 
$paginaActual = 'tarifas';
$nivelCarpeta = '../';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarifas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="styles/stylesD.css">
</head>

<body class="overflow-x-hidden">
    <div class="container-fluid">
        <div class="row">
             <?php require_once '../sidebar.php'; ?>
            
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <div class="container-fluid">
                    <h1 class="mb-4">Tarifas de Consultas</h1>

                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Especialidad</th>
                                            <th class="text-end">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody id="listaTarifas">
                                        <tr>
                                            <td colspan="2" class="text-center text-muted py-4">
                                                No hay tarifas registradas
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/scriptTarifas.js"></script>
</body>

</html>