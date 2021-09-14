# Spring-meadown (Split air conditioner controller)

## What it is for?

Monitors and controlls the temperature and humidity when interfacing with a split air conditioner.

## How it works?

When the equipment is turned on, it is initiated with an balena/resin.io OS that loads the script responsbile to call the Node.js code. This code access the GPIO of Raspberry PI zero W (using a C library) communicating with the sensors.


## Main files and its functionalities

**/Dockerfile.template**

Contains instructions to assemble the docker image, load dependencies from Internet, running the necessary scripts to compose the application, copying the files to their respective folder and initializing the start script.


**/acDevice.js**

Contains the main functions of application. Function to measure temperature and humidity, function to coordinate the Arduino nano that is coupled to the serial port, function to control the PIR sensor (presence detector) and function to receive the infrared code from remote control.


**/action.js**

Contains the functions to trigger the split air conditioner through the Arduino Nano.


**/infrared.js**

Contains the functions that control in low-level the communication with the Arduino Nano, the coding and decoding of the air conditioner signal.


**/led_module.js**

Contains functions to control the behavior of the LED.


**/pir.js**

Contains functions to control the PIR sensor workings.


**/socket-client.js**

Contains the object for using Sockets, from the time when Sails.JS where used.


**/start**

Initializes the wifi-connect and then the main application (acDevice.js)


**/weather.js**

Contains functions that handle the variables of temperature and humidity, transform the data into objects and post it to the server using POST method.


**/wifi.js**

Contains the code that is called everytime that a button is pressed to set the wifi. It calls the file chg-wifi.sh.


## TODO (2018)

* Integrate the controller with the web app to make the storage of the split air conditioner codes.

## TODO (2021)

* Translate the README.md to English.