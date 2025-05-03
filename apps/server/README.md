# 🏦 Woovi backend 💰
 
O sistema bancário desenvolvido para o teste técnico da Woovi é uma aplicação simplificada que simula operações essenciais de um banco digital. Ele permite o gerenciamento de clientes, criação de contas bancárias, controle de saldo e realização de transferências entre contas. Com foco em segurança, consistência de dados.O sistema serve como base para demonstrar conceitos fundamentais de back-end aplicados ao contexto financeiro. 🚀

### 🛠 Pendendências nescessárias.

Este projeto precisa do node com o docker instalados, se caso não tenha, consulte as respectivas documentações para instalar.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/pt) é um software de código aberto, multiplataforma, baseado no interpretador V8 do Google e que permite a execução de códigos JavaScript fora de um navegador web.

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) é uma plataforma de software de código aberto que permite criar, gerenciar e executar aplicações em contêineres virtuais. É uma ferramenta útil para quem trabalha com desenvolvimento de software e administração de sistemas

## 🪛 Configurando o projeto

Ates de rodarmos de fato o projeto, é nescessário configura-lo instlando as dependências e criando as variáveis de ambiente.

### ➕ instalando as dependências

Para instlar as dependência certifique se que o terminal esteja apontado para a pasta [/apps/server](./) e rode o comando abaixo

```bash
npm install --legacy-peer-deps
```

### 🛡️ Configurando as variáveis de ambiente

O schema das variáveis de ambiente está descrito abaixo. As que já estão declaradas não são sensíveis e pode ser mudadas de acordo com a preferência do desenvolvedor. Já as que não estão declaradas são sensíveis e por isso não foi declaradas. Você pode consultar a equipe de desenvolvimento ou buscar nas nos provedores (sites) onde encontra-lás para preencher.

```env
# Backend
PORT=4000
APPLICATION_STAGE="dev" # dev | prod

# Mongo
MONGO_URI="mongodb://mongodb:27017/woovi-playground?replicaSet=rs0&authSource=admin"

# Redis
REDIS_HOST="redis://redis:6379"

# Jwt
JWT_SECRET=
JWT_SECRET_EXPIRES_IN="1d"

```

- 🔑 Para ter acesso ao root, as credenciais do mesmo devem ser passadas no arquivo env, passando o id ele vai criar o usuário e salvar no banco na hóra que o dono do id fazer a autenticação com o discord.

- 🎯 O modo como o backend vai rodar está definido na APPLICATION_STAGE, para desenvolvimento é recomendado que deixe como (dev), já para ambientes de produção o parâmetro deve ser (prod).

- 🔐 Para gerar as secrets do JWT você pode rodar o seguinte comando, lembrando que no mínimo tem que ter 100 caracteres para impedir que os tokens sejam quebrados.

```
node -e "console.log(require('crypto').randomBytes(200).toString('base64'))"
```

### ⚡ Rodando o projeto.

Andres de rodar o projeto é nescessário que a infra esteja rodando, para isso aponte seu terminal para a pasta raiz de todo o projeto onde o arquivo [infra-docker-compose.ym](../../infra-docker-compose.yml) está rode o comando abaixo para subir os containers de infra, ele será responsável por executar os bancos e criar a rede para que o servidor backend possa se conectar.

```terminal
docker compose -f infra-docker-compose.yml up --build
```


Depois que os serviços de ingra já estão rodando, aponte o terminal para a pasta onde o arquivo [backend-docker-compose.yml](./backend-docker-compose.yml) está e rode o comando abaixo:

```terminal
docker compose -f backend-docker-compose.yml up --build
```

Com os containers rodando corretamente você vera no terminal com o docker assim:

```
bb9763a156f0   server-woovi-backend-app2   "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:4001->4000/tcp, [::]:4001->4000/tcp       woovi-backend-2
c81145fb27d0   server-woovi-backend-app1   "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp       woovi-backend-1
a6128027ac92   mongo                       "docker-entrypoint.s…"   4 hours ago   Up 2 hours (healthy)   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongodb
bbd63bbbbf51   redis                       "docker-entrypoint.s…"   4 hours ago   Up 2 hours             0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp       redis
```
## 🏁 Acessando a aplicação

Para acessar a apicação você pode consultar com algum client http na url http://localhost:4000 para o servidor 1 e http://localhost:4001 para o servidor 2, além disso nos endpoints /graphql vai encontrar o playground graphql para testar sua api.