const socketIOClient = require('socket.io-client');
const sailsIOClient = require('sails.io.js');

exports.io = sailsIOClient(socketIOClient);


// aplicação não irá utilizar sails, mas deixar Aqui
// para ver se irá utilizar sockets no futuro 
