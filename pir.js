//?
// pir está desconectado
// reconectá-lo para testar o código

var serverURL = "http://165.227.192.69:1337"; // --> put inside a config or use env var later

const moment = require('moment');
const request = require('request');
const led_module = require('./led_module');

var nobodyTime = 60000; // inicial 720 000 ms = 12 min | testes 180 000 ms = 3 min
var nobodyTimer;

exports.receive = function() {
  //console.log("Estou dentro da função pir.receive");
  led_module.blinkOnce();
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
  postPir();
  console.log("Nobody is home!");
}

// ?
//  two function are to post data to server

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
}
