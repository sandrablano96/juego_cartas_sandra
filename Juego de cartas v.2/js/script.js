let contadorClicks = 0;
const cont = $("#contador");
const errores = $("#errores");
let cartasSeleccionadas = new Array();
const cartas = $(".carta");
let imagen;
let win, matchmsg, errormsg;

const opciones = ["bart", "lisa", "bart", "maggie", "maggie", "homer", "flanders", "lisa", "flanders", "marge", "marge", "homer"];
//crear funcion init que al cargar el doc carge el xml y el idioma segun la cookie
//creamos el array de cartas
const arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });

window.onload = function init() {

    if (localStorage.getItem("idioma") != null) {
        cambiarIdiomaJSON(localStorage.getItem("idioma"));
        
    } else {
        cambiarIdiomaJSON("esp");
    }
}

for (let i = 0; i < arrayOpciones.length; i++) {
    cartas[i].setAttribute("name", arrayOpciones[i]);
}
//DATOS USUARIO
let usuario;
do {
    usuario = prompt("Introduce tu nombre de usuario",)
} while (usuario === "" || usuario == null)
    $("usuario").html(usuario);

//Top player
const filaError = $("#jugadorTopFilaError");
const jugadorTop = $("#jugadorTop");

if (localStorage.getItem("errores") != null && localStorage.getItem("usuario") != null) {
    $(filaError).html(localStorage.getItem("errores"))
    $(jugadorTop).html(localStorage.getItem("usuario"))
} else{
    aux = localStorage.setItem("errores", 100);
}

//añade a cada div carta el evento
$(".carta").on("click",mostrarImagenes);

function mostrarImagenes(evt) {
    contadorClicks++;
    const carta = evt.target;
    if (carta != null) {
        const idCarta = $(carta).attr("name");
        cartasSeleccionadas.push(carta);
        imagen = document.createElement("img");
        $(imagen).attr("src", "img/" + idCarta + ".png")
        $(carta).children(".carta__imagen").append(imagen);
        $(imagen).attr("alt", idCarta);
        $(carta).addClass("cara-delantera");
        $(carta).off(evt);
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
            $(element).off("click");
        });

    } else {
        cartas.forEach(element => {
            $(element).children().first().empty();
            $(element).on("click",mostrarImagenes);
            $(element).removeClass("cara-delantera");
        });
    };

    cartasSeleccionadas = [];
}

const barraInformativa = $("#barra_informativa");

function comprobarIguales(arraySeleccionados) {
    if ($(arraySeleccionados[0]).attr("name") == $(arraySeleccionados[1]).attr("name")) {
        arraySeleccionados.forEach(element => {
            $(element).addClass("correcta");
            $(barraInformativa).html(matchmsg);
        });

        checkTotal()

        return true;
    } else {
        sumarErrores();
        $(barraInformativa).html(errormsg);
        return false;
    }
}

function checkTotal() {
    contParsed = parseInt($(cont).text(), 10)
    contParsed++
    $(cont).html(contParsed);
    if (contParsed == 6) {
        guardarPuntuacionFinal(this.usuario, errores.textContent);
        alert(win)
        window.location.reload();
    }
}

function sumarErrores() {
    errorParsed = parseInt($(errores).text(), 10)
    errorParsed++
    $(errores).html(errorParsed);
}

function guardarPuntuacionFinal(usuario, errores) {
    let aux = localStorage.getItem("errores")

    if (aux != null && errores < aux) {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("errores", errores);
        
    } 
}

//Idioma
$(".idioma").on("click",cambiaIdioma);

function cambiaIdioma() {
    let idiomaClick = $(this).attr("id");
    if (localStorage.getItem("idioma") == idiomaClick) {
        return;
    } else {
        if (idiomaClick == "eng") {
            localStorage.setItem("idioma", "eng");
            cambiarIdiomaJSON("eng");
            $(this).css("fontWeight", "bold");
            $("#esp").css("fontWeight", "normal" );
        } else {
            localStorage.setItem("idioma", "esp");
            cambiarIdiomaJSON("esp");
            $(this).css("fontWeight", "bold");
            $("#eng").css("fontWeight", "normal" );
        }
    }
}

function cambiarIdiomaJSON(idioma){
    const xmlhttp = new XMLHttpRequest();
    const url = "lang.json";

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const myArr = JSON.parse(this.responseText);
            cambiaTexto(myArr, idioma);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function cambiaTexto(arr, idioma) {
            const lenguaje = arr["lang"][idioma];

            $("#estadisticas").html( lenguaje.STADISTICS);

            $("#barra_informativa").html(lenguaje.INFOBAR);

            $("#tagPuntuacion").html(lenguaje.SCORE);

            $("#tagErrores").html(lenguaje.ERRORS);

            $("#tagErroresTop").html(lenguaje.ERRORS);

            $("#tagTop").html(lenguaje.TOPPLAYER);

            matchmsg = lenguaje.MATCHMESSAGE;

            errormsg = lenguaje.ERRORMESSAGE;

            $("#tagDesc").html(lenguaje.DESC);

            win = lenguaje.WIN;

            $("#tagDescCompleta").html(lenguaje.DESCRIPTION);

            $("#leng").html(idioma);
    }
    
}




