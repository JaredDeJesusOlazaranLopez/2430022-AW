const user = localStorage.getItem("UsuarioActivo");
const cerrar = document.getElementById("cerrar");
const agregarTareaBtn = document.getElementById("agregar-tarea");
const agregarProyectoBtn = document.getElementById("agregar-proyecto");
let tareas = [];
let proyectos = [];
let notas = [];


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
    // cargar notas
    const todasLasNotas = localStorage.getItem("TodasLasNotas");
    if (todasLasNotas) {
        const notasGuardadas = JSON.parse(todasLasNotas);
        notas = notasGuardadas[usuarioActual.correo] || [];
    }
    actualizarNotas();
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

// Drag & Drop: variables temporales
let dragSrcIndex = null;

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

    // Notas: modal y botones
    const btnMostrarNotas = document.getElementById("mostrar-notas");
    const btnNuevaNota = document.getElementById("nueva-nota");
    const notaModalEl = document.getElementById("notaModal");
    const notaModal = notaModalEl ? new bootstrap.Modal(notaModalEl) : null;
    const inputNotaColor = document.getElementById("nota-color");
    const inputNotaTitulo = document.getElementById("nota-titulo");
    const inputNotaDesc = document.getElementById("nota-descripcion");
    const btnGuardarNota = document.getElementById("guardar-nota");

    if (btnMostrarNotas) {
        btnMostrarNotas.addEventListener("click", () => {
            const cont = document.getElementById("apartado-notas");
            if (cont.style.display === "block") cont.style.display = "none";
            else cont.style.display = "block";
        });
    }

    if (btnNuevaNota && notaModal) {
        btnNuevaNota.addEventListener("click", () => {
            inputNotaTitulo.value = "";
            inputNotaDesc.value = "";
            inputNotaColor.value = "#fff28b";
            notaModal.show();
        });
    }

    function guardarNotas() {
        const usuarioActual = JSON.parse(user);
        const todas = localStorage.getItem("TodasLasNotas");
        let obj = todas ? JSON.parse(todas) : {};
        obj[usuarioActual.correo] = notas;
        localStorage.setItem("TodasLasNotas", JSON.stringify(obj));
    }

    function actualizarNotas() {
        const cont = document.getElementById("apartado-notas");
        if (!cont) return;
        cont.innerHTML = "";
        notas.forEach((n, i) => {
            const card = document.createElement("div");
            card.className = "nota p-2 m-2";
            card.style.background = n.color || '#fff28b';
            card.dataset.idx = i;
            card.setAttribute('draggable', 'true');

            const h = document.createElement('strong'); h.textContent = n.title || 'Sin título';
            const p = document.createElement('div'); p.textContent = n.desc || '';
            const btnDel = document.createElement('button'); btnDel.className = 'btn btn-sm btn-danger ms-2'; btnDel.textContent = 'X';
            btnDel.style.float = 'right';

            const header = document.createElement('div'); header.appendChild(h); header.appendChild(btnDel);
            card.appendChild(header); card.appendChild(p);

            // editar nota al hacer click en el cuerpo (no en el boton)
            card.addEventListener('click', (ev) => {
                if (ev.target === btnDel) return; // no abrir editor
                inputNotaTitulo.value = n.title || '';
                inputNotaDesc.value = n.desc || '';
                inputNotaColor.value = n.color || '#fff28b';
                notaModal.show();
                btnGuardarNota.onclick = () => {
                    n.title = inputNotaTitulo.value;
                    n.desc = inputNotaDesc.value;
                    n.color = inputNotaColor.value;
                    guardarNotas(); actualizarNotas(); notaModal.hide();
                };
            });

            // eliminar
            btnDel.addEventListener('click', (e) => {
                e.stopPropagation();
                notas.splice(i,1); 
                guardarNotas(); 
                actualizarNotas();
            });

            
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', i);
                card.classList.add('dragging');
            });
            card.addEventListener('dragend', () => card.classList.remove('dragging'));
            card.addEventListener('dragover', (e) => { e.preventDefault(); card.classList.add('drag-over'); });
            card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
            card.addEventListener('drop', (e) => {
                e.preventDefault(); card.classList.remove('drag-over');
                const src = parseInt(e.dataTransfer.getData('text/plain'),10);
                const dst = parseInt(card.dataset.idx,10);
                if (!isNaN(src) && !isNaN(dst) && src !== dst) {
                    const item = notas.splice(src,1)[0];
                    notas.splice(dst,0,item);
                    guardarNotas(); actualizarNotas();
                }
            });

            cont.appendChild(card);
            // small pop animation
            setTimeout(() => { if (card) card.classList.add('animate-pop'); }, 10);
        });
    }

    if (btnGuardarNota) {
        btnGuardarNota.addEventListener('click', () => {
            const titulo = inputNotaTitulo.value.trim();
            const desc = inputNotaDesc.value.trim();
            const color = inputNotaColor.value;
            if (!titulo && !desc) { alert('Escribe algo'); return; }
            notas.push({ title: titulo, desc, color });
            guardarNotas();
            actualizarNotas();
            notaModal.hide();
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
        fila.setAttribute('draggable', 'true');
        fila.dataset.id = tarea.id;
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
        // eventos dnd
        fila.addEventListener('dragstart', (e) => {
            dragSrcIndex = tareas.findIndex(x => x.id == tarea.id);
            fila.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        fila.addEventListener('dragend', () => {
            fila.classList.remove('dragging');
            dragSrcIndex = null;
        });

        fila.addEventListener('dragover', (e) => { e.preventDefault(); fila.classList.add('drag-over'); });
        fila.addEventListener('dragleave', () => fila.classList.remove('drag-over'));
        fila.addEventListener('drop', (e) => {
            e.preventDefault(); fila.classList.remove('drag-over');
            const targetId = parseInt(fila.dataset.id, 10);
            const targetIndex = tareas.findIndex(x => x.id == targetId);
            if (dragSrcIndex !== null && targetIndex !== -1 && dragSrcIndex !== targetIndex) {
                // swap
                const tmp = tareas[dragSrcIndex];
                tareas.splice(dragSrcIndex, 1);
                tareas.splice(targetIndex, 0, tmp);
                guardarTareas();
                actualizarTablaTareas();
            }
        });

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
