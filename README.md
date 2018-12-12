# Spring-meadown (controlador de ar condicionado split)

## Pra que serve?

Monitora e controla a temperatura e umidade do ambiente ao interfacear com um aparelho de ar condicionado split.


## Como funciona?

Ao ligar o equipamento, o mesmo é iniciado com um SO balena/resin.io que inicializa o script responsável por chamar o código nodejs. O mesmo acessa as portas de entrada e saída do raspberry PI zero W (através de uma biblioteca C) se comunicando assim com os sensores. Ao


## Arquivos principais e suas funções

**/Dockerfile.template**

Contém as instruçes para que seja montada a imagem docker, carregando as dependências da internet, rodando os scripts necessários para compor a aplicação, copiando os arquivos para suas respectivas pastas e iniciando o script inicial.

**/acDevice.js**

Contém as principais funções da aplicação. Função para medir a temperatura e a umidade, função para coordenar o Arduino nano que está acoplado na porta serial, função para controlar o sensor PIR (detector de presença) e função para receber o código infravermelho do controle remoto.

**/action.js**

Contém as funções para acionar o aparelho de ar condicionado passando pelo Arduino Nano.

**/infrared.js**

Contém as funções que controlam em baixo nível a comunicação com o Arduino Nano, a codificação do sinal do ar condicionado e a decodificação do mesmo.

**/led_module.js**

Contém funções para controlar o comportamento do LED.

**/pir.js**

Contém a função para controlar o funcionamento do sensor de presença (PIR).

**/socket-client.js**

Contém o objeto de utilização de Sockets, da época em que ainda se utilizava Sails.js.

**/start**

Inicializa o wifi-connect e depois a aplicação principal (acDevice.js)

**/weather.js**

Contém funções que fazem o tratamento das variáveis de temperatura e umidade, transformam os dados em objetos e os postam no servidor utilizando método POST.

**/wifi.js**

Contém o código que é invocado sempre que se aperta o botão para setar o wifi. O mesmo chama o arquivo chg-wifi.sh.

## Coisas a fazer

* Integrar o controlador com o web app para fazer a gravação dos códigos de ar condicionado.
