
var contadorClicks = 0;
var cont = document.getElementById("contador");
var errores = document.getElementById("errores");
var cartasSeleccionadas = new Array();
let cartas = document.querySelectorAll(".carta");
var imagen;
let win, matchmsg, errormsg;

let opciones = ["bart", "lisa", "bart", "maggie", "maggie", "homer", "flanders", "lisa", "flanders", "marge", "marge", "homer"];
//crear funcion init que al cargar el doc carge el xml y el idioma segun la cookie
//creamos el array de cartas

function init() {

    if (localStorage.getItem("idioma") != null) {
        cargarIdiomas(localStorage.getItem("idioma"));
        cambiaDescripcion(localStorage.getItem("idioma"));
    } else {
        cargarIdiomas("esp");
        cambiaDescripcio("esp");
    }
}

init();

var arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });

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
        let idCarta = carta.getAttribute("name");
        cartasSeleccionadas.push(carta);
        imagen = document.createElement("img");
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
            element.style.boxShadow = "9px 7px 2px -6px #1AAE00";
            barraInformativa.innerHTML = matchmsg;
        });

        checkTotal()

        return true;
    } else {
        barraInformativa.innerHTML = errormsg;
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
        alert(win)
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
    element.addEventListener("click", cambiaDescripcion);
});

function cambiaIdioma(evt) {
    let idiomaClick = evt.target.id;
    if (localStorage.getItem("idioma") == idiomaClick) {
        return;
    } else {
        if (idiomaClick == "eng") {
            localStorage.setItem("idioma", "eng");
            cargarIdiomas("eng");
            cambiaDescripcion("eng");
            evt.target.style.fontWeight = "bold";
            document.getElementById("esp").style.fontWeight = "normal";
        } else {
            localStorage.setItem("idioma", "esp");
            cargarIdiomas("esp");
            cambiaDescripcion("esp");
            evt.target.style.fontWeight = "bold";
            document.getElementById("eng").style.fontWeight = "normal";
        }
    }
}

function cambiaDescripcion(leng) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("tagDescCompleta").innerHTML = this.responseText;
        }
    };
    if (leng == "eng") {
        xhr.open("GET", "../descripcion_en.txt", true);
        // .send: envía la solicitud al servidor.
        //    Si utilizamos POST debemos pasar los datos por parámetro 
    } else {
        xhr.open("GET", "../descripcion_es.txt", true);
    }

    xhr.send();

}


function cargarIdiomas(idioma) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cargarXML(this, idioma);
        }
    };
    xhr.open("GET", "../idioma.xml", true);
    xhr.send();
}

function cargarXML(xml, leng) {
    var docXML = xml.responseXML;
    let childN, esta, score, errors, topplayer, desc;
    if (leng == "eng") {
        childN = 0;
    }
    else {
        childN = 1;
    }
    document.getElementById("estadisticas").innerHTML = docXML.getElementsByTagName("STADISTICS")[childN].textContent;

    document.getElementById("barra_informativa").innerHTML = docXML.getElementsByTagName("INFOBAR")[childN].textContent;

    document.getElementById("tagPuntuacion").innerHTML = docXML.getElementsByTagName("SCORE")[childN].textContent;

    document.getElementById("tagErrores").innerHTML = docXML.getElementsByTagName("ERRORS")[childN].textContent;

    document.getElementById("tagErroresTop").innerHTML = docXML.getElementsByTagName("ERRORS")[childN].textContent;

    document.getElementById("tagTop").innerHTML = docXML.getElementsByTagName("TOPPLAYER")[childN].textContent;

    matchmsg = docXML.getElementsByTagName("MATCHMESSAGE")[childN].textContent;

    errormsg = docXML.getElementsByTagName("ERRORMESSAGE")[childN].textContent;

    document.getElementById("tagDesc").innerHTML = docXML.getElementsByTagName("DESC")[childN].textContent;

    win = docXML.getElementsByTagName("WIN")[childN].textContent;
    document.getElementById("leng").innerHTML = leng;


}



