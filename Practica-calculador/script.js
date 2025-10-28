//variables globales para el formulario y el espacio para poner las materias
const cMaterias = document.getElementById("materias");
const materiasDiv = document.getElementById("materiasImp");

//evento de submit cuando precionas cuantas materias hay, en el boton enviar
cMaterias.addEventListener("submit", e => {
    e.preventDefault();
    //agarra el valor de cuantas materias hay
    const cantidad = document.getElementById("cMaterias").value;
    //limpia el div de materias para que no se dupliquen
    materiasDiv.innerHTML = '';
    //crea un contenedor para las materias
    const contenedorMaterias = document.createElement("div");
    //agrega clases de bootstrap para que se vea bonito :D
    contenedorMaterias.className = "card shadow-sm";
    contenedorMaterias.innerHTML = `
        <div class="card-header bg-success text-white">
            <h5 class="mb-0">Registro de Materias</h5>
        </div>
        <div class="card-body" id="listaMaterias"></div>
    `;
    //agrega el contenedor al div de materias
    materiasDiv.appendChild(contenedorMaterias);

    //agrega las materias segun la cantidad que se puso
    const listaMaterias = document.getElementById("listaMaterias");

    //en el for se crean las materias dinamicamente dependiendo de la cantidad puesta anteriormente
    for (let i = 0; i < cantidad; i++) {
        const nuevaMateria = document.createElement("div");
        nuevaMateria.className = "mb-4 p-3 border rounded bg-light";
        nuevaMateria.innerHTML = `
            <h6 class="text-primary mb-3"><i class="bi bi-book"></i> Materia ${i + 1}</h6>
            
            <div class="mb-3">
                <label for="nombreMateria${i}" class="form-label fw-bold">Nombre de la materia</label>
                <input type="text" class="form-control" placeholder="Materia" id="nombreMateria${i}">
            </div>
            
            <div class="row g-2 mb-3">
                <div class="col-md-3">
                    <label for="calificacion1${i}" class="form-label">Parcial 1</label>
                    <input type="number" class="form-control" placeholder="0-100" id="calificacion1${i}"min="0" max="100">
                </div>
                <div class="col-md-3">
                    <label for="calificacion2${i}" class="form-label">Parcial 2</label>
                    <input type="number" class="form-control" placeholder="0-100" id="calificacion2${i}" min="0" max="100">
                </div>
                <div class="col-md-3">
                    <label for="calificacion3${i}" class="form-label">Parcial 3</label>
                    <input type="number" class="form-control" placeholder="0-100" id="calificacion3${i}"min="0" max="100">
                </div>
                <div class="col-md-3">
                    <label for="calificacion4${i}" class="form-label">Parcial 4</label>
                    <input type="number" class="form-control" placeholder="0-100" id="calificacion4${i} "min="0" max="100">
                </div>
            </div>
            
            <div class="d-flex gap-2 align-items-end">
                <div class="flex-grow-1">
                    <label for="promedio${i}" class="form-label fw-bold">Promedio Final</label>
                    <input type="text" class="form-control form-control-lg" placeholder="---" id="promedio${i}" readonly>
                </div>
                <button type="button" class="btn btn-success btn-lg" onclick="calcular(${i})"><i class="bi bi-calculator"></i> Calcular </button>
            </div>
            
            <div id="resultado${i}" class="mt-3"></div>
        `;
        //agrega la nueva materia al contenedor de materias
        listaMaterias.appendChild(nuevaMateria);
    }
});

//funcion para calcular el promedio y mostrar el resultado
function calcular(i) {
    const nombreMateria = document.getElementById(`nombreMateria${i}`).value;
    const cal1 = parseFloat(document.getElementById(`calificacion1${i}`).value);
    const cal2 = parseFloat(document.getElementById(`calificacion2${i}`).value);
    const cal3 = parseFloat(document.getElementById(`calificacion3${i}`).value);
    const cal4 = parseFloat(document.getElementById(`calificacion4${i}`).value);
    const resultadoDiv = document.getElementById(`resultado${i}`);

    //validaciones
    if (nombreMateria.trim() === "") {
        resultadoDiv.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Atención!</strong> Por favor ingresa el nombre de la materia.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return;
    }

    if (isNaN(cal1) || isNaN(cal2) || isNaN(cal3) || isNaN(cal4)) {
        resultadoDiv.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Atención!</strong> Por favor ingresa todas las calificaciones.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return;
    }

    if (cal1 < 0 || cal1 > 100 || cal2 < 0 || cal2 > 100 || cal3 < 0 || cal3 > 100 || cal4 < 0 || cal4 > 100) {
        resultadoDiv.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Las calificaciones deben estar entre 0 y 100.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return;
    }

    //saca el promedio y la calificacion minima
    let promedio = (cal1 + cal2 + cal3 + cal4) / 4;
    const calificacionMinima = Math.min(cal1, cal2, cal3, cal4);

    if (calificacionMinima < 70) {
        promedio = 60;
        resultadoDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h6 class="alert-heading"><i class="bi bi-x-circle"></i> Reprobado</h6>
                <p class="mb-0">En la materia <strong>${nombreMateria}</strong> has reprobado una o más calificaciones.</p>
                <hr>
                <p class="mb-0"><strong>Promedio final:</strong> ${promedio.toFixed(2)}</p>
            </div>
        `;
    } else {
        resultadoDiv.innerHTML = `
            <div class="alert alert-success" role="alert">
                <h6 class="alert-heading"><i class="bi bi-check-circle"></i> Felicidades!</h6>
                <p class="mb-0">En la materia <strong>${nombreMateria}</strong> has aprobado todas tus calificaciones.</p>
                <hr>
                <p class="mb-0"><strong>Promedio final:</strong> ${promedio.toFixed(2)}</p>
            </div>
        `;
    }

    //muestra el promedio en el campo correspondiente
    document.getElementById(`promedio${i}`).value = promedio.toFixed(2);
}