var contadorClicks = 0;
var cont = document.getElementById("contador");
var errores = document.getElementById("errores");
var cartasSeleccionadas = new Array();
let cartas = document.querySelectorAll(".carta");
var imagen;

//creamos el array de cartas
let opciones = ["bart", "lisa", "bart", "maggie", "maggie", "homer", "flanders", "lisa", "flanders", "marge", "marge", "homer"];
let arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });

//ponemos el idioma, si ya hay almacenado uno, sino por defecto español
if (localStorage.getItem("idioma") != null) {
    cambiaTexto(localStorage.getItem("idioma"));
} else {
    cambiaTexto("esp");
}

for (let i = 0; i < arrayOpciones.length; i++) {
    cartas[i].setAttribute("name", arrayOpciones[i]);
}
//DATOS USUARIO
do {
    usuario = prompt("Introduce tu nombre de usuario",)
} while (usuario === "" || usuario == null)
let etiquetaUsuario = document.getElementById("usuario").innerHTML = usuario;

//Top player
let filaError = document.getElementById("jugadorTopFilaError")
let jugadorTop = document.getElementById("jugadorTop")

if (localStorage.getItem("errores") != null && localStorage.getItem("usuario") != null) {
    filaError.innerHTML = localStorage.getItem("errores")
    jugadorTop.innerHTML = localStorage.getItem("usuario")
}


//añade a cada div carta el evento
for (carta of cartas) {
    carta.addEventListener("click", mostrarImagenes);
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
        carta.removeEventListener("click", mostrarImagenes);
        if (contadorClicks == 2) {
            contadorClicks = 0;
            setTimeout(() => {
                deseleccionar(cartasSeleccionadas);
            }, 500);


        }
    }

}

function deseleccionar(cartas) {
    if (comprobarIguales(cartas)) {
        cartas.forEach(element => {
            element.removeEventListener("click", mostrarImagenes);
        });

    } else {
        cartas.forEach(element => {
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

let barraInformativa = document.getElementById("barra_informativa");

function comprobarIguales(arraySeleccionados) {
    if (arraySeleccionados[0].getAttribute("name") == arraySeleccionados[1].getAttribute("name")) {
        arraySeleccionados.forEach(element => {
            element.style.border = "3px solid green"
            barraInformativa.innerHTML = "¡Has acertado!";

        });

        checkTotal()

        return true;
    } else {
        barraInformativa.innerHTML = "¡Has fallado!";
        sumarErrores();
        return false
    }
}

function checkTotal() {
    contParsed = parseInt(cont.textContent, 10)
    contParsed++
    cont.innerHTML = contParsed;
    if (contParsed == 6) {
        guardarPuntuacionFinal(this.usuario, errores.textContent);
        alert(`Ganaste!! con ${errores.textContent} errores`)
        window.location.reload();
    }
}

function sumarErrores() {
    errorParsed = parseInt(errores.textContent, 10)
    errorParsed++
    errores.innerHTML = errorParsed;
}
function guardarPuntuacionFinal(usuario, errores) {
    let aux = localStorage.getItem("errores")


    if (aux == null) {
        aux = localStorage.setItem("errores", 100)
    }

    if (errores < aux) {
        localStorage.setItem("usuario", usuario);
    }
    localStorage.setItem("errores", Math.min(localStorage.getItem("errores"), errores));
}


/* COOKIES */
function setCookie(nombreCookie, valorCookie, expiraDia = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (expiraDia * 24 * 60 * 60 * 1000))
    let expiracion = `expira=${date.toUTCString()}`;
    document.cookie = `${nombreCookie}=${valorCookie}; ${expiracion};`;
}

function getCookie(nombreCookie) {
    let nombre = nombreCookie + "=";
    let arrayCookie = document.cookie.split(";");
    for (let i = 0; i < arrayCookie.length; i++) {
        let cookie = arrayCookie[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nombre) == 0) {
            return cookie.substring(nombre.length, cookie.length);
        }
    }
    return "";
}

//Idioma
let btnsIdiomas = document.getElementsByClassName("idioma");
Array.from(btnsIdiomas).forEach(element => {
    element.addEventListener("click", cambiaIdioma);
});

function cambiaIdioma(evt) {
    let idiomaClick = evt.target.id;
    if (localStorage.getItem("idioma") == idiomaClick) {
        return;
    } else {
        if (idiomaClick == "eng") {
            localStorage.setItem("idioma", "eng");
            cambiaTexto("eng");
            evt.target.style.fontWeight = "bold";
            document.getElementById("esp").style.fontWeight = "normal";
        } else {
            localStorage.setItem("idioma", "esp");
            cambiaTexto("esp");
            evt.target.style.fontWeight = "bold";
            document.getElementById("eng").style.fontWeight = "normal";
        }
    }
}
function cambiaTexto(idioma) {
    if (idioma == "eng") {
        document.getElementById("estadisticas").innerHTML = "Stadistics";
        document.getElementById("tagPuntuacion").innerHTML = "Score";
        document.getElementById("tagErrores").innerHTML = "Errors";
        document.getElementById("tagErroresTop").innerHTML = "Errors";
        document.getElementById("leng").innerHTML = "Language";

        document.getElementById("tagDesc").innerHTML = "Description";
    } else {
        document.getElementById("estadisticas").innerHTML = "Estadisticas";
        document.getElementById("tagPuntuacion").innerHTML = "Puntuacion";
        document.getElementById("tagErrores").innerHTML = "Errores";
        document.getElementById("tagErroresTop").innerHTML = "Errores";
        document.getElementById("leng").innerHTML = "Lenguaje";

        document.getElementById("tagDesc").innerHTML = "Descripcion";
    }

}


