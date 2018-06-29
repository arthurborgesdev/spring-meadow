// ------------- MODULES -----------------------

const Gpio = require('pigpio').Gpio;
const pigpio = require('pigpio');
const dht22Sensor = require('node-dht-sensor');
const wifi = require('./wifi');
const led_module = require('./led_module');
const weather = require('./weather');
const infrared = require('./infrared');
const pir = require('./pir');
const action = require('./action');
const sleep = require('sleep');

const io = require('./socket-client').io;
io.sails.url = 'https://www.energizei.com.br';

// Part to communicate with Arduino
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0', { //ttyUSB0 = Arduino Micro | ttyACM0 = Arduino UNO
  baudRate: 115200
});
const parser = new Readline({ delimiter: '\r\n' });
port.pipe(parser);

//const carrier = new Gpio(18, {mode: Gpio.OUTPUT});
//const transmiter = new Gpio(25, {mode: Gpio.OUTPUT}); // 16 - mk2 e 25 - mk3

// ------------- MODULES ----------------------- //



// ----------- PERIPHERAL DEVICES --------------

/*
var button = new Gpio(24, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
});
*/
var receiver = new Gpio(21, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  edge: Gpio.EITHER_EDGE,
  alert: true
});

var pirSensor = new Gpio(12, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  edge: Gpio.FALLING_EDGE
});

var lockAll = false;
// ----------- PERIPHERAL DEVICES --------------------------//


// ----------- SELF REGISTER DEVICE ONCE ---------------------

setTimeout(function() {
  // trocar pra servidor próprio
  // Verificar aqui se já foi registrado no banco Sails
  if (!process.env.REGISTERED) {
    io.socket.post('/devregister',
      { device_id: process.env.RESIN_DEVICE_UUID },
      function serverResponded (body, JWR) {
        console.log('Sails responded with: ', body);
    });
  }
}, 1);

io.socket.on('disconnect', function() {
  // why use _ /parameters/variables and how they work?
  // sails creates a _raw underlying socket (line 897 sails.io.js)
  // call an underlying io socket (_raw) and his manager (io)
  // now how sails will identify _variable as variable?
  // internally it don't distinguishes in opts object?
  // line 686: return _opts[option]
  // options can only be changed when socket is disconnected
  // something related to Object.defineProperty
  // _opts? do _private take precedence over public vars?
  io.socket._raw.io._reconnection = true;
  io.socket._raw.io._reconnectionAttempts = Infinity;
});

// ----------- SELF REGISTER DEVICE ONCE --------------------//


// ----------- DEBUG LED -----------------------------------
// When LED is blinking, the lapizero is working
var ledInterval;
led_module.blink();

// ----------- WEATHER HANDLING -----------------------------------

setInterval(function() {
  if (!lockAll) {
    dht22Sensor.read(22, 20, weather.get);

    // implementar chamada para o server, com id do dispositivo e com
    // o valor da temperatura/umidade
  }
}, 30000); // 30 segundos

// ----------- WEATHER HANDLING ------------------------------ //

// ---------------- BUTTON LISTENER ---------------------------
// Por agora, "hardcodar" o ssid e password no config do microSD,
// até resolver o problema do resin-wifi-connect pro Rasp 0 W
// por isso que essa parte está comentada

// testar essa function com resin local para agilizar
/*
var lockButton = false;
button.on('interrupt', function() {
  lockAll = true;
  if (!lockButton) {
    lockButton = true;
    wifi.set();
    setTimeout(function() {
    //setInterval(function() {
      lockAll = false;
    }, 120000); // destrava os periféricos após 2 minutos
  }
});
*/
// ---------------- BUTTON LISTENER ---------------------------//

// ---------------- PIR LISTENER ------------------------------


pirSensor.on('interrupt', function() {
  //console.log("Interrompeu!");
  if(!lockAll) {
    console.log("não está travado");
    pir.receive();
  }
});


// ---------------- RECEIVE IR --------------------------------


receiver.on('alert', function(level, tick) {
  //if (!lockAll) {
    infrared.receive(level, tick) // infrared.receive();
  //}
});


// ---------------- RECEIVE IR ----------------------------------- //


// ---------------- ACTION -----------------------------------

// de tempos em tempos (1x por minuto) fazer o post ao server perguntando
// se há alguma ação a ser tomada
// alterar lock time proporcional ao tempo que o servidor demorar
// pra responder
// ----->>>> Pode ser resolvido com socket-io
// erro quando o socket-io está desconectado:
// url: 'wss://www.energizei.com.br/socket.io/?
//__sails_io_sdk_version=1.2.1&
//__sails_io_sdk_platform=node&
//__sails_io_sdk_language=javascript
//&EIO=3&transport=websocket'

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


var arrayIndex = 0;
setInterval(function() {
  // Aqui vai um post ao Server pra buscar o signal
  //var signal = "11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001";
  var signal2 = "11100010011010011011001001000000000000000001001001100000011110000010000000000000000000000000000000000000010110010";
  const signalPequiDesliga = "11100010011010011011001001000000000000000001001001100000011110000010000000000000000000000000000000000000010110010";
  const signaEmitedToPequi = "11100010011010011011001001000000000000000001001001100000011110000010000000000000000000000000000000000000010110010";
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011100000101110000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001000001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            // 30 us between transmissions

            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001

            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001000100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            // 1000 us between transmissions
            //  111000100110100110110010010000000000000000010010011000000111100001010110000000000000000000000000000000000000100011
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001

            //  111000100110000110100010010000000000000000010010011000000111100001011110000000000000000000000000000000000000100011
            //  111000100110100110110010010000000000000000010010011000000111100001011110000000000000000000000000000000000000100011
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001

            //  111000100110100110110010010000000000000000000010011000000111100001011110000000000000000000000000000000000000100011
            //  111000100110100110110010010000000000000000010010011000000111100001011110000000000000000000000000000000000000100011
            //  11100010011010011011001001000000000000000001001001100000011110000101111000000000000000000000000000000000000010001

            //  000000011000000000000100000000001000100000000000000000000000000000000000001000110000011110000010000000000000000000000000000000000000101100010

            //  11100010011010011011001001000000000000000001001001100000011110000010000000000000000000000000000000000000010110010

            //  11100010011010011011001001000000000000000001001001100000011110000010000000000000000000000000000000000000010110010

            //  00110000100011010011001100000001000000000000001001000001000000111100000010000000000000000000000000000000000000010110010


  signalArray = infrared.createSignalArray(signalPequiDesliga);
  console.log(signalArray);

  port.write(signalArray[arrayIndex], function(err) {
    if (err) { return console.log("Error on write: ", err.message); }
    console.log("Sent first part");
  });

}, 30 * 1 * 1000); //  10 minutos


parser.on('data', function(data) {
  console.log(data);
  if(data == "COMPLETE") {
    console.log("Complete is: " + data);
    arrayIndex += 1;
    port.write(signalArray[arrayIndex], function(err) {
      if (err) { return console.log("Error on write: ", err.message); }
      console.log("Sent arrayIndex: " + arrayIndex);
    });
  }

  if (data == "RECEBIDO") {
    console.log("Recebido is: " + data);
    arrayIndex = 0;
    // function to send to Server that the command was sent
    //infrared.sentCommand()
  }
});

port.on('error', function() {
  console.log("Error event emmited");
});

// ---------------- ACTION  ----------------------------------- //




// ----------------- HANDLE EXIT -----------------------------
process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGCONT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  pigpio.terminate();
  console.log('Limpando timers e pigpio pra finalizar...');
  io.socket.disconnect();
  port.close(function () {
    console.log('port Closed.');
    process.exit(0);
  });
  //clearTimeout(nobodyTimer);
  //clearTimeout(ledInterval);
  //console.log('Limpando timers e pigpio pra finalizar...');
  //process.exit(0);
}
// ----------------- HANDLE EXIT ----------------------------- //
