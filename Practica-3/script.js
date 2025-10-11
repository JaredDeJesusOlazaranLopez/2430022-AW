let alumnos = [];
let tablaBody = document.getElementById('tabla-alumnos');
const form = document.getElementById('formulario');

//console.log("entre");

renderTabla(alumnos);

form.addEventListener('submit', e => {
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

/*let alumnos = [];
let dataTable;

document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem('alumnos')){
        alumnos = JS('#alumnosTable', {
            lenguage: {
                url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
                emptyTable: 'No hay datos en la tabla',
                info: 'Mostrando _START_ a _END_ de _ TOTAL_ registros',
                infoEmpty: 'Mostrando 0 de 0 registros',

                paginate: {
                    previous: 'Anterior',
                    next: 'Siguiente'
                },

                columns: [
                    {data: 'matricula'},
                    {data: 'nombre'},
                    {data: 'carrera'},
                    {data: 'correo'},
                    {data: 'telefono'}
                ]

            }
        }()
    }
}*/