const socketIOClient = require('socket.io-client');
const sailsIOClient = require('sails.io.js');

exports.io = sailsIOClient(socketIOClient);
