# Como o site funciona

O site tem a seguinte Stack de desenvolvimento:

### Tecnologias Utilizadas

* [Next.js 13](https://nextjs.org/docs/getting-started)
* [NextUI v2](https://nextui.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Tailwind Variants](https://tailwind-variants.org)
* [TypeScript](https://www.typescriptlang.org/)
* [Framer Motion](https://www.framer.com/motion/)
* [next-themes](https://github.com/pacocoursey/next-themes)
* [MongoDB](https://www.mongodb.com/pt-br)

### Monitoramento de Sensores com Next.js

#### Visão Geral

Este projeto é um sistema de monitoramento que permite aos usuários visualizar leituras de diferentes sensores ESP8266 em tempo real. Ele é construído com Next.js e se comunica com uma base de dados MongoDB para armazenar e recuperar leituras dos sensores.

#### Funcionalidade Principal

**Entrada de Dados**

Os dispositivos ESP8266 enviam periodicamente suas leituras (como temperatura, umidade, entre outros) para o servidor via POST requests. Estas leituras são então armazenadas no banco de dados MongoDB.

**Interface do Usuário**

A interface do usuário permite que você insira o ID de um ESP e obtenha suas leituras. Além disso, a interface fornece a capacidade de filtrar leituras com base em uma faixa de datas selecionada.

1. **Campo de Entrada do ID do ESP**: Permite aos usuários inserir o ID de um ESP específico e buscar suas leituras.
2. **Seletor de Data**: Permite aos usuários especificar uma faixa de datas para filtrar as leituras.
3. **Gráficos**: Após inserir um ID e (opcionalmente) selecionar uma faixa de datas, os gráficos mostrarão as leituras correspondentes. Cada tipo de leitura (por exemplo, temperatura ou umidade) é apresentado em um gráfico separado.

#### Backend

O backend é construído com o Next.js e tem duas responsabilidades principais:

1. **Receber Leituras dos Sensores**: A rota `POST /api/postInfo` é responsável por receber as leituras dos sensores e armazená-las no MongoDB.
2. **Fornecer Leituras para a Interface do Usuário**: A rota `POST /api/getDadosESP` permite que a interface do usuário obtenha leituras de um ESP específico.

#### Banco de Dados

O MongoDB é utilizado para armazenar as leituras dos sensores. Cada documento no banco de dados representa um ESP e contém um array de leituras, juntamente com um timestamp para cada leitura.

#### Considerações Adicionais

* **Segurança**: Para evitar sobrescrita acidental ou entradas indesejadas no banco de dados, uma chave de autenticação pode ser implementada.
* **Performance**: As conexões com o banco de dados são gerenciadas de forma eficiente para garantir tempos de resposta rápidos e minimizar a sobrecarga no MongoDB.
