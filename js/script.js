var contadorClicks = 0;
var cont = 0;
let imagenesCarta = document.querySelectorAll(".carta__imagen");
let cartas = document.querySelectorAll(".carta");

for (let i = 0; i < cartas.length; i++) {
    imagenesCarta[i].style.display = "none";
    cartas[i].setAttribute("id", i);
}

for (carta of cartas) {
    carta.addEventListener("click", function mostrarImagenes(evt) {
        let contenidoCarta = evt.target;
        let idCarta = contenidoCarta.parentElement.id;
        contadorClicks++;
        let cartasSeleccionadas = new Array();
        for (let i = 0; i <= 12; i++) {
            if (idCarta == i) {
                this.lastElementChild.style.display = "block";
                this.firstElementChild.style.display = "none";
                this.removeEventListener("click", mostrarImagenes, false);

                cartasSeleccionadas.push(contenidoCarta.lastElementChild.className.split(" ")[1]);
            }
            if (contadorClicks == 2) {
                comprobarIguales(cartasSeleccionadas);
                break;
            }
        }

    });
}

function comprobarIguales(arraySeleccionados) {
    console.log(arraySeleccionados);
    if(arraySeleccionados[0] == arraySeleccionados[1]){
        console.log("verdadero");
        cont++;
        /*function checkTotal(){

        }*/
    }else{
        console.log("falso");
    }
}