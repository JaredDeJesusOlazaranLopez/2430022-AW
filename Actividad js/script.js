let numeros = [];
let mayor=0;
let menor=0;
let si;
const form = document.getElementById('formulario');

form.addEventListener("submit", e => {
    e.preventDefault();

    si = document.getElementById("numeros").value.trim();
    if (!si) {
        alert('Por favor, ingresa un numero');
        return;
    }

    numeros = si.split(',').map(Number);
    console.log(numeros);

    let i = numeros.lenght;
    console.log(i);

    for(i=0;i<numeros.lenght;i++){
        if(numeros[i]>mayor){
            mayor = numeros[i];
        } else if(numeros[i]<menor){
            menor = numeros [i];
        }
    }

    console.log(mayor);
    console.log(menor);
}
);