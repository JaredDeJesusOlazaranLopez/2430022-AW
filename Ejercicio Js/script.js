const form = document.getElementById("formulario");

form.addEventListener("submit", e=>{
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("email").value.trim();
    const contra = document.getElementById("contraseña").value.trim();
    const cContra = document.getElementById("cContraseña").value.trim();
    const mensajeNombre=document.getElementById("errornombre");
    const mensajeCorreo=document.getElementById("errorcorreo");
    const mensajeContra=document.getElementById("errorcontraseña");
    const mensajeConfirmacion=document.getElementById("errorconfirmacion");
    mensajeCorreo.innerHTML = "";
    mensajeNombre.innerHTML = "";
    mensajeContra.innerHTML = "";
    mensajeConfirmacion.innerHTML = "";

    if(!nombre){
        mensajeNombre.innerHTML = "Porfavor complete el campo de nombre";
        error();
        return;
    }
    if(!correo){
        mensajeCorreo.innerHTML = "Porfavor complete el campo de correo";
        error();
        return;
    }
    if(!contra){
        mensajeContra.innerHTML = "Porfavor complete el campo de contraseña";
        error();
        return;
    }
    if(!cContra){
        mensajeConfirmacion.innerHTML = "Porfavor complete el campo de confirmar contraseña";
        error();
        return;
    }
    if(contra<6){
        mensajeContra.innerHTML = "El campo de contraseña debe tener minimo 6 caracteres"; 
        error();
        return;
    }
    if(contra != cContra){
        mensajeConfirmacion.innerHTML = "Las contraseñas deben de coincidir";
        error();
        return;
    }

    exito();
    
});

function error(){
    alert("Parece que hubo un error en tu registro");
}

function exito(){
    alert("Registrado con exito");
}