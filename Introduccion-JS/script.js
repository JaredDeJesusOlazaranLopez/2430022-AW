let alumnos = [];
let tablaBody = document.getElementById('tabla-alumnos');
const form = document.getElementById('formulario');

console.log("entre");

renderTabla(alumnos);

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const matricula = document.getElementById('matricula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const carrera = document.getElementById('carrera').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (!matricula || !nombre || !carrera || !correo || !telefono) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const mUsada = alumnos.some(a => a.matricula === matricula);
    if (mUsada) {
        alert('Ya hay un alumno con esa matricula');
        return;
    }

    const alumno = {
        matricula,
        nombre,
        carrera,
        correo,
        telefono
    };

    alumnos.push(alumno);
    localStorage.setItem(KeyboardEvent, JSON.stringify(alumnos));

    renderTabla(alumnos);
    form.reset();
    document.getElementById('matricula').focus();
}
);

tablaBody.addEventListener('click', function (e) {
    if (e.target.matches('.btn-eliminar')) {
        const mat = e.target.dataset.matricula;
        alumnos = alumnos.filter(a => a.matricula !== mat);
        localStorage.setItem(KEY, JSON.stringify(alumnos));
        renderTabla(alumnos);
    }
});

function renderTabla(data) {
    if (!Array.isArray(data)) return;

    tablaBody.innerHTML = data.map(a => `
  <tr>
    <td>${a.matricula}</td>
    <td>${a.nombre}</td>
    <td>${a.carrera}</td>
    <td>${a.correo}</td>
    <td>${a.telefono}</td>
  </tr>
`).join('');
}

