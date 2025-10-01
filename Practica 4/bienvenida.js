const user = localStorage.getItem("Usuario");
const cerrar = document.getElementById("cerrar");

if(user) {
    const mensajeBienvenida = document.getElementById("bienvenida");
    mensajeBienvenida.innerHTML = "Bienvenido, " + JSON.parse(user).username + "!";
} else {
    alert("No has iniciado sesion");
    window.location.href="index.html";
}

cerrar.addEventListener("click", e => {
    localStorage.clear();
    window.location.href="index.html";
});

