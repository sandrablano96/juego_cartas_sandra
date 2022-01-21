var contadorClicks = 0;
var cont = 0;
var cartasSeleccionadas = new Array();
let cartas = document.querySelectorAll(".carta");
var imagen
//creamos dos arrays aleatorios del 1 al 6
let opciones = ["bart", "lisa", "bart", "maggie", "maggie", "homer", "flanders", "lisa", "flanders", "marge", "marge", "homer"];
let arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });

for (let i = 0; i < arrayOpciones.length; i++) {
    cartas[i].setAttribute("name", arrayOpciones[i]);
}
//funcion que mezcla los numeros e impide repeticiones, cambiar por sort + random
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
function mostrarImagenes(evt) {
    contadorClicks++;
    let carta = evt.target;
    console.log(carta);
    if (carta != null) {
        /*let carta = contenidoCarta.parentElement;*/
        let idCarta = carta.getAttribute("name");
        cartasSeleccionadas.push(carta);
        imagen = document.createElement("img");
        //corregir, se agrega debajo del div de carta__imagen 
        carta.firstElementChild.appendChild(imagen).setAttribute("src", "img/" + idCarta + ".png");
        imagen.setAttribute("alt", idCarta);
        carta.style.backgroundColor = "white";
        carta.style.backgroundImage = "url('')";
        carta.style.border = "1px solid black";
        if (contadorClicks == 2) {
            contadorClicks = 0;
            setTimeout(() => {
                deseleccionar();
            }, 1000);

        }
    }

}
//añade a cada div carta el evento
for (carta of cartas) {
    carta.addEventListener("click", mostrarImagenes);
}


function deseleccionar() {
    if (comprobarIguales(cartasSeleccionadas)) {
        cartasSeleccionadas.forEach(element => {
            element.removeEventListener("click", mostrarImagenes);
        });

    } else {
        cartasSeleccionadas.forEach(element => {
            element.firstElementChild.removeChild(element.firstElementChild.lastElementChild);
            element.addEventListener("click", mostrarImagenes);
            //prodiamos crear una clase con dos estilos (inicial, acertada) y quitar o darla a los elementos
            element.style.backgroundImage = "url(img/cara-trasera.jpg)";
            element.style.backgroundColor = "";
            element.style.border = "";

        });

    };
    cartasSeleccionadas = [];

}


function comprobarIguales(arraySeleccionados) {
    if (arraySeleccionados[0].getAttribute("name") == arraySeleccionados[1].getAttribute("name")) {
        arraySeleccionados.forEach(element => {
            element.style.border = "3px solid green"
        });
        console.log("verdadero");
        cont++;
        return true;
        /*function checkTotal(){

        }*/
    } else {
        console.log("falso");
        return false
    }
}