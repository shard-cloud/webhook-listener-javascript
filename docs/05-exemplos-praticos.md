## 🚀 Guia Rápido de Uso

Este arquivo contém exemplos práticos de como usar o Webhook Listener em diferentes cenários.

## 📡 Enviando Webhooks

### 1. Webhook Básico
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "meu-servico",
    "eventType": "usuario.criado",
    "payload": {
      "id": "12345",
      "nome": "João Silva",
      "email": "joao@example.com"
    }
  }'
```

### 2. Webhook do GitHub
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
          "id": "abc123def456",
          "message": "Adiciona nova funcionalidade",
          "author": {
            "name": "João Silva",
            "email": "joao@example.com"
          }
        }
      ],
      "repository": {
        "name": "meu-projeto",
        "full_name": "usuario/meu-projeto"
      }
    }
  }'
```

### 3. Webhook do Stripe
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

### 4. Webhook do Slack
```bash
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Slack-Signature: v0=abc123" \
  -d '{
    "source": "slack",
    "eventType": "message",
    "payload": {
      "type": "message",
      "text": "Olá do Slack!",
      "user": "U1234567890",
      "channel": "C1234567890",
      "ts": "1640995200.000100"
    }
  }'
```

## 📊 Consultando Dados

### 1. Listar Todos os Eventos
```bash
curl http://localhost:80/api/webhook/events
```

### 2. Filtrar por Fonte
```bash
# Apenas eventos do GitHub
curl "http://localhost:80/api/webhook/events?source=github"

# Apenas eventos do Stripe
curl "http://localhost:80/api/webhook/events?source=stripe"
```

### 3. Filtrar por Tipo de Evento
```bash
# Apenas eventos de push
curl "http://localhost:80/api/webhook/events?eventType=push"

# Apenas eventos de pagamento
curl "http://localhost:80/api/webhook/events?eventType=payment.succeeded"
```

### 4. Paginação
```bash
# Primeira página (5 eventos)
curl "http://localhost:80/api/webhook/events?page=1&limit=5"

# Segunda página
curl "http://localhost:80/api/webhook/events?page=2&limit=5"
```

### 5. Buscar Evento Específico
```bash
# Substitua EVENT_ID pelo ID real do evento
curl http://localhost:80/api/webhook/events/EVENT_ID
```

## 📈 Dashboard e Estatísticas

### 1. Estatísticas Gerais
```bash
curl http://localhost:80/api/dashboard/stats
```

**Resposta esperada:**
```json
{
  "totalEvents": 15,
  "sources": [
    {"name": "github", "count": 8},
    {"name": "stripe", "count": 4},
    {"name": "slack", "count": 3}
  ],
  "eventTypes": [
    {"name": "push", "count": 6},
    {"name": "payment.succeeded", "count": 4},
    {"name": "message", "count": 3},
    {"name": "pull_request", "count": 2}
  ]
}
```

### 2. Eventos Recentes
```bash
curl http://localhost:80/api/dashboard/recent
```

**Resposta esperada:**
```json
{
  "events": [
    {
      "id": "cmh8ft3ue0000erc1yhqhsgmd",
      "source": "github",
      "eventType": "push",
      "createdAt": "2025-10-27T01:06:31.000Z"
    },
    {
      "id": "cmh8ftebu0001erc131gbc19a",
      "source": "stripe",
      "eventType": "payment.succeeded",
      "createdAt": "2025-10-27T01:05:45.000Z"
    }
  ]
}
```

## 🔍 Exemplos com JavaScript/Node.js

### 1. Enviando Webhook com Axios
```javascript
const axios = require('axios');

async function enviarWebhook() {
  try {
    const response = await axios.post('http://localhost:80/api/webhook', {
      source: 'meu-app',
      eventType: 'usuario.login',
      payload: {
        userId: '12345',
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1'
      }
    });
    
    console.log('Webhook enviado:', response.data);
  } catch (error) {
    console.error('Erro ao enviar webhook:', error.message);
  }
}

enviarWebhook();
```

### 2. Consultando Eventos com Fetch
```javascript
async function consultarEventos() {
  try {
    const response = await fetch('http://localhost:80/api/webhook/events?source=github');
    const data = await response.json();
    
    console.log('Eventos encontrados:', data.events.length);
    data.events.forEach(event => {
      console.log(`- ${event.source}: ${event.eventType} (${event.createdAt})`);
    });
  } catch (error) {
    console.error('Erro ao consultar eventos:', error.message);
  }
}

consultarEventos();
```

## 🐍 Exemplos com Python

### 1. Enviando Webhook com Requests
```python
import requests
import json
from datetime import datetime

def enviar_webhook():
    url = 'http://localhost:80/api/webhook'
    data = {
        'source': 'meu-app-python',
        'eventType': 'processo.concluido',
        'payload': {
            'processId': 'proc_12345',
            'status': 'success',
            'timestamp': datetime.now().isoformat(),
            'duration': 120
        }
    }
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        print('Webhook enviado:', response.json())
    except requests.exceptions.RequestException as e:
        print('Erro ao enviar webhook:', e)

enviar_webhook()
```

### 2. Consultando Estatísticas
```python
import requests

def consultar_estatisticas():
    url = 'http://localhost:80/api/dashboard/stats'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        stats = response.json()
        
        print(f"Total de eventos: {stats['totalEvents']}")
        print("\nFontes mais ativas:")
        for source in stats['sources']:
            print(f"  - {source['name']}: {source['count']} eventos")
            
    except requests.exceptions.RequestException as e:
        print('Erro ao consultar estatísticas:', e)

consultar_estatisticas()
```

## 🔧 Exemplos com PowerShell

### 1. Enviando Webhook
```powershell
$body = @{
    source = "powershell-script"
    eventType = "script.executado"
    payload = @{
        scriptName = "backup-database.ps1"
        status = "success"
        duration = 300
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:80/api/webhook" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Webhook enviado com sucesso: $($response.eventId)"
} catch {
    Write-Host "Erro ao enviar webhook: $($_.Exception.Message)"
}
```

### 2. Consultando Eventos Recentes
```powershell
try {
    $recentEvents = Invoke-RestMethod -Uri "http://localhost:80/api/dashboard/recent" -Method GET
    Write-Host "Eventos recentes:"
    $recentEvents.events | ForEach-Object {
        Write-Host "  - $($_.source): $($_.eventType) at $($_.createdAt)"
    }
} catch {
    Write-Host "Erro ao consultar eventos: $($_.Exception.Message)"
}
```

## 🧪 Testando a API

### 1. Health Check
```bash
curl http://localhost:80/health
```

### 2. Teste de Rate Limiting
```bash
# Enviar múltiplos requests rapidamente
for i in {1..5}; do
  curl -X POST http://localhost:80/api/webhook \
    -H "Content-Type: application/json" \
    -d '{"source":"test","eventType":"test.event","payload":{"test":true}}'
  echo "Request $i enviado"
done
```

### 3. Teste de Validação
```bash
# Enviar dados inválidos (deve falhar)
curl -X POST http://localhost:80/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"source":"test"}'  # Faltando eventType e payload
```

## 📱 Integração com Serviços Externos

### 1. Configurar Webhook no GitHub
1. Vá para Settings → Webhooks
2. Adicione webhook: `http://seu-servidor.com/api/webhook`
3. Selecione eventos: push, pull_request, issues
4. Salve a configuração

### 2. Configurar Webhook no Stripe
1. Vá para Developers → Webhooks
2. Adicione endpoint: `http://seu-servidor.com/api/webhook`
3. Selecione eventos: payment_intent.succeeded, customer.created
4. Salve a configuração

### 3. Configurar Webhook no Slack
1. Vá para Apps → Incoming Webhooks
2. Configure URL: `http://seu-servidor.com/api/webhook`
3. Configure eventos desejados
4. Salve a configuração

## 🔍 Debugging e Troubleshooting

### 1. Verificar Logs
```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log
```

### 2. Verificar Status do Servidor
```bash
# Health check
curl http://localhost:80/health

# Verificar rate limiting
curl -I http://localhost:80/api/webhook/events
```

### 3. Testar Conectividade
```bash
# Testar se o servidor está respondendo
ping localhost

# Testar porta específica
telnet localhost 80
```

## 📚 Próximos Passos

1. **Configure webhooks** nos serviços que você usa
2. **Monitore os logs** para entender os padrões
3. **Crie dashboards** personalizados usando a API
4. **Implemente alertas** baseados em eventos específicos
5. **Configure backups** regulares dos dados
6. **Monitore performance** e ajuste rate limiting se necessário
