# Como colocar os sensores

Todas as informações que forem enviadas para o servidor vão ser renderizadas como um gráfico (nosso servidor cuidara do tempo, basta você enviar as informações que você quiser 😊)



Primeiramente você precisa decidir que sensores você vai querer usar, nesse exemplo vai ser usado o DHT11, um sensor que consegue medir temperatura e umidade.

O diagrama ficou assim:\


<figure><img src="https://www.eletruscomp.com.br/arquivos/1488569368_dht11_1.png" alt=""><figcaption><p>fonte: www.eletruscomp.com.br</p></figcaption></figure>

## Explicação do diagrama

1. **Arduino Uno**: Esta é a placa microcontroladora baseada no ATmega328P. Ela serve como a "mente" do projeto, lendo dados do sensor e processando-os.
2. **DHT11**: Este é o sensor de temperatura e umidade. Ele tem quatro pinos, mas apenas três são  usados neste diagrama:
   * **Pino 1 (VCC)**: Este é conectado à alimentação. No diagrama, ele é conectado ao pino 5V do Arduino.
   * **Pino 2 (Data)**: Este é o pino de dados. No diagrama, ele é conectado ao pino digital 7 do Arduino através de um resistor pull-up (o resistor entre o VCC e o pino Data). Este resistor é necessário para garantir leituras estáveis do sensor.
   * **Pino 3 (NC)**: Este pino não está conectado (NC significa "Não Conectado").
   * **Pino 4 (GND)**: Este é conectado ao terra (ground). No diagrama, ele é conectado ao pino GND do Arduino.
3. **Protoboard**: Esta é uma ferramenta utilizada para montar circuitos sem a necessidade de soldagem. No diagrama, ela é usada para conectar o DHT11 ao Arduino e também para conectar o resistor pull-up ao pino Data do sensor.



Se não ficou nenhuma dúvida, você está livre para ir para a próxima parte. [codigo-do-esp.md](codigo-do-esp.md "mention")
