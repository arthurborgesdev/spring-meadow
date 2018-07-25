//?
// pir está desconectado
// reconectá-lo para testar o código

var serverURL = "http://165.227.192.69:1337"; // --> put inside a config or use env var later

const moment = require('moment');
const request = require('request');
const led_module = require('./led_module');

var nobodyTime = 60000; // inicial 720 000 ms = 12 min | testes 180 000 ms = 3 min
var nobodyTimer; // aparece inicialmente como undefined

/* JEITO 1 de fazer

 Aqui a função é chamada com o led_module para piscar uma vez;
 A variável nobodyTimer é declarada fora da função de forma global;
 A variável nobodyTime é declarada fora da função de forma global
 e atribuída a ela o valor de 60000 ms = 1 minuto;

 A primeira vez que a função exports.receive é chamada, a variável
 nobodyTimer é verificada como true. Como não é true da primeira vez
 (undefined), o código segue adiante e é atribuída a ela o intervalo
 setInterval(nobodyAlert, nobodyTime). Isso significa que um intervalo
 de nobodyTime (1 minuto) é setado para a variável nobodyTimer, disparando
 a função nobodyAlert quando o tempo (1 min) se esgotar;

 A função nobodyAlert faz um post ao servidor, avisando o estado do sensor
 PIR.
li
 ?
  uma parte do código zera com clearTimeout, e outra seta com setInterval...
  as duas funções são incompatíveis.
 solve
  mudar isso no jeito 2 de fazer e testar
exports.receive = function() {
  //console.log("Estou dentro da função pir.receive");
  led_module.blinkOnce();
  /*
  //console.log(nobodyTimer);  // debug why timer not fired

  if(nobodyTimer) {
    clearTimeout(nobodyTimer); // zera o timer caso PIR acionar de novo
  }
  // fires when people isn't in room after specified time
  nobodyTimer = setInterval(nobodyAlert, nobodyTime);
}

var nobodyAlert = function() {
  // Implementar aqui a função de mandar post pro server
  // aparentemente está implementada
  //postPir();
  console.log("Nobody is home!");
}
*/

// JEITO 2 de Fazer

exports.receive = function() {
  /*
  li
   provavelmente vai dar erro dessa função acionar mais de uma
   vez devido a interrupções do pir (todo nível baixo ele vai acionar)

   mas se isso ocorrer, o clearTimeout vai disparar, zerando o timer existente
   de menos de 1 minuto (ou de  < da quantidade setada com timer)
  */

  // se o timer existir, zere-o
  console.log(nobodyTimer); // aqui loga normalmente
  if(nobodyTimer) {
    clearTimeout(nobodyTimer); // zera o timer caso PIR acionar de novo
  }
  console.log(nobodyTimer); // aqui loga timer zerado... aparentemente as
  // variaveis são zeradas toda vez que pir.receive é chamado...
  
  // to debug why the nobodyAlert didnt fired
  // Logs Timeout object without modification of args.
  // crie o timer ou recrie-o com o nobodyTime passado como parâmetro
  // fires when people isn't in room after specified time
  nobodyTimer = setTimeout(nobodyAlert, nobodyTime);
}

var nobodyAlert = function() {
  //postPir();
  console.log("Nobody is home!");
}


// ?
//  two function are to post data to server
/*
function postPir() {
  var pirForm = {
    time_iso: moment().format(),
    owner_id: process.env.RESIN_DEVICE_NAME_AT_INIT,
    msgtype: "nobodyAlert",
    state: true
  };
  request.post({
    //url: serverURL + '/data',
    url: "https://energizei-server.herokuapp.com/weather",
    form: pirForm
  }, pirResponse)
  .on('error', function(e) {
    console.log(e);
  });
}

function pirResponse (error, response, body) {
  if (error) console.log(error);
  if (response) {
    console.log(response.statusCode);
    if (response.statusCode == 200) {
      console.log(body); // Servidor recebeu o pedido
    }
  }
*/
