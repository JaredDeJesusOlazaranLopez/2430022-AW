/* Bienvenida.js — manejo de tareas y proyectos con modales y localStorage */
const user = localStorage.getItem("UsuarioActivo");
const cerrar = document.getElementById("cerrar");
const agregarTareaBtn = document.getElementById("agregar-tarea");
const agregarProyectoBtn = document.getElementById("agregar-proyecto");
let tareas = [];
let proyectos = [];

// Inicialización: cargar usuario, tareas y proyectos
if (user) {
    const mensajeBienvenida = document.getElementById("bienvenida");
    const usuarioActual = JSON.parse(user);
    mensajeBienvenida.innerHTML = `Bienvenido, ${usuarioActual.correo}!`;

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

// --- Modal / formulario de Tareas ---
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

    agregarTareaBtn.addEventListener("click", () => {
        formTarea.reset();
        inputEstado.value = "Pendiente";
        tareaModal.show();
    });

    formTarea.addEventListener("submit", (evt) => {
        evt.preventDefault();
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
            id: Date.now(),
            nombre,
            descripcion,
            asignado,
            estado,
            fechainicio,
            fechafin,
        };

        tareas.push(nuevaTarea);
        guardarTareas();
        actualizarTablaTareas();
        tareaModal.hide();
    });
}

// --- Modal / formulario de Proyectos ---
if (agregarProyectoBtn) {
    const proyectoModalEl = document.getElementById("proyectoModal");
    const proyectoModal = new bootstrap.Modal(proyectoModalEl);
    const formProyecto = document.getElementById("form-proyecto");
    const inputNombreP = document.getElementById("proyecto-nombre");
    const inputDescripcionP = document.getElementById("proyecto-descripcion");
    const inputAsignadoP = document.getElementById("proyecto-asignado");
    const inputEstadoP = document.getElementById("proyecto-estado");
    const inputFechaInicioP = document.getElementById("proyecto-fechainicio");
    const inputFechaFinP = document.getElementById("proyecto-fechafin");

    agregarProyectoBtn.addEventListener("click", () => {
        formProyecto.reset();
        inputEstadoP.value = "Pendiente";
        proyectoModal.show();
    });

    formProyecto.addEventListener("submit", (evt) => {
        evt.preventDefault();
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
            id: Date.now(),
            nombre,
            descripcion,
            asignado,
            estado,
            fechainicio,
            fechafin,
        };

        proyectos.push(nuevoProyecto);
        guardarProyectos();
        actualizarTablaProyectos();
        proyectoModal.hide();
    });
}

// --- Guardado en localStorage ---
function guardarTareas() {
    const usuarioActual = JSON.parse(user);
    const todas = localStorage.getItem("TodasLasTareas");
    let obj = todas ? JSON.parse(todas) : {};
    obj[usuarioActual.correo] = tareas;
    localStorage.setItem("TodasLasTareas", JSON.stringify(obj));
}

function guardarProyectos() {
    const usuarioActual = JSON.parse(user);
    const todos = localStorage.getItem("TodosLosProyectos");
    let obj = todos ? JSON.parse(todos) : {};
    obj[usuarioActual.correo] = proyectos;
    localStorage.setItem("TodosLosProyectos", JSON.stringify(obj));
}

// --- Renderizado de tablas ---
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

    tbody.querySelectorAll(".eliminar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"), 10);
            tareas = tareas.filter((t) => t.id !== id);
            guardarTareas();
            actualizarTablaTareas();
        });
    });
}

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

    tbody.querySelectorAll(".eliminar-proy").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"), 10);
            proyectos = proyectos.filter((p) => p.id !== id);
            guardarProyectos();
            actualizarTablaProyectos();
        });
    });
}

// --- Logout ---
if (cerrar) {
    cerrar.addEventListener("click", () => {
        localStorage.removeItem("UsuarioActivo");
        window.location.href = "index.html";
    });
}
