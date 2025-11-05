const form = document.getElementById("inicioSesion");

form.addEventListener("submit", e => {
    e.preventDefault();
    const correo = document.getElementById("correoI").value;
    const contrasena = document.getElementById("contraI").value;

    if (correo === "" || contrasena === "") {
        swal.fire({
            title: "Campos incompletos",
            text: "Por favor, complete todos los campos",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (correo === "admin@gmail.com" && contrasena === "12345") {
        swal.fire({
            title: "Inicio de sesion exitoso",
            text: "¡Bienvenido de nuevo!",
            icon: "success",
            confirmButtonText: "Continuar"
        }
        ).then(() => {
            window.location.href = "dashboard.html";
        });
    } else {
        swal.fire({
            title: "Error de inicio de sesion",
            text: "Correo o contraseña incorrectos",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
        return;
    }
});

