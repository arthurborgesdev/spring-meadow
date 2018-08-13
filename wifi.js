// o botão pra setar o wifi invoca esse pedaço de código, spawnando
// um child adicional para chamar o script chg-wifi.sh o qual é
// responsável por 

const { spawn } = require('child_process');

exports.set = function() {
  console.log("setando wifi");
  setTimeout(function() {
    lockButton = false;
    const child = spawn('bash chg-wifi.sh', {
      cwd: '/usr/src/app',
      detached: true,
      shell: '/bin/bash'
    });

    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }, 3000);
}
