var serverURL = "http://165.227.192.69:1337"; // --> put inside a config or use env var later
const Gpio = require('pigpio').Gpio;
const carrier = new Gpio(18, {mode: Gpio.OUTPUT});
const transmiter = new Gpio(25, {mode: Gpio.OUTPUT}); // 16 - mk2 e 25 - mk3
const sleep = require('sleep');
const moment = require('moment');
const request = require('request');


//from Desktop
var myString = "11100010100101010001010101010101000111100111";
var testString = "0101";
var ONDry = "111000100110100110110010010000000000000000010010001000000111000000000000000000000000001011";
var heat16 = "111000100110100110110010010000000000000000010010010000000111100000000000000000000000001000";
var auto = "111000100110100110110010010000000000000000010010000010000111000000000000000000000000000000000000000000000000100100";
//auto sent  1110001001101001101100100100000000000000000100100000100001110000000000000000000000000000000000000000000000001001011
//           111000100110100110110010010000000000000000010010000010000111000000000000000000000000000000000000000000000000100101
var auto2 = "111000100110100110110010010000000000000000010010000010000111000000000000000000000000100011";
var testL = "11100010011010011011001001000000000000000001001001110000011100000101000000000000000000000000000000000000000110010";
var heat18 = "11100010011010011011001001000000000000000001001001000000010110000110000000000000000000000000000000000000001010010";
var test2 = "11100111000000011000101";
var fabiocm1 = "1100000000000100000000000000000101111110111111111000000000011001111001100010010011011011011000010001111010000101011110101000000001111111100000000111111110000000011111111000000001111111100000000111111111100101000110101100010110111010000000000111111110000000011111111";
var fanfabio = "1100000000000100000000000000000101111110111111111000000000011001111001100010010011011011011000010001111010011001011001101000000001111111100000000111111110000000011111111000000001111111100000000111111111100110000110011100010110111010000000000111111110000000011111111";

//exportar função pra fazer o post no server na url /action e pegar o código a ser enviado

// ------------- SEND FUNCTION -----------------------
// Função tem que ser imutável (variáveis flags ficam de fora dos módulos)
exports.send = function(commandString) {
  transmiter.digitalWrite(1);
  carrier.hardwarePwmWrite(38000, 900000);
  //transmiter.digitalWrite(1);
  sleep.usleep(3100);
  carrier.hardwarePwmWrite(38000, 0); // transmiter.digitalWrite(0);
  sleep.usleep(400);
  for (var i = 0; i < commandString.length; i++) {
    if (commandString[i] == "0") {
      carrier.hardwarePwmWrite(38000, 0); //transmiter.digitalWrite(0);
      sleep.usleep(300);
      carrier.hardwarePwmWrite(38000, 900000); // transmiter.digitalWrite(1);
      sleep.usleep(400);
    }
    if(commandString[i] == "1") {
      carrier.hardwarePwmWrite(38000, 0); // transmiter.digitalWrite(0);
      sleep.usleep(1000);
      carrier.hardwarePwmWrite(38000, 900000); // transmiter.digitalWrite(1);
      sleep.usleep(400);
    }
  }
  carrier.digitalWrite(0);
  transmiter.digitalWrite(0);
  console.log("acabou");
};
// ------------- SEND FUNCTION ----------------------- //

// ------------- RECEIVE FUNCTION -----------------------

//var deviceCodeArray = [];
// implementar pra mandar somente o último código após um período
// (evitar que o banco salve vários apertos de tecla)
var code = "";
var startTick;

exports.receive = function(level, tick) {
  var endTick;
  var diff;
  if (level == 1) {
    startTick = tick;
  } else {
    endTick = tick;
    diff = (endTick >> 0) - (startTick >> 0);
    if(diff > 40000) {
      if (code.length > 10) {
        // print time so it's easier to grab and past to browser
        console.log(moment().format());
        console.log(code);
        //postCode(code); --> Doing REST saving for now
        // copying code from resin and pasting in browser
        // in a REST api, to update commands of devices
      }
      code = "";
    }
    code += 0 | diff > 800;
  }
  if (diff > 2000) {
    code = "";
  }
};

function postCode(code) {
  var requestForm = {
    time_iso: moment().format(),
    owner_id: process.env.RESIN_DEVICE_NAME_AT_INIT,
    msgtype: "IRReceived",
    code: code
  };
  request.post({
    url: serverURL + '/IRReceive',
    form: requestForm
  }, postResponse)
  .on('error', function(e) {
    console.log(e);
  });
}

function postResponse (error, response, body) {
  if (error) console.log(error);
  if (response) {
    console.log(response.statusCode);
    if (response.statusCode == 200) {
      console.log(body); // Servidor recebeu o pedido
    }
  }
}

// ------------- RECEIVE FUNCTION ----------------------- //



// ------------- CREATE SIGNAL ARRAY FUNCTION -----------

exports.createSignalArray = function(codeSignal) {

  var signal = codeSignal;
  var signalSize = signal.length;
  var signalPartsQty = Math.floor(signal.length / 61) + 1; // '#' + 61 digitos + '+' | '*'
  var signalArray = [];

  for (var i = 0; i < signalPartsQty; i++) {
    if(i == (signalPartsQty - 1)) { // if it's the last part
      var subString = '#' + signal.slice(61*i,61*(i+1));
      //console.log("Substring Length: " + subString.length);
      //console.log("number of 2 insertions: " + (63 - subString.length).toString());
      var twoIterations = subString.length;
      for (j = 0; j < (63 - twoIterations - 1); j++) {  // fill the gap with number 2
      //var x = 0;
      //while(x == (63 - subString.length))
        subString += '2';
        //console.log(j);
      //  x++;
      }
      signalArray.push(subString + '*');
      break;
    }
    signalArray.push('#' + signal.slice(61*i,61*(i+1)) + '+');
  }
  //console.log("Size of first part of message: " + signalArray[0].length);
  //console.log("Size of second part of message: " + signalArray[1].length);
  return signalArray;
}

// ------------- CREATE SIGNAL ARRAY FUNCTION ----------- //


// ------------- SENT COMMAND FUNCTION -----------

exports.createSignalArray = function(codeSignal) {

  var signal = codeSignal;
  var signalSize = signal.length;
  var signalPartsQty = Math.floor(signal.length / 61) + 1; // '#' + 61 digitos + '+' | '*'
  var signalArray = [];

  for (var i = 0; i < signalPartsQty; i++) {
    if(i == (signalPartsQty - 1)) { // if it's the last part
      var subString = '#' + signal.slice(61*i,61*(i+1));
      //console.log("Substring Length: " + subString.length);
      //console.log("number of 2 insertions: " + (63 - subString.length).toString());
      var twoIterations = subString.length;
      for (j = 0; j < (63 - twoIterations - 1); j++) {  // fill the gap with number 2
      //var x = 0;
      //while(x == (63 - subString.length))
        subString += '2';
        //console.log(j);
      //  x++;
      }
      signalArray.push(subString + '*');
      break;
    }
    signalArray.push('#' + signal.slice(61*i,61*(i+1)) + '+');
  }
  //console.log("Size of first part of message: " + signalArray[0].length);
  //console.log("Size of second part of message: " + signalArray[1].length);
  return signalArray;
}

// ------------- SENT COMMAND FUNCTION ----------- //




// ------------- ACTION FUNCTION -----------------------

// Migrado para módulo separado - action.js


// ------------- ACTION FUNCTION ----------------------- //
