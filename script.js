var alto = 600;
var ancho = 600;

var tamanoCelula = Math.floor(ancho / numCelulas);
var temporizador;
var frecuencia = 10;
var periodo = 1000 / frecuencia;

var celulaViva = 'grey';
var celulaMuerta = 'black';

var min = 0;
var max = numCelulas;
function getRandom() {
    return Math.floor(Math.random() * (max - min)) + min;
}

var c = document.getElementById("lienzo");
var c2 = document.getElementById("lienzo2");
var contexto = c.getContext("2d");
var contextoInfo = c2.getContext("2d");

var audio = document.getElementById('musica');

var iniciado = false, pausado = true, reseteado = true, mundoRandom = false;

var pasosSimulados = document.getElementById("pasosSimulados");
var velocidadSimulacion = document.getElementById("velocidadSimulacion");

var mundo = new Mundo();
mundo.iniciar();

c.addEventListener("mousemove", mouseFunc, true);
c.addEventListener("mousemove", mouseFunc, true);
c.addEventListener("mouseout", mouseFunc, true);
c.addEventListener("click", mouseFunc, true);

function mouseFunc(e) {
    var info = "La célula (X,Y) lleva viva XXXX pasos";
    var dimensionCanvas = this.getBoundingClientRect();
    var posX = e.clientX - dimensionCanvas.left;
    var posY = e.clientY - dimensionCanvas.top;
    var coordX = Math.floor(posX / tamanoCelula);
    var coordY = Math.floor(posY / tamanoCelula);
    switch (e.type) {
        case "mousemove":
            if (coordX >= 0 && coordX < numCelulas && coordY >= 0 && coordY < numCelulas) {
                info = mundo.mundoActual[coordX][coordY].info();
            } else {
                info = "Fuera de límites";
            }
            break;
        case 'mouseover':
            if (coordX >= 0 && coordX < numCelulas && coordY >= 0 && coordY < numCelulas) {
                info = mundo.mundoActual[coordX][coordY].info();
            } else {
                info = "Fuera de límites";
            }
            break
        case "mouseout":
            info = "Fuera de límites";
            break;
        case "click":
            if (coordX >= 0 && coordX < numCelulas && coordY >= 0 && coordY < numCelulas && !iniciado) {
                mundo.actualizarCelulas(coordX, coordY);
            }
            break;
    }
    contextoInfo.clearRect(0, 0, 600, 100);
    contextoInfo.fillStyle = celulaViva;
    contextoInfo.fillText(info, 10, 30);
}

function boton(tipo, parrafo) {
    switch (tipo) {
        case "iniciar":
            reseteado = false;
            pausado = false;
            audio.play();
            iniciar();
            texto = "Simulación en marcha";
            break;
        case "pausar":
            if (!reseteado) {
                pausado = true;
                audio.pause();
                pausar();
                texto = "Simulación pausada";
            }
            break;
        case "reset":
            if (pausado) {
                reseteado = true;
                iniciado = false;
                pausado = true;
                mundoRandom = false;
                frecuencia = 10;
                periodo = 1000 / frecuencia;
                contadorVelocidad = 0;
                auxContador = 0;
                velocidadSimulacion.innerHTML = "Velocidad por defecto";
                audio.pause();
                audio.currentTime = 0;
                resetear();
                texto = "Simulación por defecto, pulse 'Iniciar' para empezar";
            }
            break;
        case "random":
            if (reseteado) {
                reseteado = false;
                pausado = true;
                random();
                texto = "Simulación Random, pulse 'Iniciar' para empezar";
            }
            break;
        case "paso":
            if (reseteado || pausado) {
                pausado = true;
                reseteado = false;
                paso();
                texto = "Simulación pausada";
            }
            break;
    }
    parrafo.innerHTML = texto;
}
function iniciar() {
    if (!iniciado){}
        temporizador = setInterval(actualizado, periodo);

    iniciado = true;
}
function pausar() {
    if (iniciado)
        clearInterval(temporizador);

    iniciado = false;
}
function resetear() {
    mundo.iniciar();
    pasosSimulados.innerHTML = "El juego se encuentra en el paso: " + mundo.pasoMundo.toString();
}
function random() {
    if (mundoRandom == false) {
        for (var i = 0; i < (numCelulas * numCelulas / 3); i++) {
            aleatorio1 = Math.floor(getRandom());
            aleatorio2 = Math.floor(getRandom());
            mundo.actualizarCelulas(aleatorio1, aleatorio2);
        }
    }
    mundoRandom = true;
}
function paso() {
    actualizado();
}

var contadorVelocidad = 0;
var auxContador = 0;

function velocidad(tipo) {
    switch (tipo) {
        case "subir":
            if ((frecuencia + 2.5) <= 17.5 && (frecuencia + 2.5) >= 2.5) {
                frecuencia += 2.5;
                periodo = 1000 / frecuencia;
                if (iniciado) {
                    clearInterval(temporizador);
                    temporizador = setInterval(actualizado, periodo);
                }
                if(periodo == 100){
                    velocidadSimulacion.innerHTML = "Velocidad por defecto";
                    contadorVelocidad = 0;
                }
                else{
                    contadorVelocidad++;
                    if(contadorVelocidad == 0)
                        contadorVelocidad++;
                    
                    if(contadorVelocidad < 0){
                        auxContador = contadorVelocidad * -1;
                        velocidadSimulacion.innerHTML = "Velocidad reducida (x" + auxContador + ")";
                    }else{
                        auxContador = contadorVelocidad;
                        velocidadSimulacion.innerHTML = "Velocidad aumentada (x" + auxContador + ")";
                    }
                }
            }
            break;
        case "bajar":
            if ((frecuencia - 2.5) <= 17.5 && (frecuencia - 2.5) >= 2.5) {
                frecuencia -= 2.5;
                periodo = 1000 / frecuencia;
                if (iniciado) {
                    clearInterval(temporizador);
                    temporizador = setInterval(actualizado, periodo);
                }
                if(periodo == 100){
                    velocidadSimulacion.innerHTML = "Velocidad por defecto";
                    contadorVelocidad = 0;
                }
                else{
                    contadorVelocidad--;
                    if(contadorVelocidad == 0)
                        contadorVelocidad--;
                    
                    if(contadorVelocidad < 0){
                        auxContador = contadorVelocidad * -1;
                        velocidadSimulacion.innerHTML = "Velocidad reducida (x" + auxContador + ")";
                    }else{
                        auxContador = contadorVelocidad;
                        velocidadSimulacion.innerHTML = "Velocidad aumentada (x" + auxContador + ")";
                    }
                }
            }
            break;
    }
}

function actualizado() {
    var estadosSiguientes = [];
    for (var x = 0; x < numCelulas; x++) {
        estadosSiguientes[x] = [];
        for (var y = 0; y < numCelulas; y++) {
            var celula = mundo.mundoActual[x][y];
            celula.pasoCelula++;
            var contador = mundo.celulasVecinas(x, y);
            if (celula.estado && (contador < 2 || contador > 3)) {
                estadosSiguientes[x][y] = !celula.estado;
                celula.pasoCelula = 1;
            } else if (!celula.estado && (contador == 3)) {
                estadosSiguientes[x][y] = !celula.estado;
                celula.pasoCelula = 1;
            } else
                estadosSiguientes[x][y] = celula.estado;

        }
    }
    for (var i = 0; i < numCelulas; i++) {
        for (var j = 0; j < numCelulas; j++) {
            mundo.mundoActual[i][j].estado = estadosSiguientes[i][j];
        }
    }
    mundo.pasoMundo++;
    mundo.dibujarMundo();

    pasosSimulados.innerHTML = "El juego se encuentra en el paso: " + mundo.pasoMundo.toString();
}
;

function Celula(x, y) {
    this.posX = x;
    this.posY = y;
    // estado indica si esta viva (true) o muerta (false)
    this.estado = false;
    // paso lleva el recuento de los pasos que lleva esa celula en el mundo durante la simulacion
    this.pasoCelula = 0;

    this.info = function () {
        var texto = "";
        if (this.estado)
            texto = "La célula en posición (" + this.posX.toString() + ", " + this.posY.toString() + ") lleva viva: " + this.pasoCelula.toString() + " pasos";
        else if (!this.estado)
            texto = "La célula en posición (" + this.posX.toString() + ", " + this.posY.toString() + ") lleva muerta: " + this.pasoCelula.toString() + " pasos";

        return texto;
    };
}
function dibujarCelula(celula) {
    if (celula.estado)
        contexto.fillStyle = celulaViva;
    else if (!celula.estado)
        contexto.fillStyle = celulaMuerta;

    contexto.fillRect(celula.posX * tamanoCelula + 1, celula.posY * tamanoCelula + 1, tamanoCelula - 2, tamanoCelula - 2);
}

function Mundo() {
    this.pasoMundo = 0;
    this.mundoActual = [];

    this.iniciar = function () {
        for (var x = 0; x < numCelulas; x++) {
            this.mundoActual[x] = [];
            for (var y = 0; y < numCelulas; y++) {
                this.mundoActual[x][y] = new Celula(x, y);
            }
        }
        this.pasoMundo = 0;
        this.dibujarMarco();
    };

    this.dibujarMarco = function () {
        contexto.fillStyle = celulaMuerta;
        contexto.fillRect(0, 0, numCelulas * tamanoCelula, numCelulas * tamanoCelula);
        contexto.strokeStyle = "grey";

        for (var i = 0; i <= numCelulas; i++) {
            contexto.beginPath();
            contexto.moveTo(i * tamanoCelula, 0);
            contexto.lineTo(i * tamanoCelula, numCelulas * tamanoCelula);
            contexto.moveTo(0, i * tamanoCelula);
            contexto.lineTo(numCelulas * tamanoCelula, i * tamanoCelula);
            contexto.stroke();
        }
        contexto.strokeRect(1, 1, numCelulas * tamanoCelula - 1, numCelulas * tamanoCelula - 1);
    };

    this.dibujarMundo = function () {
        for (var x = 0; x < numCelulas; x++) {
            for (var y = 0; y < numCelulas; y++) {
                celula = this.mundoActual[x][y];
                dibujarCelula(celula);
            }
        }
    };

    this.actualizarCelulas = function (x, y) {
        celula = this.mundoActual[x][y];
        celula.estado = !celula.estado;
        celula.pasoCelula = 1;
        dibujarCelula(celula);
    };

    this.celulasVecinas = function (x, y) {
        var contador = 0;
        var xAnterior = x - 1;
        var xSiguiente = x + 1;
        var yAnterior = y - 1;
        var ySiguiente = y + 1;

        if (xAnterior == -1)
            xAnterior = numCelulas - 1;
        if (xSiguiente == numCelulas)
            xSiguiente = 0;
        if (yAnterior == -1)
            yAnterior = numCelulas - 1;
        if (ySiguiente == numCelulas)
            ySiguiente = 0;

        var vecinas = [
            this.mundoActual[xAnterior][yAnterior].estado,
            this.mundoActual[x][yAnterior].estado,
            this.mundoActual[xSiguiente][yAnterior].estado,
            this.mundoActual[xAnterior][y].estado,
            this.mundoActual[xSiguiente][y].estado,
            this.mundoActual[xAnterior][ySiguiente].estado,
            this.mundoActual[x][ySiguiente].estado,
            this.mundoActual[xSiguiente][ySiguiente].estado
        ];

        for (var i = 0; i < 8; i++) {
            if (vecinas[i])
                contador++;
        }
        return contador;
    };
}
