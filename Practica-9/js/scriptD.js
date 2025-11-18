document.addEventListener('DOMContentLoaded', function () {
	const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	const pacientesData = [12, 28, 35, 42, 58, 71, 85, 92, 108, 124, 156, 189];

	const lineCanvas = document.getElementById('chartLine');
	if (lineCanvas && window.Chart) {
		const ctxLine = lineCanvas.getContext('2d');
		new Chart(ctxLine, {
			type: 'line',
			data: {
				labels: months,
				datasets: [{
					label: 'Pacientes',
					data: pacientesData,
					borderColor: 'rgb(54, 162, 235)',
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					tension: 0.3,
					fill: true,
					pointRadius: 4
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: { y: { beginAtZero: true } }
			}
		});
	}

	const especialidades = ['Consulta General', 'Pediatría', 'Ginecología', 'Medicina Interna', 'Urgencias'];
	const citasData = [245, 138, 92, 167, 78];

	const barCanvas = document.getElementById('chartBar');
	if (barCanvas && window.Chart) {
		const ctxBar = barCanvas.getContext('2d');
		new Chart(ctxBar, {
			type: 'bar',
			data: {
				labels: especialidades,
				datasets: [{
					label: 'Citas',
					data: citasData,
					backgroundColor: [
						'rgba(75, 192, 192, 0.7)',
						'rgba(255, 159, 64, 0.7)',
						'rgba(255, 205, 86, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(153, 102, 255, 0.7)'
					],
					borderColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(255, 205, 86, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(153, 102, 255, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: { y: { beginAtZero: true } },
				plugins: { legend: { display: false } }
			}
		});
	}
});
