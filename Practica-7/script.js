/*inicalizar una variable en la que guarde el inicio de sesion y otra el de registro, aparte crear un array el cual guardara las cuentas*/
const formu = document.getElementById("login");
const form = document.getElementById("registro");
let cuentas = [];

/*Estos son testeos, porfavor ignorar*/ 
//console.log("ola");
//localStorage.clear();

//console.log(cuentas);

//console.log(localStorage);

const cuentasGuardadas = localStorage.getItem("Cuentas");
if (cuentasGuardadas) {
    cuentas = JSON.parse(cuentasGuardadas);
}

const user = localStorage.getItem("UsuarioActivo");
if (user) {
    window.location.href = "Bienvenida.html";
}

/*El evento al darle submit a registrar verificara las contraseñas para ver si son iguales y que no se repita el correo*/ 
form.addEventListener("submit", e => {
    //localStorage.clear();
    e.preventDefault();

    const nombre = document.getElementById("nombreuno").value.trim();
    const correo = document.getElementById("correouno").value.trim();
    const contraseña = document.getElementById("contraseñauno").value.trim();
    const cContraseña = document.getElementById("cContraseñauno").value.trim();

    if (!nombre || !correo || !contraseña || !cContraseña) {
        alert("Porfavor rellena todos los campos");
        return;
    }


    //console.log(contraseña);
    //console.log(cContraseña);

    if (contraseña != cContraseña) {
        alert("Las contraseñas deben coincidir");
        return;
    }

    if (correosUsado = cuentas.some(a => a.correo === correo)) {
        alert("El correo ya esta en uso");
        return;
    }

    /*Creo el objeto cuenta el cual sera los datos que ponga en mi array llamado cuentas*/ 

    const cuenta = {
        nombre,
        correo,
        contraseña
    }

    cuentas.push(cuenta);
    localStorage.setItem("Cuentas", JSON.stringify(cuentas));

    form.reset();



    const usuario = localStorage.getItem("Cuentas");

    console.log(usuario);

    //console.log(cuentas[0].correo);

    /*Y cuando termina se redirige a la parte de iniciar sesion*/

    window.location.href = '#login-section';

});

/*Esta es la parte de iniciar sesion, en esta al darle submit guardara los datos de los input y verificara si se encuentran los datos 
que le estoy dando como el correo y la contraseña*/ 

formu.addEventListener("submit", e => {
    //localStorage.clear();
    e.preventDefault();

    const lCorreo = document.getElementById("correo").value.trim();
    const lContraseña = document.getElementById("contraseña").value.trim();


    if (!lCorreo || !lContraseña) {
        alert("Porfavor rellena los campos")
        return;
    }

    const cuentaEncontrada = cuentas.find(a => a.correo === lCorreo && a.contraseña === lContraseña);
    
    if (!cuentaEncontrada) {
        alert("No se encontro la cuenta");
        return;
    }

    localStorage.setItem("UsuarioActivo", JSON.stringify(cuentaEncontrada));

    /*const datos = {
        username: lCorreo,
        password: lContraseña
    }*/

    //alert("Bienvenido " + lCorreo);

    /*En esta parte los guarda en el local storage en formato JSON con el objeto de datos para asi poder irnos a la pestaña de
    bienvenida*/

    //localStorage.setItem("Usuario", JSON.stringify(datos));

    window.location.href = 'Bienvenida.html';

});