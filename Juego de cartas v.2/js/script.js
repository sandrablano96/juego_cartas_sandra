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
        $(filaError).html(localStorage.getItem("errores"));
        $(jugadorTop).html(localStorage.getItem("usuario"));
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
    $( ".carta" ).effect( "bounce", { direction: 'down',times:2}, "slow" );
    $(".modal").modal('hide');
    $("#mostrar").removeClass("prevent-click");
    comprobarDificultad();
});

function barajar() {
    if ($(cartas).data("name") != null) {
        $(cartas).removeData("name");
    }
    const arrayOpciones = opciones.sort(function () { return Math.random() - 0.5 });
    for (let i = 0; i < arrayOpciones.length; i++) {
        $(cartas[i]).data("name", arrayOpciones[i]);
        console.log($(cartas[i]).data("name"));
        //cartas[i].setAttribute("name", arrayOpciones[i]);
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
        const idCarta = $(carta).data("name");
        imagen = document.createElement("img");
        $(carta).addClass("cara-delantera",300, callback);
        $(imagen).attr("src", "img/" + idCarta + ".png")
        setTimeout(() => {
            $(carta).children(".carta__imagen").html(imagen);
        }, 350);
        
        $(imagen).attr("alt", idCarta);
        
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
function callback() {
    setTimeout(function() {
      $(carta).removeClass( "cara-delantera" );
    }, 1500 );
  }

function finDePartida() {
    contadorClicks = 0;
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
        $(barraInformativa).html(matchmsg);
        $("#audio").attr("src", "audio/correct.mp3");
        $("#audio")[0].play();
        cartas.forEach(element => {
            $(element).addClass("correcta").effect("highlight", { color: " #1AAE00 " }, "slow");
            $(element).off("click");

        });
        $(barraInformativa).removeClass("alert-danger");
        $(barraInformativa).addClass("alert-success");
        let progresoActual = parseInt($(".progress-bar").attr("aria-valuenow")) + 15;
        $('.progress-bar').css('width', progresoActual + '%').attr('aria-valuenow', progresoActual);
        checkTotal();
        $('.alert').alert();
        
    } else {
        $(cartas).effect( "shake", "fast");
        $("#audio").attr("src", "audio/fallo.mp3");
        $("#audio")[0].play();
        cartas.forEach(element => {
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
    if ($(arraySeleccionados[0]).data("name") === $(arraySeleccionados[1]).data("name")) { 
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
        $(barraInformativa).html(win);
        if(parseInt($(errores).text(), 10) < localStorage.getItem("errores")){
            $(barraInformativa).html("Nuevo record!");
        
        guardarPuntuacionFinal(usuario,  parseInt($(errores).text(), 10));
        $(barraInformativa).removeClass("alert-success");
        $(barraInformativa).removeClass("alert-danger");
        $(barraInformativa).addClass("alert-info");
        
        setTimeout(() => {
            window.location.reload();
        }, 10000);
        
    }
        
    }
}

function sumarErrores() {
    errorParsed = parseInt($(errores).text(), 10)
    errorParsed++
    $(errores).html(errorParsed);
}

function guardarPuntuacionFinal(usuario, errores) {

    if (errores < localStorage.getItem("errores") || localStorage.getItem("errores") == null) {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("errores", errores);
        

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

        $("#modalNickLabel").html(lenguaje.NICK);

        $("label[for*='facil']").html(lenguaje.LEVEL.easy);

        $("label[for*='normal']").html(lenguaje.LEVEL.normal);

        $("label[for*='dificil']").html(lenguaje.LEVEL.hard);
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
                $(imagen).attr("src", "img/" + $(element).data("name") + ".png")
                $(element).children(".carta__imagen").html(imagen);
            });
            $(cartas).each(function (index, element) {
                setTimeout(() => {
                    if (!$(element).hasClass("correcta")) {
                        $(element).removeClass("cara-delantera");
                        $(element).children().first().empty();
                        $(element).removeClass("prevent-click");
                    }

                }, 2000);
            });
            $(mostrarAyuda).off("click");
            
        });
    } else {
        $(mostrarAyuda).css("display", "none");
    }
}




