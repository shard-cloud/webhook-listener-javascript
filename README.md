# Webhook Listener JavaScript

🚀 **API completa para receber, armazenar e gerenciar webhooks de diferentes serviços**

Um sistema robusto que permite receber webhooks de qualquer serviço (GitHub, Stripe, Slack, etc.), armazenar os eventos no banco de dados e fornecer uma API para consultar e analisar esses dados.

## 🎯 O que este projeto faz?

Este projeto é um **listener de webhooks** que:

- ✅ **Recebe webhooks** de qualquer serviço externo
- ✅ **Armazena eventos** no banco PostgreSQL com todos os detalhes
- ✅ **Fornece API** para consultar e filtrar eventos
- ✅ **Dashboard** com estatísticas e eventos recentes
- ✅ **Validação** automática dos dados recebidos
- ✅ **Rate limiting** para proteger contra spam
- ✅ **Logs estruturados** para monitoramento

## 🚀 Início Rápido

### 1. Instalação
```bash
# Clone ou baixe o projeto
cd webhook-listener-javascript

# Instale as dependências
npm install
```

### 2. Configuração do Banco
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o .env com sua conexão PostgreSQL
# DATABASE=postgresql://user:password@localhost:5432/webhook_db
```

### 3. Iniciar o Servidor
```bash
# Modo desenvolvimento (migrations automáticas ✨)
npm run dev

# (Opcional) Popular com dados de exemplo
npm run seed

# O servidor estará rodando em http://localhost:80
```

## 📡 Como Usar

### Enviando Webhooks

**Endpoint:** `POST http://localhost:80/api/webhook`

**Formato do payload:**
```json
{
  "source": "github",
  "eventType": "push",
  "payload": {
    "ref": "refs/heads/main",
    "commits": [
      {
        "id": "abc123",
        "message": "Add new feature",
        "author": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }
}
```

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "stripe",
    "eventType": "payment.succeeded",
    "payload": {
      "id": "evt_1234567890",
      "amount": 2000,
      "currency": "usd"
    }
  }'
```

### Consultando Eventos

**Listar todos os eventos:**
```bash
curl http://localhost:80/api/webhook/events
```

**Filtrar por fonte:**
```bash
curl "http://localhost:80/api/webhook/events?source=github"
```

**Filtrar por tipo de evento:**
```bash
curl "http://localhost:80/api/webhook/events?eventType=push"
```

**Paginação:**
```bash
curl "http://localhost:80/api/webhook/events?page=2&limit=10"
```

**Buscar evento específico:**
```bash
curl http://localhost:80/api/webhook/events/EVENT_ID_AQUI
```

### Dashboard e Estatísticas

**Estatísticas gerais:**
```bash
curl http://localhost:80/api/dashboard/stats
```

**Eventos recentes:**
```bash
curl http://localhost:80/api/dashboard/recent
```

**Health check:**
```bash
curl http://localhost:80/health
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (aplica migrations automaticamente) |
| `npm run start` | Inicia o servidor em modo produção (aplica migrations automaticamente) |
| `npm run test` | Executa os testes automatizados |
| `npm run migrate` | Aplica migrações do banco de dados manualmente (se necessário) |
| `npm run seed` | Popula o banco com dados de exemplo (opcional) |
| `npm run lint` | Verifica o código com ESLint |
| `npm run format` | Formata o código com Prettier |

## 📊 Estrutura da API

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status do servidor |
| `POST` | `/api/webhook` | Receber webhook |
| `GET` | `/api/webhook/events` | Listar eventos (com filtros) |
| `GET` | `/api/webhook/events/:id` | Buscar evento específico |
| `GET` | `/api/dashboard/stats` | Estatísticas do dashboard |
| `GET` | `/api/dashboard/recent` | Eventos recentes |

### Estrutura de Resposta

**Webhook recebido com sucesso:**
```json
{
  "success": true,
  "eventId": "cmh8ft3ue0000erc1yhqhsgmd",
  "message": "Webhook received successfully"
}
```

**Lista de eventos:**
```json
{
  "events": [
    {
      "id": "cmh8ft3ue0000erc1yhqhsgmd",
      "source": "github",
      "eventType": "push",
      "payload": { /* dados do evento */ },
      "headers": { /* headers HTTP */ },
      "ip": "192.168.1.1",
      "userAgent": "GitHub-Hookshot/abc123",
      "createdAt": "2025-10-27T01:06:31.000Z",
      "updatedAt": "2025-10-27T01:06:31.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 6,
    "pages": 1
  }
}
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```bash
# Banco de dados (obrigatório)
DATABASE=postgresql://user:password@localhost:5432/webhook_db

# Servidor
PORT=80
APP_SECRET=your-secret-key

# Webhook (opcional)
WEBHOOK_SECRET=your-webhook-secret
MAX_EVENTS_PER_PAGE=50
```

### Docker

```bash
# Usar Docker Compose
docker-compose up -d

# Ou build manual
docker build -t webhook-listener .
docker run -p 80:80 --env-file .env webhook-listener
```

## 📁 Estrutura do Projeto

```
webhook-listener-javascript/
├── src/
│   ├── index.js              # Servidor principal
│   ├── routes/
│   │   ├── webhook.js        # Rotas de webhook
│   │   └── dashboard.js      # Rotas do dashboard
│   └── utils/
│       └── logger.js         # Configuração de logs
├── prisma/
│   └── schema.prisma         # Schema do banco
├── tests/
│   └── webhook.test.js       # Testes automatizados
├── docs/                     # Documentação completa
├── seed/                     # Dados de exemplo
└── logs/                     # Arquivos de log
```

## 🧪 Testando

```bash
# Executar todos os testes
npm test

# Testar webhook manualmente
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "test",
    "eventType": "test.event",
    "payload": {"message": "Hello World"}
  }'
```

## 📚 Documentação Completa

- [📖 Introdução](docs/01-introducao.md) - Visão geral do projeto
- [⚙️ Configuração](docs/02-configuracao.md) - Setup detalhado
- [🚀 Executando](docs/03-rodando.md) - Como rodar o projeto
- [🚢 Deploy](docs/04-deploy.md) - Deploy em produção

## 🎯 Casos de Uso Práticos

### 1. Integração com GitHub
Configure webhooks no GitHub apontando para `http://seu-servidor.com/api/webhook` e receba eventos de push, pull requests, etc.

### 2. Monitoramento Stripe
Receba notificações de pagamentos, assinaturas e outros eventos financeiros.

### 3. Integração Slack
Monitore mensagens, eventos de canal e outras atividades do Slack.

### 4. Sistema de Auditoria
Use como sistema centralizado para rastrear eventos de diferentes serviços.

## 🔒 Segurança

- ✅ **Rate limiting** (100 requests/minuto)
- ✅ **Validação de entrada** com JSON Schema
- ✅ **CORS** configurado
- ✅ **Helmet** para headers de segurança
- ✅ **Logs estruturados** para auditoria

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.