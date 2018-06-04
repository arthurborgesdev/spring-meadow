const Gpio = require('pigpio').Gpio;
const led = new Gpio(23, {mode: Gpio.OUTPUT});

var ledState = true;
exports.blink = function() {
  if(ledState == true) ledState = 1;
  if(ledState == false) ledState = 0;
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

exports.blinkOnce = function() {
  led.digitalWrite(1);
  setTimeout(function() {
    led.digitalWrite(0)
  }, 500);
}
