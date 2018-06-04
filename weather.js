const request = require('request');
var moment = require('moment');

const io = require('./socket-client').io;

io.sails.url = 'https://www.energizei.com.br';

var lastTemp=0;
var lastHumid=0;
var temperatureNow;
var humidityNow;

exports.get = function(err, temperature, humidity) {
  if (err) console.log(err);
  temperatureNow = temperature.toFixed(1);
  humidityNow = humidity.toFixed(1);
  // para corrigir o bug da casa decimal 26.2 < 25.2
  // ajustando margem de erro tanto pra temperatura quanto pra humidade
  // pra poder calcular Humidex

  // só autoriza enviar se a temperature/humidity NOW for diferente dentro
  // do range das last Temp e Humid
  if( (temperatureNow*10 > (lastTemp*10 + 2)) || (temperatureNow*10 < (lastTemp*10 - 2)) ||
      (humidityNow*10 > (lastHumid*10 + 5)) || (humidityNow*10 < (lastHumid*10 - 5))  ) {
    lastTemp = temperature.toFixed(1);
    lastHumid = humidity.toFixed(1);

    var requestForm = {
      time_iso: moment().format(),
      device_id: process.env.RESIN_DEVICE_UUID, // dev_id: process.env.RESIN_DEVICE_UUID,
      msg_type: "sensorWeather",
      temp: temperatureNow,
      humid: humidityNow
    };

    io.socket.post('/data', requestForm, function serverResponded (body, JWR) {
      // body === JWR.body
      console.log('Sails responded with: ', body);
      console.log('with headers: ', JWR.headers);
      console.log('and with status code: ', JWR.statusCode);
    });

    console.log('temp: ' + temperatureNow + 'C, ' + 'humidity: ' + humidityNow +  '%');
  }
};
