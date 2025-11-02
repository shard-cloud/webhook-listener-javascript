## 📖 O que é este template?

Este é um template **Webhook Listener** pronto para produção, desenvolvido em Node.js (JavaScript), que permite receber, registrar e consultar eventos de qualquer serviço que utilize webhooks (como GitHub, Stripe, Slack e outros).

## 🤔 O que são Webhooks?

**Webhooks** são uma forma de comunicação entre aplicações onde uma aplicação envia dados para outra aplicação em tempo real quando algo acontece. É como um "callback" ou "notificação" automática.

### Exemplo Prático:
- Quando alguém faz um **push** no GitHub → GitHub envia um webhook para sua aplicação
- Quando um **pagamento** é processado no Stripe → Stripe envia um webhook para sua aplicação
- Quando uma **mensagem** é enviada no Slack → Slack envia um webhook para sua aplicação

## 🎯 O que este projeto faz?

Este **Webhook Listener** é uma API que:

1. **Recebe webhooks** de qualquer serviço externo
2. **Armazena os dados** no banco PostgreSQL
3. **Fornece uma API** para consultar esses dados
4. **Oferece um dashboard** com estatísticas

### Fluxo de Funcionamento:

```
Serviço Externo (GitHub/Stripe/Slack)
           ↓ (envia webhook)
    Webhook Listener API
           ↓ (armazena)
    Banco PostgreSQL
           ↓ (consulta via API)
    Dashboard/Cliente
```

## 🚀 Por que usar este projeto?

### ✅ Vantagens:
- **Centralizado**: Recebe webhooks de múltiplos serviços em um só lugar
- **Persistente**: Todos os eventos ficam salvos no banco
- **Consultável**: API para buscar e filtrar eventos
- **Auditável**: Logs completos de todos os eventos
- **Escalável**: Rate limiting e validação automática
- **Pronto para produção**: Docker, testes, documentação completa

### 🎯 Casos de Uso Reais:

#### 1. **Integração GitHub**
```bash
# Configure no GitHub: Settings → Webhooks
# URL: http://seu-servidor.com/api/webhook
# Eventos: push, pull_request, issues, etc.
```

#### 2. **Monitoramento Stripe**
```bash
# Configure no Stripe Dashboard
# URL: http://seu-servidor.com/api/webhook
# Eventos: payment.succeeded, customer.created, etc.
```

#### 3. **Integração Slack**
```bash
# Configure Slack Apps
# URL: http://seu-servidor.com/api/webhook
# Eventos: message, channel_created, etc.
```

#### 4. **Sistema de Auditoria**
```bash
# Use para rastrear eventos de diferentes serviços
# Ideal para compliance e monitoramento
```

## 📊 O que você pode fazer com os dados?

### Consultas Disponíveis:
- **Listar todos os eventos** recebidos
- **Filtrar por fonte** (github, stripe, slack)
- **Filtrar por tipo** (push, payment.succeeded, message)
- **Buscar evento específico** por ID
- **Ver estatísticas** (total de eventos, fontes mais ativas)
- **Eventos recentes** para monitoramento

### Exemplo de Dados Armazenados:
```json
{
  "id": "cmh8ft3ue0000erc1yhqhsgmd",
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
  },
  "headers": {
    "x-github-event": "push",
    "x-github-delivery": "12345678-1234-1234-1234-123456789012"
  },
  "ip": "192.168.1.1",
  "userAgent": "GitHub-Hookshot/abc123",
  "createdAt": "2025-10-27T01:06:31.000Z"
}
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Propósito |
|------------|-----------|
| **Node.js** | Runtime JavaScript |
| **Fastify** | Framework web rápido |
| **PostgreSQL** | Banco de dados relacional |
| **Prisma** | ORM para banco de dados |
| **Winston** | Sistema de logs |
| **Jest** | Testes automatizados |
| **Docker** | Containerização |

## 🔒 Segurança e Confiabilidade

### Recursos de Segurança:
- ✅ **Rate Limiting**: Máximo 100 requests por minuto
- ✅ **Validação de Entrada**: JSON Schema para validar dados
- ✅ **CORS**: Configurado para segurança
- ✅ **Helmet**: Headers de segurança HTTP
- ✅ **Logs Estruturados**: Para auditoria e debugging

### Confiabilidade:
- ✅ **Validação Automática**: Rejeita dados inválidos
- ✅ **Tratamento de Erros**: Respostas consistentes
- ✅ **Logs Detalhados**: Para monitoramento
- ✅ **Testes Automatizados**: Garantia de qualidade

## 📈 Próximos Passos

Após entender esta introdução, você pode:

1. **[Configurar o projeto](02-configuracao.md)** - Setup do banco e variáveis
2. **[Executar localmente](03-rodando.md)** - Como rodar o projeto
3. **[Fazer deploy](04-deploy.md)** - Colocar em produção

## 💡 Dicas Importantes

- **Sempre teste** os webhooks antes de usar em produção
- **Configure rate limiting** adequado para seu caso de uso
- **Monitore os logs** para identificar problemas
- **Use HTTPS** em produção para segurança
- **Configure backups** do banco de dados