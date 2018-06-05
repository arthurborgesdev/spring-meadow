var serverURL = "http://165.227.192.69:1337"; // --> put inside a config or use env var later
const request = require('request');
const sleep = require('sleep');
const infrared = require('./infrared');

const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 115200
});

exports.postAction = function() {
  // Luis's code for hardware testing purposes
  var signal = "11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001";
  var customSignal = "#6011100010011010011011001001001010101010101010101010101010*";
  console.log(customSignal);
  port.write(signal, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message sent');
  });
  //port.on
  //IRSend(signal);
  /*
  request.post({
    url: serverURL + '/action',
    //form: { owner_id: "fast-fox" } // used to test/debug aggregation
    form: { owner_id: process.env.RESIN_DEVICE_NAME_AT_INIT }
  }, actionResponse)
  .on('error', function(e) {
    console.log(e);
  });
  */
}

function actionResponse (error, response, body) {
  if (error) console.log(error);
  if (response) {
    console.log(response.statusCode);
    if (response.statusCode == 200) {
      console.log("Servidor recebeu: ");
      console.log(body); // Servidor recebeu o pedido
      IRSend(body);
    }
  }
}

function IRSend (code) {
  //lockPIR = true; // trava o sensor PIR para que o envio não interfira nele
  //setTimeout(pirUnlock, 5000); // espera 5 segundos e então destrava o sensor PIR
  console.log("Sent  ");
  infrared.send(code); //<-- colocar aqui o código que receber do post ao server
  sleep.usleep(30);
  infrared.send(code);
}
