## 🚀 Início Rápido

### 1. Instalação das Dependências
```bash
# Instalar pacotes npm
npm install
```

### 2. Configuração do Banco
```bash
# Copiar arquivo de configuração
cp env.example .env

# Editar com suas configurações
nano .env
```

### 3. Setup do Banco de Dados
```bash
# Aplicar migrações (cria tabelas)
npm run migrate

# Carregar dados de exemplo
npm run seed
```

### 4. Iniciar o Servidor
```bash
# Modo desenvolvimento
npm run dev

# Servidor estará em: http://localhost:80
```

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor com hot-reload
npm run dev

# Iniciar servidor em produção
npm run start
```

### Banco de Dados
```bash
# Aplicar migrações
npm run migrate

# Carregar dados de exemplo
npm run seed

# Resetar banco (cuidado!)
npm run migrate:reset
```

### Qualidade de Código
```bash
# Verificar código com ESLint
npm run lint

# Formatar código com Prettier
npm run format

# Executar testes
npm test
```

## 📡 Testando a API

### 1. Health Check
```bash
# Verificar se está funcionando
curl http://localhost:80/health

# Resposta esperada:
# {"status":"ok"}
```

### 2. Enviar Webhook de Teste
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "test-service",
    "eventType": "user.created",
    "payload": {
      "userId": "12345",
      "email": "test@example.com",
      "name": "Test User"
    }
  }'

# Resposta esperada:
# {
#   "success": true,
#   "eventId": "cmh8ft3ue0000erc1yhqhsgmd",
#   "message": "Webhook received successfully"
# }
```

### 3. Listar Eventos
```bash
# Ver todos os eventos
curl http://localhost:80/api/webhook/events

# Filtrar por fonte
curl "http://localhost:80/api/webhook/events?source=test-service"

# Filtrar por tipo
curl "http://localhost:80/api/webhook/events?eventType=user.created"

# Paginação
curl "http://localhost:80/api/webhook/events?page=1&limit=5"
```

### 4. Dashboard
```bash
# Estatísticas gerais
curl http://localhost:80/api/dashboard/stats

# Eventos recentes
curl http://localhost:80/api/dashboard/recent
```

## 🧪 Testes Automatizados

### Executar Todos os Testes
```bash
npm test
```

### Testes com Coverage
```bash
npm run test -- --coverage
```

### Testes em Modo Watch
```bash
npm run test -- --watch
```

### Testes Específicos
```bash
# Testar apenas webhook
npm test -- --testNamePattern="webhook"

# Testar arquivo específico
npm test tests/webhook.test.js
```

## 📊 Monitoramento

### Logs em Tempo Real
```bash
# Ver todos os logs
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log

# Ver logs do servidor (se rodando com npm run dev)
# Os logs aparecem no terminal
```

### Métricas de Performance
```bash
# Verificar rate limiting
curl -I http://localhost:80/api/webhook/events

# Headers de rate limit:
# x-ratelimit-limit: 100
# x-ratelimit-remaining: 99
# x-ratelimit-reset: 60
```

## 🔧 Modo de Desenvolvimento

### Hot Reload
```bash
# O servidor reinicia automaticamente quando você modifica arquivos
npm run dev

# Para reiniciar manualmente, digite 'rs' no terminal
```

### Debugging
```bash
# Executar com debug
DEBUG=* npm run dev

# Ou com Node.js debugger
node --inspect src/index.js
```

### Variáveis de Ambiente de Desenvolvimento
```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
DATABASE=postgresql://user:pass@localhost:5432/webhook_dev
```

## 🐳 Executando com Docker

### Docker Compose (Recomendado)
```bash
# Iniciar tudo (app + banco)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild
docker-compose up --build
```

### Docker Manual
```bash
# Build da imagem
docker build -t webhook-listener .

# Executar container
docker run -p 80:80 --env-file .env webhook-listener
```

## 📈 Exemplos Práticos

### 1. Simular Webhook do GitHub
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{
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
      ],
      "repository": {
        "name": "my-repo",
        "full_name": "user/my-repo"
      }
    }
  }'
```

### 2. Simular Webhook do Stripe
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1234567890,v1=abc123" \
  -d '{
    "source": "stripe",
    "eventType": "payment.succeeded",
    "payload": {
      "id": "evt_1234567890",
      "type": "payment_intent.succeeded",
      "data": {
        "object": {
          "id": "pi_1234567890",
          "amount": 2000,
          "currency": "usd",
          "status": "succeeded"
        }
      },
      "created": 1640995200
    }
  }'
```

### 3. Simular Webhook do Slack
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Slack-Signature: v0=abc123" \
  -d '{
    "source": "slack",
    "eventType": "message",
    "payload": {
      "type": "message",
      "text": "Hello from Slack!",
      "user": "U1234567890",
      "channel": "C1234567890",
      "ts": "1640995200.000100"
    }
  }'
```

## 🔍 Troubleshooting

### Problema: Servidor não inicia
```bash
# Verificar se a porta está livre
sudo lsof -i :80

# Verificar logs de erro
cat logs/error.log

# Verificar configuração do banco
npx prisma db pull
```

### Problema: Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão manual
psql -h localhost -U webhookuser -d webhook_db

# Verificar variável DATABASE no .env
echo $DATABASE
```

### Problema: Testes falhando
```bash
# Limpar cache do Jest
npm test -- --clearCache

# Executar com verbose
npm test -- --verbose

# Verificar se o banco de teste está configurado
```

### Problema: Rate limiting muito restritivo
```bash
# Verificar configuração no código
# src/index.js - linha 20-23
# Ajustar max e timeWindow conforme necessário
```

## ✅ Checklist de Execução

- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados rodando
- [ ] Migrações aplicadas (`npm run migrate`)
- [ ] Dados de exemplo carregados (`npm run seed`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Health check funcionando (`/health`)
- [ ] Webhook de teste enviado com sucesso
- [ ] Eventos listados corretamente
- [ ] Dashboard funcionando
- [ ] Testes passando (`npm test`)
- [ ] Logs sendo gerados corretamente