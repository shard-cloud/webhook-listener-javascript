## 🚀 Configuração Rápida

### 1. Variáveis de Ambiente

Crie o arquivo `.env` baseado no exemplo:

```bash
cp env.example .env
```

### 2. Configuração Mínima

```bash
# .env
DATABASE=postgresql://user:password@localhost:5432/webhook_db
PORT=80
APP_SECRET=your-secret-key-here
```

## 📋 Variáveis Detalhadas

### 🔴 Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE` | URL de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/webhook_db` |
| `PORT` | Porta do servidor | `80` |
| `APP_SECRET` | Chave secreta para segurança | `my-super-secret-key-123` |

### 🟡 Opcionais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `WEBHOOK_SECRET` | Chave para validar webhooks | `your-webhook-secret` |
| `MAX_EVENTS_PER_PAGE` | Máximo eventos por página | `50` |

## 🗄️ Configuração do Banco de Dados

### Opção 1: PostgreSQL Local

#### Instalação (Ubuntu/Debian):
```bash
# Instalar PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Criação do Banco:
```bash
# Conectar como postgres
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE webhook_db;
CREATE USER webhookuser WITH PASSWORD 'webhookpass';
GRANT ALL PRIVILEGES ON DATABASE webhook_db TO webhookuser;

# Sair
\q
```

#### Configuração no .env:
```bash
DATABASE=postgresql://webhookuser:webhookpass@localhost:5432/webhook_db
```

### Opção 2: Docker (Recomendado)

#### Usar Docker Compose:
```bash
# O projeto já inclui docker-compose.yml
docker-compose up -d

# Verificar se está rodando
docker-compose ps
```

#### Configuração no .env:
```bash
DATABASE=postgresql://webhookuser:webhookpass@localhost:5432/webhook_db
```

### Opção 3: Serviços Cloud

#### PostgreSQL no Cloud (exemplos):

**Supabase:**
```bash
DATABASE=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

**Railway:**
```bash
DATABASE=postgresql://postgres:[password]@[host].railway.app:5432/railway
```

**Neon:**
```bash
DATABASE=postgresql://[user]:[password]@[host].neon.tech/[database]
```

## 🔧 Configuração Avançada

### Rate Limiting

O projeto já vem com rate limiting configurado:
- **Limite**: 100 requests por minuto
- **Janela**: 1 minuto
- **Headers**: `x-ratelimit-*` nas respostas

### Logs

Os logs são salvos automaticamente em:
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros

### CORS

CORS está configurado para aceitar:
- **Origins**: Qualquer origem (`origin: true`)
- **Credentials**: Permitido (`credentials: true`)

## 🐳 Configuração Docker

### Docker Compose (Incluído)

O projeto já inclui `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - DATABASE=postgresql://webhookuser:webhookpass@db:5432/webhook_db
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: webhook_db
      POSTGRES_USER: webhookuser
      POSTGRES_PASSWORD: webhookpass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Comandos Docker:

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild
docker-compose up --build
```

## 🔐 Configuração de Segurança

### 1. Variáveis Seguras

```bash
# Use senhas fortes
APP_SECRET=super-secret-key-with-32-chars-minimum
WEBHOOK_SECRET=another-secret-for-webhook-validation

# Use HTTPS em produção
DATABASE=postgresql://user:pass@localhost:5432/webhook_db?sslmode=require
```

### 2. Firewall

```bash
# Permitir apenas porta 80
sudo ufw allow 80
sudo ufw enable
```

### 3. Proxy Reverso (Nginx)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🧪 Configuração de Testes

### Ambiente de Teste

```bash
# .env.test
DATABASE=postgresql://testuser:testpass@localhost:5432/webhook_test
PORT=3001
APP_SECRET=test-secret-key
```

### Executar Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test -- --coverage

# Testes em modo watch
npm run test -- --watch
```

## 📊 Monitoramento

### Health Check

```bash
# Verificar se está funcionando
curl http://localhost:80/health

# Resposta esperada:
# {"status":"ok"}
```

### Logs em Tempo Real

```bash
# Ver logs do servidor
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log
```

## ⚠️ Problemas Comuns

### 1. Erro de Conexão com Banco

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar conexão
psql -h localhost -U webhookuser -d webhook_db
```

### 2. Porta em Uso

```bash
# Verificar qual processo está usando a porta
sudo lsof -i :80

# Matar processo se necessário
sudo kill -9 [PID]
```

### 3. Permissões de Arquivo

```bash
# Dar permissões corretas
chmod 755 logs/
chmod 644 logs/*.log
```

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` criado
- [ ] `DATABASE` configurado corretamente
- [ ] PostgreSQL rodando
- [ ] Migrações aplicadas (`npm run migrate`)
- [ ] Dados de exemplo carregados (`npm run seed`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Health check funcionando (`/health`)
- [ ] Testes passando (`npm test`)