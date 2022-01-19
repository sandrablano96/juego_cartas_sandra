let imagenCarta = document.querySelectorAll(".carta > div");
let carta = document.querySelectorAll(".carta");

for (let i = 0; i < carta.length; i++) {
    imagenCarta[i].style.display = "none";
    carta[i].setAttribute("id", i);
}

for (contenidoCarta of carta) {
    contenidoCarta.addEventListener("click", function(evt){
        let contenidoCarta = evt.target;
        let idCarta = contenidoCarta.parentElement.id
        
            for (let i = 0; i <= 12; i++) {
                if(idCarta == i){
                    imagenCarta[i].style.display = "block";
                    break;
                }
            }
            
    });
}