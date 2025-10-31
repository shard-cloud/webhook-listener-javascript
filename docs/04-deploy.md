## 🚀 Deploy em Produção

### Pré-requisitos
- Servidor com Node.js 20+
- PostgreSQL 13+
- Domínio configurado (opcional)
- Certificado SSL (recomendado)

## 🐳 Deploy com Docker (Recomendado)

### 1. Preparação do Servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configuração do Projeto
```bash
# Clonar projeto
git clone <seu-repositorio>
cd webhook-listener-javascript

# Configurar variáveis de ambiente
cp env.example .env
nano .env
```

### 3. Configuração de Produção
```bash
# .env para produção
NODE_ENV=production
DATABASE=postgresql://user:password@db:5432/webhook_prod
PORT=80
APP_SECRET=super-secret-key-with-32-chars-minimum
WEBHOOK_SECRET=webhook-validation-secret
MAX_EVENTS_PER_PAGE=100
```

### 4. Deploy com Docker Compose
```bash
# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 🌐 Deploy Manual (Sem Docker)

### 1. Instalação do Node.js
```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versão
node --version
npm --version
```

### 2. Instalação do PostgreSQL
```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Configurar banco
sudo -u postgres psql
CREATE DATABASE webhook_prod;
CREATE USER webhookuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE webhook_prod TO webhookuser;
\q
```

### 3. Deploy da Aplicação
```bash
# Clonar projeto
git clone <seu-repositorio>
cd webhook-listener-javascript

# Instalar dependências
npm install

# Configurar ambiente
cp env.example .env
nano .env

# Aplicar migrações
npm run migrate

# Carregar dados iniciais (opcional)
npm run seed

# Instalar PM2 para gerenciamento de processos
sudo npm install -g pm2

# Iniciar aplicação
pm2 start src/index.js --name webhook-listener

# Configurar PM2 para iniciar automaticamente
pm2 startup
pm2 save
```

## 🔒 Configuração de Segurança

### 1. Firewall
```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 80  # Bloquear acesso direto à porta 80
```

### 2. Nginx (Proxy Reverso)
```bash
# Instalar Nginx
sudo apt install nginx

# Configurar site
sudo nano /etc/nginx/sites-available/webhook-listener
```

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
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
}

# Rate limiting
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/webhook-listener /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL com Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento e Logs

### 1. Logs com PM2
```bash
# Ver logs em tempo real
pm2 logs webhook-listener

# Ver logs específicos
pm2 logs webhook-listener --lines 100

# Reiniciar aplicação
pm2 restart webhook-listener
```

### 2. Logs do Sistema
```bash
# Configurar logrotate
sudo nano /etc/logrotate.d/webhook-listener
```

```
/var/log/webhook-listener/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Monitoramento com PM2
```bash
# Monitor em tempo real
pm2 monit

# Status da aplicação
pm2 status

# Informações detalhadas
pm2 show webhook-listener
```

## 🔄 CI/CD com GitHub Actions

### 1. Workflow de Deploy
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/webhook-listener-javascript
          git pull origin main
          npm ci
          npm run migrate
          pm2 restart webhook-listener
```

### 2. Secrets Necessários
- `HOST`: IP do servidor
- `USERNAME`: Usuário SSH
- `SSH_KEY`: Chave privada SSH

## 📈 Escalabilidade

### 1. Load Balancer
```nginx
upstream webhook_listener {
    server localhost:80;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://webhook_listener;
    }
}
```

### 2. Múltiplas Instâncias
```bash
# Iniciar múltiplas instâncias
pm2 start src/index.js -i 3 --name webhook-listener

# Escalar dinamicamente
pm2 scale webhook-listener 5
```

### 3. Banco de Dados Otimizado
```sql
-- Índices para performance
CREATE INDEX idx_webhook_events_source ON webhook_events(source);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);

-- Particionamento por data (opcional)
CREATE TABLE webhook_events_2025_01 PARTITION OF webhook_events
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## 🔧 Manutenção

### 1. Backup do Banco
```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump webhook_prod > backup_$DATE.sql
gzip backup_$DATE.sql
```

### 2. Limpeza de Logs Antigos
```bash
# Script de limpeza
find /var/log/webhook-listener -name "*.log" -mtime +30 -delete
```

### 3. Atualizações
```bash
# Atualizar aplicação
git pull origin main
npm ci
npm run migrate
pm2 restart webhook-listener
```

## 🚨 Troubleshooting

### Problema: Aplicação não inicia
```bash
# Verificar logs
pm2 logs webhook-listener

# Verificar configuração
pm2 show webhook-listener

# Verificar banco de dados
npx prisma db pull
```

### Problema: Erro 502 Bad Gateway
```bash
# Verificar se aplicação está rodando
pm2 status

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar configuração do Nginx
sudo nginx -t
```

### Problema: Rate limiting muito restritivo
```bash
# Ajustar configuração no código
# src/index.js - linha 20-23
# Reiniciar aplicação
pm2 restart webhook-listener
```

## ✅ Checklist de Deploy

- [ ] Servidor configurado com Node.js 20+
- [ ] PostgreSQL instalado e configurado
- [ ] Variáveis de ambiente configuradas
- [ ] SSL configurado (Let's Encrypt)
- [ ] Nginx configurado como proxy reverso
- [ ] Firewall configurado
- [ ] Aplicação rodando com PM2
- [ ] Logs configurados e rotacionando
- [ ] Backup do banco configurado
- [ ] Monitoramento funcionando
- [ ] Health check respondendo
- [ ] Testes de webhook funcionando
- [ ] CI/CD configurado (opcional)
- [ ] Documentação atualizada