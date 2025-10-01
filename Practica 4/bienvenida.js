/*Aqui creo el usuario el cual sera el localstorage en el usuario y pongo el boton para cerrar sesion*/
const user = localStorage.getItem("Usuario");
const cerrar = document.getElementById("cerrar");

//console.log(localStorage);

/*Aqui mandara el mensaje en el caso que encuentre una cuenta, en el caso que no la encuentre (lo cual solo es posible accediendo directamente)
al html pues lo redireccionara al index y le mandara un alert para que se registre*/ 
if(user) {
    const mensajeBienvenida = document.getElementById("bienvenida");
    mensajeBienvenida.innerHTML = "Bienvenido, " + JSON.parse(user).username + "!";
} else {
    alert("No has iniciado sesion");
    window.location.href="index.html";
}

/*Aqui es para el boton de cerrar, aqui solo sirve para borrar el localstorage ya que es solo de un registro
y redireccionara a la pagina index*/

cerrar.addEventListener("click", e => {
    localStorage.clear();
    window.location.href="index.html";
});

