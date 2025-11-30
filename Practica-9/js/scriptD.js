let chartRecaudacion, chartMetodos, chartPacientes;

document.addEventListener('DOMContentLoaded', function () {
	cargarEstadisticas();
});

// Cargar estadísticas desde el servidor
async function cargarEstadisticas() {
	try {
		const response = await fetch('obtener_estadisticas_dashboard.php');
		const result = await response.json();
		
		if (result.success) {
			const data = result.data;
			
			// Actualizar tarjetas de estadísticas
			document.getElementById('totalRecaudado').textContent = '$' + data.totalRecaudado.toFixed(2);
			document.getElementById('totalPagos').textContent = data.totalPagos;
			document.getElementById('pagosPendientes').textContent = data.pagosPendientes;
			document.getElementById('totalMes').textContent = '$' + data.totalMes.toFixed(2);
			
			// Actualizar estadísticas adicionales
			if (document.getElementById('totalPacientes')) {
				document.getElementById('totalPacientes').textContent = data.totalPacientes;
			}
			if (document.getElementById('totalCitas')) {
				document.getElementById('totalCitas').textContent = data.totalCitas;
			}
			if (document.getElementById('promedioPago')) {
				const promedio = data.totalPagos > 0 ? data.totalRecaudado / data.totalPagos : 0;
				document.getElementById('promedioPago').textContent = '$' + promedio.toFixed(2);
			}
			
			// Crear gráficas
			crearGraficaRecaudacion(data.recaudacionMensual);
			crearGraficaMetodos(data.pagosPorMetodo);
			crearGraficaPacientes();
			
		} else {
			console.error('Error al cargar estadísticas:', result.error);
		}
	} catch (error) {
		console.error('Error de conexión:', error);
	}
}

// Gráfica de recaudación mensual
function crearGraficaRecaudacion(datosRecaudacion) {
	const canvas = document.getElementById('chartRecaudacion');
	if (!canvas) return;
	
	// Preparar datos para últimos 12 meses
	const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
	              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	const ahora = new Date();
	const labels = [];
	const datos = [];
	
	// Crear array de 12 meses hacia atrás
	for (let i = 11; i >= 0; i--) {
		const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
		const mes = fecha.getMonth() + 1;
		const anio = fecha.getFullYear();
		
		labels.push(meses[fecha.getMonth()] + ' ' + anio);
		
		// Buscar si hay datos para este mes
		const dato = datosRecaudacion.find(d => d.mes == mes && d.anio == anio);
		datos.push(dato ? parseFloat(dato.total) : 0);
	}
	
	const ctx = canvas.getContext('2d');
	
	if (chartRecaudacion) {
		chartRecaudacion.destroy();
	}
	
	chartRecaudacion = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Recaudación ($)',
				data: datos,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.4,
				fill: true,
				pointRadius: 4,
				pointBackgroundColor: 'rgb(75, 192, 192)',
				pointBorderColor: '#fff',
				pointBorderWidth: 2
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: true,
					position: 'top'
				},
				tooltip: {
					callbacks: {
						label: function(context) {
							return 'Recaudación: $' + context.parsed.y.toFixed(2);
						}
					}
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						callback: function(value) {
							return '$' + value.toFixed(0);
						}
					}
				}
			}
		}
	});
}

// Gráfica de pagos por método
function crearGraficaMetodos(datosPorMetodo) {
	const canvas = document.getElementById('chartMetodos');
	if (!canvas) return;
	
	const labels = datosPorMetodo.map(d => d.metodoPago);
	const datos = datosPorMetodo.map(d => parseFloat(d.total));
	
	const colores = [
		'rgba(255, 99, 132, 0.8)',
		'rgba(54, 162, 235, 0.8)',
		'rgba(255, 206, 86, 0.8)',
		'rgba(75, 192, 192, 0.8)',
		'rgba(153, 102, 255, 0.8)'
	];
	
	const ctx = canvas.getContext('2d');
	
	if (chartMetodos) {
		chartMetodos.destroy();
	}
	
	chartMetodos = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{
				data: datos,
				backgroundColor: colores,
				borderColor: '#fff',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					position: 'bottom'
				},
				tooltip: {
					callbacks: {
						label: function(context) {
							const label = context.label || '';
							const value = context.parsed || 0;
							return label + ': $' + value.toFixed(2);
						}
					}
				}
			}
		}
	});
}

// Gráfica de pacientes (ejemplo con datos estáticos, puedes hacerla dinámica)
function crearGraficaPacientes() {
	const canvas = document.getElementById('chartPacientes');
	if (!canvas) return;
	
	const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
	              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	const pacientesData = [12, 28, 35, 42, 58, 71, 85, 92, 108, 124, 156, 189];
	
	const ctx = canvas.getContext('2d');
	
	if (chartPacientes) {
		chartPacientes.destroy();
	}
	
	chartPacientes = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: meses,
			datasets: [{
				label: 'Pacientes Registrados',
				data: pacientesData,
				backgroundColor: 'rgba(54, 162, 235, 0.7)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: false
				}
			},
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}