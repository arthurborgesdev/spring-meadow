const Gpio = require('pigpio').Gpio;
const led = new Gpio(23, {mode: Gpio.OUTPUT});

var ledState = true;
exports.blink = function() {
  /*
  li
   li
  (aqui preciso converter os valores de true e
  false para 1 e 0, a fim de poder passar esses valores
  para a função led.digitalWrite)
  */
  if(ledState == true) ledState = 1;
  if(ledState == false) ledState = 0;
  /*
  li
   li

  se ledState == true
   ledState
    1

  se ledState == false
   ledState
    0
  */
  //console.log(ledState);
  led.digitalWrite(ledState);
  //console.log(ledState);
  ledInterval = setInterval(function() {
    ledState = !ledState;
    if(ledState == true) ledState = 1;
    if(ledState == false) ledState = 0;
    led.digitalWrite(!ledState);
    //console.log(ledState);
  }, 500);
}

//li
// li
//?
//  (Aqui acende o led e o apaga após meio segundo)
exports.blinkOnce = function() {
  led.digitalWrite(1);
  setTimeout(function() {
    led.digitalWrite(0)
  }, 500);
}
