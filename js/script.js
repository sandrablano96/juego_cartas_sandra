var contadorClicks = 0;
var cont = document.getElementById("contador");
var errores = document.getElementById("errores");
var cartasSeleccionadas = new Array();
let cartas = document.querySelectorAll(".carta");
var imagen
//creamos dos arrays aleatorios del 1 al 6
let opciones1 = [1, 2, 3, 4, 5, 6];
let opciones2 = [1, 2, 3, 4, 5, 6];
shuffle(opciones1);
shuffle(opciones2);
let arrayOpciones = opciones1.concat(opciones2);
let usuario;
do{
    usuario = prompt("Introduce tu nombre de usuario", )
}while(usuario === "" || usuario == null)
let etiquetaUsuario = document.getElementById("usuario").innerHTML = usuario
let filaError = document.getElementById("filaError").textContent



for (let i = 0; i < cartas.length; i++) {
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
    if (carta != null) {
        /*let carta = contenidoCarta.parentElement;*/
        let idCarta = carta.getAttribute("name");
        cartasSeleccionadas.push(carta);
        imagen = document.createElement("img");
        //corregir, se agrega debajo del div de carta__imagen
        carta.appendChild(imagen).setAttribute("src", "img/" + idCarta + ".png");
        carta.style.backgroundColor = "white";
        carta.style.backgroundImage = "url('')";
        carta.style.border = "1px solid black";
        this.firstElementChild.style.display = "none";
        this.removeEventListener("click", mostrarImagenes, {passive: false});
        if (contadorClicks == 2) {
            contadorClicks = 0;
            setTimeout(() => {
                deseleccionar();
              }, 300);
            
        }
        
    }

}
//añade a cada div carta el evento
for (carta of cartas) {
    carta.addEventListener("click", mostrarImagenes);
}


function deseleccionar() {
    if (!comprobarIguales(cartasSeleccionadas)) {
        cartasSeleccionadas.forEach(element => {
            element.removeChild(element.lastElementChild);
            element.addEventListener("click", mostrarImagenes);
            //prodiamos crear una clase con dos estilos (inicial, acertada) y quitar o darla a los elementos
            element.style.backgroundImage = "url(img/cara-trasera.jpg)";
            element.style.backgroundColor = "";
            element.style.border= "";

        });
    };
    cartasSeleccionadas = [];
}


function comprobarIguales(arraySeleccionados) {
    if (arraySeleccionados[0].getAttribute("name") == arraySeleccionados[1].getAttribute("name")) {
        arraySeleccionados.forEach(element => {
            element.style.border = "3px solid green"
        });
        
        checkTotal()
        
        return true;
    } else {
        sumarErrores();
        return false
    }
}

function checkTotal(){
    contParsed = parseInt(cont.textContent, 10)
    contParsed++
    cont.innerHTML = contParsed;
    if(contParsed == 6){
        guardarPuntuacionFinal(this.usuario,errores.textContent);
        alert(`Ganaste!! con ${errores.textContent} errores`)
        window.location.reload();
    }
}

function sumarErrores(){
    errorParsed = parseInt(errores.textContent, 10)
    errorParsed++
    errores.innerHTML = errorParsed;
}

/* COOKIES */
function setCookie(nombreCookie, valorCookie, expiraDia = 30){
    const date = new Date();
    date.setTime(date.getTime() + (expiraDia * 24 * 60 * 60 * 1000))
    let expiracion = `expira=${date.toUTCString()}`;
    document.cookie = `${nombreCookie}=${valorCookie}; ${expiracion};`;
}

function getCookie(nombreCookie){
    let nombre = nombreCookie + "=";
    let arrayCookie = document.cookie.split(";");
    for (let i = 0; i < arrayCookie.length; i++) {
        let cookie = arrayCookie[i];
        while(cookie.charAt(0) == ' '){
            cookie = cookie.substring(1);
        }
        if(cookie.indexOf(nombre) == 0){
            return cookie.substring(nombre.length, cookie.length);
        }
    }
    return "";
}

function guardarPuntuacionFinal(usuario, errores){
    let aux = getCookie("aux");
    setCookie("usuario",usuario.textContent);

    if(aux == ""){
        aux = setCookie("aux", 100)
    }else{
        aux = getCookie("aux")
    }

    setCookie("aux",Math.min(aux,errores));
}