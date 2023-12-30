/*var arrayData = new Array();
var archivoTxt = new XMLHttpsRequest();
var fileRuta = 'index.txt';
archivoTxt.open("GET", fileRuta, false);
archivoTxt.send(null);
var txt = archivoTxt.responseText;
for (var i= 0; i<txt,kength; i++)
{
  arrayData.push(txt[i]);
}
arrayData.forEach(function(data){console.log(data)});*/


var contenedor;
var time;
var deltaTime = 0;
var score = 0;
var hamburguesas = 0;
var zanahoria=0;
var cereza=0;
var textoScore;
var textohamburguesa;
var gameOver;
var saltando = false;
var parado = false;
var impulso = 650;
var gravedad = 2500;
var suelo;
var sueloX=0;
var sueloY=27;
var velEscenario = 1280/3;
var velY = 0;
var gameVel = 1;
var cerdo;
var cerdoPosX= 42;
var cerdoPosY = sueloY;
var obstaculos = [];
var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var tiempoHastahamburguesa = 3;
var tiempohamburguesaMin = 0.9;
var tiempohamburguesaMax = 3.5;
var hamburguesaMinY = 20;
var hamburguesaMaxY = 100;
var tiempoHastazanahoria = 4;
var tiempozanahoriaMin = 0.14;
var tiempozanahoriaMax = 4.5;
var zanahoriaMinY = 20;
var zanahoriaMaxY = 100;
var tiempoHastacereza = 5;
var tiempocerezaMin = 0.20;
var tiempocerezaMax = 5.5;
var cerezaMinY = 20;
var cerezaMaxY = 100;
var interactuables = [];
var nombre=[];

var saltarAudio;
var muerteAudio;
var comida1Audio;
var comida2Audio;
var comida3Audio;
var fondoAudio;
//cabra
var tiempoCabraHastaObstaculo = 8;
var tiempoCabraObstaculoMin = 6;
var tiempoCabraObstaculoMax = 12;
var obstaculoCabraPosY = 16;
var colisionRegistrada;
var vidas = 4;
var detecto=0;

/*let saltarAudio = new Audio('./sound/salto.wav');
let muerteAudio = new Audio('./sound/muerte.wav');
let comida1Audio = new Audio('./sound/comida1.wav');
let comida2Audio = new Audio('./sound/comida2.wav');
let comida3Audio = new Audio('./sound/comida3.wav');
let fondoAudio = new Audio('./sound/fondo.wav');
*/
if(document.readyState === "complete" || document.readyState === "interactive")
{
  setTimeout(Init,1);
}
else
{
  document.addEventListener("DOMContentLoaded", Init);
}

function Init()
{
  time = new Date();
  start();
  Loop();
}

function Loop()
{
 
  deltaTime = (new Date() - time) /1000;
  time = new Date();
  /*fondoAudio.play();*/
  update();
 
  requestAnimationFrame(Loop);
 
}

function start()
{
  gameOver = document.querySelector(".game-over");
  suelo = document.querySelector(".suelo");
  contenedor = document.querySelector(".contenedor");
  textoScore = document.querySelector(".score");
  textovida = document.querySelector(".vida");
  textohamburguesa = document.querySelector(".cash");
  textozanahoria = document.querySelector(".cash2");
  textocereza = document.querySelector(".cash3");
  textonombre = document.querySelector(".name");
  cerdo = document.querySelector(".cerdo");
  document.addEventListener("keydown", handleKeyDown);
  cuadro_ranking = document.querySelector(".cuadro_ranking")
  document.addEventListener("enter", enter);
 /* saltarAudio = document.querySelector(".audio-salto");
  muerteAudio = new Audio('./sound/muerte.wav');
  comida1Audio = new Audio('./sound/comida1.wav');
  comida2Audio = new Audio('./sound/comida2.wav');
  comida3Audio = new Audio('./sound/comida3.wav');
  //fondoAudio = new Audio('./sound/fondo.wav');
  fondoAudio =  document.querySelector(".fondoAudio");*/
  
}

function update()
{
  
  if(parado) return;
  moverCerdo();
  moverSuelo();
  decidirCrearObstaculos();
  decidirCrearObstaculosCabra();
  moverObstaculo();
  DecidirCrearhamburguesas();
  DecidirCrearzanahoria();
  DecidirCrearcereza(); 
  MoverInteractuables();
  detectarColisionhamburguesas();  
  detectarColision();
  
  velY -= gravedad * deltaTime;
}

function handleKeyDown(ev)
{
  if(ev.keyCode==32)
  {
    saltar();
  }
}
function enter(ev)
{
  if(ev.keyCode==12)
  {
    update();
  }
}
function saltar()
{
  if(cerdoPosY === sueloY)
  {
    saltando=true;
    velY=impulso;
    /*saltarAudio = 0;
    saltarAudio.play();*/
    cerdo.classList.remove("cerdoMovement");
    
  }
}

function moverCerdo()
{
  cerdoPosY+=velY*deltaTime;
  if(cerdoPosY<sueloY)
  {
    tocarSuelo();
  }
  cerdo.style.bottom = cerdoPosY+"px";
}

function moverSuelo()
{
  
  sueloX += calcularDesplazamiento();
  suelo.style.left = -(sueloX % contenedor.clientWidth)+"px";
}

function calcularDesplazamiento()
{
  return velEscenario * deltaTime * gameVel;
}


function estrellarse()
{
  cerdo.classList.remove("cerdoMovement");
  cerdo.classList.add("cerdoMuerte");
  /*muerteAudio.play();*/
  parado=true;
}

function tocarSuelo()
{
  cerdoPosY=sueloY;
  velY=0;
  if(saltando)
  {
    cerdo.classList.add("cerdoMovement");
  }
  saltando=false;
}

function decidirCrearObstaculos()
{
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo<=0)
    {
      crearObstaculo();
    }
}
function decidirCrearObstaculosCabra()
{
    tiempoCabraHastaObstaculo -= deltaTime;
    if(tiempoCabraHastaObstaculo<=0)
    {
      crearObstaculoCabra();
    }
}

function DecidirCrearhamburguesas() {
  tiempoHastahamburguesa -= deltaTime;
  if(tiempoHastahamburguesa <= 0) {
      Crearhamburguesa();
  }
}
function Crearhamburguesa() {
  var hamburguesa = document.createElement("div");
  contenedor.appendChild(hamburguesa);
  hamburguesa.classList.add("hamburguesa");
  hamburguesa.posX = contenedor.clientWidth;
  hamburguesa.style.left = contenedor.clientWidth+"px";
  hamburguesa.style.bottom = hamburguesaMinY + (hamburguesaMaxY - hamburguesaMinY) * Math.random() + "px";

  interactuables.push(hamburguesa);
  tiempoHastahamburguesa = tiempohamburguesaMin + Math.random() * (tiempohamburguesaMax-tiempohamburguesaMin) / gameVel;
}
function DecidirCrearzanahoria() {
  tiempoHastazanahoria -= deltaTime;
  if(tiempoHastazanahoria <= 0) {
      Crearzanahoria();
  }
}
function Crearzanahoria() {
  var zanahoria = document.createElement("div");
  contenedor.appendChild(zanahoria);
  zanahoria.classList.add("zanahoria");
  zanahoria.posX = contenedor.clientWidth;
  zanahoria.style.left = contenedor.clientWidth+"px";
  zanahoria.style.bottom = zanahoriaMinY + (zanahoriaMaxY - zanahoriaMinY) * Math.random() + "px";

  interactuables.push(zanahoria);
  tiempoHastazanahoria = tiempozanahoriaMin + Math.random() * (tiempozanahoriaMax-tiempozanahoriaMin) / gameVel;
}
function DecidirCrearcereza() {
  tiempoHastacereza -= deltaTime;
  if(tiempoHastacereza <= 0) {
      Crearcereza();
  }
}
function Crearcereza() {
  var cereza = document.createElement("div");
  contenedor.appendChild(cereza);
  cereza.classList.add("cereza");
  cereza.posX = contenedor.clientWidth;
  cereza.style.left = contenedor.clientWidth+"px";
  cereza.style.bottom = cerezaMinY + (cerezaMaxY - cerezaMinY) * Math.random() + "px";

  interactuables.push(cereza);
  tiempoHastacereza = tiempocerezaMin + Math.random() * (tiempocerezaMax-tiempocerezaMin) / gameVel;
}
function crearObstaculo()
{
  var obstaculo = document.createElement("div");
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add("puercoespin");  
  if(Math.random() > 0.5); obstaculo.classList.add("puercoespin2"); 
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = contenedor.clientWidth+"px";
  obstaculos.push(obstaculo);
  tiempoHastaObstaculo = tiempoObstaculoMin + Math.random()*(tiempoObstaculoMax-tiempoObstaculoMin)/gameVel;
}
function crearObstaculoCabra()
{
  var obstaculo = document.createElement("div");
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add("cabri");  
  if(Math.random() >0.5); obstaculo.classList.add("cabri");
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = contenedor.clientWidth+"px";
  obstaculos.push(obstaculo);
  tiempoCabraHastaObstaculo = tiempoCabraObstaculoMin + Math.random()*(tiempoCabraObstaculoMax-tiempoCabraObstaculoMin)/gameVel;
}


function moverObstaculo()
{
  for(var i = obstaculos.length-1; i>=0; i--)
  {
    if(obstaculos[i].posX < -obstaculos[i].clientWidth)
    {
      obstaculos[i].parentNode.removeChild(obstaculos[i]);
      obstaculos.splice(i,1);
      ganarPuntos();
    }
    else
    {
      obstaculos[i].posX -= calcularDesplazamiento();
      obstaculos[i].style.left = obstaculos[i].posX+"px"; 
    }
  }
}

function MoverInteractuables() {
  for (var i = interactuables.length - 1; i >= 0; i--) {
      if(interactuables[i].posX < -interactuables[i].clientWidth) {
          interactuables[i].parentNode.removeChild(interactuables[i]);
          interactuables.splice(i, 1);
          
      }else{
          interactuables[i].posX -= calcularDesplazamiento();
          interactuables[i].style.left = interactuables[i].posX+"px";
      }
  }
}

function ganarPuntos()
{
  score++;
  textoScore.innerText = score;
  
  if(score == 1){
    gameVel = 1;
    contenedor.classList.add("mediodia");
  }else if(score == 10) {
    gameVel = 1.3;
    contenedor.classList.add("tarde");
  } else if(score == 20) {
    gameVel = 1.5;
    contenedor.classList.add("noche");
  }
  else if(score == 30) {
  gameVel = 2;
  contenedor.classList.add("infierno")
  }
  suelo.style.animationDuration = (3/gameVel)+"s";/*agregado*/
}

function ganarhamburguesas(){
{
  hamburguesas++;
  textohamburguesa.innerText= hamburguesas;
  }
  suelo.style.animationDuration = (3/gameVel)+"s";/*agregado*/
}
function ganarzanahoria(){
  {
    zanahoria++;
    textozanahoria.innerText= zanahoria;
    }
    suelo.style.animationDuration = (3/gameVel)+"s";/*agregado*/
}
  function ganarcereza(){
    {
      cereza++;
      textocereza.innerText= cereza;
      }
      suelo.style.animationDuration = (3/gameVel)+"s";/*agregado*/
}

function GameOver() {
  /*if (vidas>0){
    vidas--;
    vidas.toString(vidas);
    textovida.innerText= vidas;
    parseInt(vidas);
  }else{
  if (vidas==0)*/
    estrellarse();
    gameOver.style.display = "block";
    /*fondoAudio.pause();*/
}


/*function ranking(){
  {
  nombre=prompt('Ingrese su nombre');
  //textonombre.innerText= nombre;
  document.textonombre= nombre;
  }
  suelo.style.animationDuration = (3/gameVel)+"s";/*agregado*/
/*}
function usuario() {
  nombre=prompt('Ingrese su nombre:');

  localStorage.setItem('Usuario', nombre);
  localStorage.setItem('puntaje', score);
  var nomUsuari = localStorage.getItem('Usuario');
  var resultatEmmagatzemat = localStorage.getItem('puntaje');

  if (nombre == nomUsuari) {
     alert("Hola " + nomUsuari + ", esta es la puntuacion anterior: " + resultatEmmagatzemat + " puntos. " );  
    actualitzar(); 
  }

  for(var i=0, t=localStorage.length; i < t; i++) {   //recorremos con un array los valores guardados en LocalStorage
  nomUsuari = localStorage.nomUsuari[i];
      if (nombre === nomUsuari ){
           alert('usuario: ' + nomUsuari + "tenes" + localStorage.score[i] + "puntos");
      }       
  } 
}

function actualitzar(){
  var missatge = confirm("¿Queres actualizar la puntuacion?");
  if (missatge){
      alert("Se actualizará la nueva puntuacion!");

  }else {
      localStorage.removeItem('puntaje');
  }
} */
function actualizarVidas() {
  textovida.innerText = vidas;
}

// Función para restar una vida
function restarVida() {
  if (vidas > 0) {
    vidas--;
    actualizarVidas(); // Actualiza la cantidad de vidas en pantalla
  }
}
 /* suelo.style.animationDuration = (3/gameVel)+"s"; /*agregado*/

 function detectarColision() {
  for (var i = 0; i < obstaculos.length; i++) {
    if (obstaculos[i].posX > cerdoPosX + cerdo.clientWidth) {
      break;
    } else {
      if (IsCollision(cerdo, obstaculos[i], 10, 30, 15, 20)) {
        eliminarObstaculo(i); // Llama a una función para eliminar el obstáculo
        restarVida(); // Resta una vida si vidas > 0
        if (vidas === 0) {
          GameOver();
        }
      }
    }
  }
}

// Función para eliminar un obstáculo específico
function eliminarObstaculo(index) {
  if (index >= 0 && index < obstaculos.length) {
    obstaculos[index].parentNode.removeChild(obstaculos[index]); // Elimina del DOM
    obstaculos.splice(index, 1); // Elimina de la lista de obstáculos
  }
}








function detectarColisionhamburguesas()
{
  for (var i = 0; i < interactuables.length; i++) {
      
      if(IsCollision(cerdo, interactuables[i], 10, 25, 10, 20)) {
        
          if(interactuables[i].classList.contains("hamburguesa")){
              /*comida1Audio.play();*/
              interactuables[i].parentNode.removeChild(interactuables[i]);
              interactuables.splice(i, 1);
              ganarhamburguesas();
          }else if (interactuables[i].classList.contains("zanahoria")){
              /*comida2Audio.play();*/
              interactuables[i].parentNode.removeChild(interactuables[i]);
              interactuables.splice(i, 1);
              ganarzanahoria();
          } else if (interactuables[i].classList.contains("cereza")){
            /*comida3Audio.play();*/
            interactuables[i].parentNode.removeChild(interactuables[i]);
            interactuables.splice(i, 1);
            ganarcereza();
          } 
        }
      }
}


function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) 
{
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
      ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
      (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
      (aRect.left + paddingLeft > (bRect.left + bRect.width))
  );
}