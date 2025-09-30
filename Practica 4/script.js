const formu = document.getElementById("login");
const form=document.getElementById("registro");
let cuentas=[];
//console.log("ola");
localStorage.clear();

console.log(cuentas);

const user = localStorage.getItem("Usuario");
if(user){
    window.location.href = "Bienvenida.html";

}


form.addEventListener("submit", e=>{
    localStorage.clear();
    e.preventDefault();

    const nombre = document.getElementById("nombreuno").value.trim();
    const correo = document.getElementById("correouno").value.trim();
    const contraseña = document.getElementById("contraseñauno").value.trim();
    const cContraseña = document.getElementById("cContraseñauno").value.trim();

    if(!nombre || !correo || !contraseña || !cContraseña){
        alert("Porfavor rellena todos los campos");
        return;
    }

    //console.log(contraseña);
    //console.log(cContraseña);

    if(contraseña != cContraseña){
        alert("Las contraseñas deben coincidir");
        return;
    }

    const cuenta = {
        correo,
        contraseña
    }

    cuentas.push(cuenta);

    form.reset();

    console.log(cuentas);


});

formu.addEventListener("submit", e=>{
    localStorage.clear();
    e.preventDefault();

    const lCorreo = document.getElementById("correo").value.trim();
    const lContraseña = document.getElementById("contraseña").value.trim();


    if(!lCorreo || !lContraseña){
        alert("Porfavor rellena los campos")
        return;
    }

    const CorreoUsado = cuentas.some(a => a.correo === lCorreo);
    const ContraUsada = cuentas.some(a => a.contraseña === lContraseña);
    if(!CorreoUsado || !ContraUsada){
        alert("No se encontro la cuenta");
        
    }

    const datos = {
        username: lCorreo,
        password: lContraseña
    }

    //alert("Bienvenido " + lCorreo);

    localStorage.setItem("Usuario", JSON.stringify(datos));

    window.location.href = 'Bienvenida.html';

});


