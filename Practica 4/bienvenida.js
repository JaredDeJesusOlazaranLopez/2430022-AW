/*Aqui creo el usuario el cual sera el localstorage en el usuario y pongo el boton para cerrar sesion*/
const user = localStorage.getItem("UsuarioActivo");
const cerrar = document.getElementById("cerrar");
const tabla = document.getElementById("tabla-tareas");
const agregarTareaBtn = document.getElementById("agregar-tarea");
let tareas = [];

//console.log(localStorage);

/*Aqui mandara el mensaje en el caso que encuentre una cuenta, en el caso que no la encuentre (lo cual solo es posible accediendo directamente)
al html pues lo redireccionara al index y le mandara un alert para que se registre*/ 
if(user) {
    const mensajeBienvenida = document.getElementById("bienvenida");
    const usuarioActual = JSON.parse(user);
    mensajeBienvenida.innerHTML = "Bienvenido, " + usuarioActual.correo + "!";
    
    const todasLasTareas = localStorage.getItem("TodasLasTareas");
    if (todasLasTareas) {
        const tareasGuardadas = JSON.parse(todasLasTareas);
        tareas = tareasGuardadas[usuarioActual.correo] || [];
    }
    actualizarTabla();
} else {
    alert("No has iniciado sesion");
    window.location.href="index.html";
}

agregarTareaBtn.addEventListener("click", () => {
    const nombre = prompt("Ingrese el nombre de la tarea:");
    if (nombre) {
        const descripcion = prompt("Ingrese la descripcion de la tarea:");
        if (descripcion) {
            const nuevaTarea = {
                id: Date.now(),
                nombre: nombre,
                descripcion: descripcion
            };
            tareas.push(nuevaTarea);
            actualizarTabla();
            
            const usuarioActual = JSON.parse(user);
            const todasLasTareas = localStorage.getItem("TodasLasTareas");
            let tareasGuardadas = todasLasTareas ? JSON.parse(todasLasTareas) : {};
            tareasGuardadas[usuarioActual.correo] = tareas;
            localStorage.setItem("TodasLasTareas", JSON.stringify(tareasGuardadas));
        }
    }
});

function actualizarTabla() {
    const tbody = document.getElementById("cuerpo-tabla");
    tbody.innerHTML = "";
    tareas.forEach(tarea => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="py-3 px-4 fw-semibold">${tarea.nombre}</td>
            <td class="py-3 px-4">${tarea.descripcion}</td>
            <td class="py-3 px-4 text-center">
                <button class="btn btn-danger btn-sm rounded-pill px-3 eliminar" data-id="${tarea.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
    tbody.querySelectorAll(".eliminar").forEach(boton => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"));
            tareas = tareas.filter(tarea => tarea.id !== id);
            actualizarTabla();
            
            const usuarioActual = JSON.parse(user);
            const todasLasTareas = localStorage.getItem("TodasLasTareas");
            let tareasGuardadas = todasLasTareas ? JSON.parse(todasLasTareas) : {};
            tareasGuardadas[usuarioActual.correo] = tareas;
            localStorage.setItem("TodasLasTareas", JSON.stringify(tareasGuardadas));
        });
    });
}

/*El boton de agregar tarea crea un prompt para que el usuario pueda ingresar la descripcion de la tarea
y al darle aceptar se agrega a la tabla con un boton de eliminar que elimina la fila correspondiente*/

/*Aqui es para el boton de cerrar, aqui solo sirve para borrar el localstorage ya que es solo de un registro
y redireccionara a la pagina index*/

cerrar.addEventListener("click", e => {
    localStorage.removeItem("UsuarioActivo");
    window.location.href="index.html";
});