function cargarTarifas() {
    var especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    var tbody = document.getElementById('listaTarifas');
    
    var especialidadesConTarifa = [];
    for (var i = 0; i < especialidades.length; i++) {
        if (especialidades[i].estado === 'Activa' && especialidades[i].costoConsulta) {
            especialidadesConTarifa.push(especialidades[i]);
        }
    }
    
    if (especialidadesConTarifa.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted py-4">No hay tarifas registradas</td></tr>';
        return;
    }
    
    especialidadesConTarifa.sort(function(a, b) {
        return a.nombre.localeCompare(b.nombre);
    });
    
    var html = '';
    for (var j = 0; j < especialidadesConTarifa.length; j++) {
        var esp = especialidadesConTarifa[j];
        var costo = parseFloat(esp.costoConsulta).toFixed(2);
        
        html += '<tr>';
        html += '<td>' + esp.nombre + '</td>';
        html += '<td class="text-end">$' + costo + '</td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    cargarTarifas();
});