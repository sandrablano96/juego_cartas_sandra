var contadorClicks = 0;



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

        for (let i = 0; i <= 12; i++) {
            if (idCarta == i) {
                contenidoCarta.lastElementChild.style.display = "block";
                contenidoCarta.firstElementChild.style.display = "none";
                this.removeEventListener("click", mostrarImagenes, false);
               
            } 
            let cartasSeleccionadas = array();
            
            if (contadorClicks == 2){

                comprobarIguales(  )
            }
        }
        
    });
}

function comprobarIguales(sel1,sel2){

}