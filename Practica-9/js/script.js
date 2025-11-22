const formLogin = document.getElementById("inicioSesion");
const formRegistro = document.getElementById("registro");

formLogin.addEventListener("submit", e => {
    e.preventDefault();
    const correo = document.getElementById("correoI").value.trim();
    const contrasena = document.getElementById("contraI").value.trim();

    if (correo === "" || contrasena === "") {
        Swal.fire({
            title: "Campos incompletos",
            text: "Por favor, complete todos los campos",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            correo: correo,
            contrasena: contrasena
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: "Inicio de sesión exitoso",
                text: "¡Bienvenido de nuevo!",
                icon: "success",
                confirmButtonText: "Continuar"
            }).then(() => {
                window.location.href = "dashboard.php";
            });
        } else {
            Swal.fire({
                title: "Error de inicio de sesión",
                text: data.error || "Correo o contraseña incorrectos",
                icon: "error",
                confirmButtonText: "Reintentar"
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Error al conectar con el servidor",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    });
});

formRegistro.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombreR").value.trim();
    const correo = document.getElementById("correoR").value.trim();
    const contrasena = document.getElementById("contraR").value.trim();

    if (nombre === "" || correo === "" || contrasena === "") {
        Swal.fire({
            title: "Campos incompletos",
            text: "Por favor, complete todos los campos",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (contrasena.length < 6) {
        Swal.fire({
            title: "Contraseña débil",
            text: "La contraseña debe tener al menos 6 caracteres",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    fetch('registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            correo: correo,
            contrasena: contrasena
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: "Registro exitoso",
                text: "Usuario creado correctamente. Ahora puedes iniciar sesión",
                icon: "success",
                confirmButtonText: "Continuar"
            }).then(() => {
                formRegistro.reset();
            });
        } else {
            Swal.fire({
                title: "Error al registrar",
                text: data.error || "No se pudo crear el usuario",
                icon: "error",
                confirmButtonText: "Reintentar"
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Error al conectar con el servidor",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    });
});