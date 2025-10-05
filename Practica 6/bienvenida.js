const user = localStorage.getItem("UsuarioActivo");
const cerrar = document.getElementById("cerrar");
const agregarTareaBtn = document.getElementById("agregar-tarea");
const agregarProyectoBtn = document.getElementById("agregar-proyecto");
let tareas = [];
let proyectos = [];


//si hay un usuario activo te deja acceder y si no te manda al index
if (user) {
    const mensajeBienvenida = document.getElementById("bienvenida");
    const usuarioActual = JSON.parse(user);
    mensajeBienvenida.innerHTML = `Bienvenido, ${usuarioActual.correo}!`;

    //Pone las tareas registradas del usuario y tambien los proyectos

    const todasLasTareas = localStorage.getItem("TodasLasTareas");
    if (todasLasTareas) {
        const tareasGuardadas = JSON.parse(todasLasTareas);
        tareas = tareasGuardadas[usuarioActual.correo] || [];
    }

    const todosLosProyectos = localStorage.getItem("TodosLosProyectos");
    if (todosLosProyectos) {
        const proyectosGuardados = JSON.parse(todosLosProyectos);
        proyectos = proyectosGuardados[usuarioActual.correo] || [];
    }

    actualizarTablaTareas();
    actualizarTablaProyectos();
} else {
    alert("No has iniciado sesion");
    window.location.href = "index.html";
}

//Accion para el boton de agregar tareas donde crea variables para guardar los input y el modal
if (agregarTareaBtn) {
    const tareaModalEl = document.getElementById("tareaModal");
    const tareaModal = new bootstrap.Modal(tareaModalEl);
    const formTarea = document.getElementById("form-tarea");
    const inputNombre = document.getElementById("tarea-nombre");
    const inputDescripcion = document.getElementById("tarea-descripcion");
    const inputAsignado = document.getElementById("tarea-asignado");
    const inputEstado = document.getElementById("tarea-estado");
    const inputFechaInicio = document.getElementById("tarea-fechainicio");
    const inputFechaFin = document.getElementById("tarea-fechafin");

    //accion donde el boton te muestra el modal con el form
    agregarTareaBtn.addEventListener("click", () => {
        formTarea.reset();
        inputEstado.value = "Pendiente";
        tareaModal.show();
    });

    //agrega los valores dados en el form
    formTarea.addEventListener("submit", e => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const asignado = inputAsignado.value.trim();
        const estado = inputEstado.value || "Pendiente";
        const fechainicio = inputFechaInicio.value || "";
        const fechafin = inputFechaFin.value || "";

        if (!nombre || !descripcion) {
            alert("El nombre y la descripción son requeridos.");
            return;
        }

        const nuevaTarea = {
            /*Los datos de la tarea, en este caso de id lo estoy generando con la fecha y hora de creacion
            del proyecto para no tener que poner una variable encargada de asignar un id*/
            id: Date.now(),
            nombre,
            descripcion,
            asignado,
            estado,
            fechainicio,
            fechafin,
        };

        //guarda el objeto de nuevatarea en el vector tareas para luego guardarlo en el localstorage
        tareas.push(nuevaTarea);
        guardarTareas();
        actualizarTablaTareas();
        tareaModal.hide();
    });
}

//llama al modal y que se muestre, cuando precione el boton de agregar proyecto
if (agregarProyectoBtn) {
    // llamando al modal
    const proyectoModalEl = document.getElementById("proyectoModal");
    const proyectoModal = new bootstrap.Modal(proyectoModalEl);
    //llamando al formulario y a los inputs para poder acceder a ellos
    const formProyecto = document.getElementById("form-proyecto");
    const inputNombreP = document.getElementById("proyecto-nombre");
    const inputDescripcionP = document.getElementById("proyecto-descripcion");
    const inputAsignadoP = document.getElementById("proyecto-asignado");
    const inputEstadoP = document.getElementById("proyecto-estado");
    const inputFechaInicioP = document.getElementById("proyecto-fechainicio");
    const inputFechaFinP = document.getElementById("proyecto-fechafin");


    // boton para que se agregue un proyecto el cual llama al modal y lo muestra
    agregarProyectoBtn.addEventListener("click", () => {
        formProyecto.reset();
        inputEstadoP.value = "Pendiente";
        proyectoModal.show();
    });

    /*Agarra los datos de los input con las variables puestas anteriormente y hace las validaciones
    necesarias*/ 

    formProyecto.addEventListener("submit", e => {
        e.preventDefault();
        const nombre = inputNombreP.value.trim();
        const descripcion = inputDescripcionP.value.trim();
        const asignado = inputAsignadoP.value.trim();
        const estado = inputEstadoP.value || "Pendiente";
        const fechainicio = inputFechaInicioP.value || "";
        const fechafin = inputFechaFinP.value || "";

        if (!nombre || !descripcion) {
            alert("El nombre y la descripción son requeridos.");
            return;
        }

        const nuevoProyecto = {
            /*Los datos del proyecto, en este caso de id lo estoy generando con la fecha y hora de creacion
            del proyecto para no tener que poner una variable encargada de asignar un id*/
            id: Date.now(),
            nombre,
            descripcion,
            asignado,
            estado,
            fechainicio,
            fechafin,
        };

        //agrega el objeto de nuevo proyecto a mi vector de proyectos

        proyectos.push(nuevoProyecto);
        guardarProyectos();
        actualizarTablaProyectos();
        proyectoModal.hide();
    });
}

// Parte para guardar las tareas en el localstorage para el usuario actual
function guardarTareas() {
    const usuarioActual = JSON.parse(user);
    const todas = localStorage.getItem("TodasLasTareas");
    let obj = todas ? JSON.parse(todas) : {};
    obj[usuarioActual.correo] = tareas;
    localStorage.setItem("TodasLasTareas", JSON.stringify(obj));
}

// Parte para guardar los proyectos en el localstorage para el usuario actual
function guardarProyectos() {
    const usuarioActual = JSON.parse(user);
    const todos = localStorage.getItem("TodosLosProyectos");
    let obj = todos ? JSON.parse(todos) : {};
    obj[usuarioActual.correo] = proyectos;
    localStorage.setItem("TodosLosProyectos", JSON.stringify(obj));
}


// En esta parte se actualiza toda la tabla de tareas para mostrarlo cuando se ingresen los datos
function actualizarTablaTareas() {
    const tbody = document.getElementById("cuerpo-tabla");
    if (!tbody) return;
    tbody.innerHTML = "";
    tareas.forEach((tarea) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="py-3 px-4 text-center">${tarea.id}</td>
            <td class="py-3 px-4 fw-semibold">${tarea.nombre}</td>
            <td class="py-3 px-4">${tarea.descripcion}</td>
            <td class="py-3 px-4 text-center">${tarea.asignado || ''}</td>
            <td class="py-3 px-4 text-center">${tarea.estado || 'Pendiente'}</td>
            <td class="py-3 px-4 text-center">${tarea.fechainicio || ''}</td>
            <td class="py-3 px-4 text-center">${tarea.fechafin || ''}</td>
            <td class="py-3 px-4 text-center">
                <button class="btn btn-danger btn-sm rounded-pill px-3 eliminar" data-id="${tarea.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    //En cada una de las filas habra un boton de elminar el cual contendra el id del proyecto para poder borrar ese en especifico
    tbody.querySelectorAll(".eliminar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"), 10);
            tareas = tareas.filter((t) => t.id !== id);
            guardarTareas();
            actualizarTablaTareas();
        });
    });
}


// En esta parte se actualiza toda la tabla de proyectos para mostrarlo cuando se ingresen los datos
function actualizarTablaProyectos() {
    const tbody = document.getElementById("cuerpo-proyectos");
    if (!tbody) return;
    tbody.innerHTML = "";
    proyectos.forEach((proyecto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="py-3 px-4 text-center">${proyecto.id}</td>
            <td class="py-3 px-4 fw-semibold">${proyecto.nombre}</td>
            <td class="py-3 px-4">${proyecto.descripcion}</td>
            <td class="py-3 px-4 text-center">${proyecto.asignado || ''}</td>
            <td class="py-3 px-4 text-center">${proyecto.estado || 'Pendiente'}</td>
            <td class="py-3 px-4 text-center">${proyecto.fechainicio || ''}</td>
            <td class="py-3 px-4 text-center">${proyecto.fechafin || ''}</td>
            <td class="py-3 px-4 text-center">
                <button class="btn btn-danger btn-sm rounded-pill px-3 eliminar-proy" data-id="${proyecto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    //En cada una de las filas habra un boton de elminar el cual contendra el id del proyecto para poder borrar ese en especifico
    tbody.querySelectorAll(".eliminar-proy").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"), 10);
            proyectos = proyectos.filter((p) => p.id !== id);
            guardarProyectos();
            actualizarTablaProyectos();
        });
    });
}

//solo elimina el usuario activo y te regresa al index

if (cerrar) {
    cerrar.addEventListener("click", () => {
        localStorage.removeItem("UsuarioActivo");
        window.location.href = "index.html";
    });
}
