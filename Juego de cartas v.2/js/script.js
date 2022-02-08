let contadorClicks = 0;
const cont = $("#contador");
const errores = $("#errores");
let cartasSeleccionadas = new Array();
const cartas = $(".carta");
const usuario = $("#nick").val();
const mostrarAyuda = $("#mostrar");
let imagen;
let win, matchmsg, errormsg;
let audio = new Audio();
const opciones = ["bart", "abuelo", "lisa", "bart", "maggie", "bomba", "maggie", "homer", "flanders", "lisa", "flanders", "marge", "marge", "homer", "abuelo"];
const botonInicio = $("#botonInicio");

//Top player
const filaError = $("#jugadorTopFilaError");
const jugadorTop = $("#jugadorTop");

const barraInformativa = $("#barra_informativa");

window.onload = function init() {

    $(botonInicio).html('<i class="fas fa-play"></i>');


    if (localStorage.getItem("idioma") != null) {
        cambiarIdiomaJSON(localStorage.getItem("idioma"));

    } else {
        cambiarIdiomaJSON("esp");
    }
    if (localStorage.getItem("errores") != null && localStorage.getItem("usuario") != null) {
        $(filaError).html(localStorage.getItem("errores"))
        $(jugadorTop).html(localStorage.getItem("usuario"))
    } else {
        aux = localStorage.setItem("errores", 100);
    }
    $(".carta").addClass("prevent-click");
    $("#mostrar").addClass("prevent-click");

}

$("#comenzar").click(function () {
    if (usuario == "") {
        return;
    }
    $("#usuario").html(usuario);
    $(errores).html(0);
    barajar();
    $(".modal").modal('hide');
    $("#mostrar").removeClass("prevent-click");
    comprobarDificultad();
});

function barajar() {
    if ($(cartas).attr("name") != null) {
        $(cartas).removeAttr("name");
    }
    const arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });
    for (let i = 0; i < arrayOpciones.length; i++) {

        cartas[i].setAttribute("name", arrayOpciones[i]);
    }

    $(".carta").on("click", mostrarImagenes);
    $(".carta").removeClass("prevent-click");

    $(cont).html(0);

}


function mostrarImagenes(evt) {
    contadorClicks++;
    const carta = evt.target;
    $(carta).off("click");
    if (carta != null) {
        const idCarta = $(carta).attr("name");
        imagen = document.createElement("img");
        $(imagen).attr("src", "img/" + idCarta + ".png")
        $(carta).children(".carta__imagen").html(imagen);
        $(imagen).attr("alt", idCarta);
        $(carta).addClass("cara-delantera");
        $("#audio").attr("src", "audio/click.mp3"); 0
        $("#audio")[0].play();
        cartasSeleccionadas.push(carta);
        if (idCarta == "bomba") {
            $("#audio").attr("src", "audio/bomba.mp3");
            $("#audio")[0].play();
            cartasSeleccionadas.splice(0, cartasSeleccionadas.length);
            finDePartida();
            return;
        }

        if (contadorClicks == 2) {
            $(botonInicio).html('<i class="fas fa-undo-alt"></i>');
            contadorClicks = 0;
            setTimeout(() => {
                deseleccionar(cartasSeleccionadas);
            }, 500);
        }
    }
}

function finDePartida() {
    contadorClicks = 0;
    alert("¡BOOM! Vuelve a empezar");
    $(cartas).off("click");
    $(cartas).removeClass("cara-delantera");
    $(cartas).removeClass("correcta");
    $(cartas).each(function (index, element) {
        $(element).children().first().empty();
    });
    $(botonInicio).html('<i class="fas fa-play"></i>');
    $(barraInformativa).html(errormsg);
    $(barraInformativa).removeClass("alert-success");
    $(barraInformativa).addClass("alert-danger");
    $('.progress-bar').css('width', '0%').attr('aria-valuenow', '0');
    barajar();

}

function deseleccionar(cartas) {
    if (comprobarIguales(cartas)) {
        $("#audio").attr("src", "audio/correct.mp3");
        $("#audio")[0].play();
        cartas.forEach(element => {
            $(element).off("click");
            $(element).addClass("correcta");

        });
        $(barraInformativa).removeClass("alert-danger");
        $(barraInformativa).addClass("alert-success");
        let progresoActual = parseInt($(".progress-bar").attr("aria-valuenow")) + 14.28;
        $('.progress-bar').css('width', progresoActual + '%').attr('aria-valuenow', progresoActual);
        $(barraInformativa).html(matchmsg);
        $('.alert').alert();



    } else {
        cartas.forEach(element => {
            $("#audio").attr("src", "audio/fallo.mp3");
            $("#audio")[0].play();
            $(element).children().first().empty();
            $(element).on("click", mostrarImagenes);
            $(element).removeClass("cara-delantera");
            $(barraInformativa).removeClass("alert-success");
            $(barraInformativa).addClass("alert-danger");
            $(barraInformativa).html(errormsg);
            $('.alert').alert();

        });
    };

    cartasSeleccionadas = [];
}


function comprobarIguales(arraySeleccionados) {
    if ($(arraySeleccionados[0]).attr("name") === $(arraySeleccionados[1]).attr("name")) {
        checkTotal();
        return true;
    } else {
        sumarErrores();
        return false;
    }
}

function checkTotal() {
    contParsed = parseInt($(cont).text(), 10)
    contParsed++
    $(cont).html(contParsed);
    if (contParsed == 7) {
        guardarPuntuacionFinal(this.usuario, errores.textContent);
        $(barraInformativa).removeClass("alert-success");
        $(barraInformativa).removeClass("alert-danger");
        $(barraInformativa).addClass("alert-info");
        $(barraInformativa).html(win);
        $('.alert').alert();
        setTimeout(() => {
            window.location.reload();
        }, 500);

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
        $(barraInformativa).html("¡Has ganado con un nuevo record!")
    }
}

//Idioma
$(".idioma").on("click", cambiaIdioma);

function cambiaIdioma() {
    let idiomaClick = $(this).attr("id");
    if (localStorage.getItem("idioma") == idiomaClick) {
        return;
    } else {
        if (idiomaClick == "eng") {
            localStorage.setItem("idioma", "eng");
            cambiarIdiomaJSON("eng");
            $(".btn").css("fontWeight", "bold");
            $(".btn").css("fontWeight", "normal");
        } else {
            localStorage.setItem("idioma", "esp");
            cambiarIdiomaJSON("esp");
            $(this).css("fontWeight", "bold");
            $("#eng").css("fontWeight", "normal");
        }
    }
}

function cambiarIdiomaJSON(idioma) {
    const xmlhttp = new XMLHttpRequest();
    const url = "lang.json";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const myArr = JSON.parse(this.responseText);
            cambiaTexto(myArr, idioma);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function cambiaTexto(arr, idioma) {
        const lenguaje = arr["lang"][idioma];

        $("#estadisticas").html(lenguaje.STADISTICS);

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

function comprobarDificultad() {
    if ($('input[name="dificultad"]:checked').val() == "facil") {
        $(mostrarAyuda).css("display", "block");

        $(mostrarAyuda).on("click", function () {
            $(cartasSeleccionadas).splice(0, cartasSeleccionadas.length);
            $(cartas).each(function (index, element) {
                $(element).addClass("prevent-click")
                $(element).addClass("cara-delantera");
                imagen = document.createElement("img");
                $(imagen).attr("src", "img/" + $(element).attr("name") + ".png")
                $(element).children(".carta__imagen").html(imagen);
            });
            $(cartas).each(function (index, element) {
                setTimeout(() => {
                    if (!$(element).hasClass("correcta")) {
                        $(element).removeClass("cara-delantera");
                        $(element).children().first().empty();
                    }

                }, 2000);
            });
            $(mostrarAyuda).off("click");
            
        });
    } else {
        $(mostrarAyuda).css("display", "none");
    }
}




