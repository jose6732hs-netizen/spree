# Guia de Deployment - SaaS Multi-Tenant Spree Commerce

## Visão Geral

Esta é uma plataforma de eCommerce SaaS multi-tenant construída com:
- **Frontend**: Next.js 14+ com TypeScript
- **Backend**: Pode usar Spree API (Rails) + PostgreSQL
- **Autenticação**: Sistema customizado com roles (Super Admin, Tenant Admin, Customer)
- **Isolamento de Dados**: Row-Level Security (RLS) no PostgreSQL

## Requisitos Pré-Deployment

### Produção
- Node.js 18+
- PostgreSQL 12+ com RLS habilitado
- Redis (para cache e sessions)
- Supabase ou AWS RDS (recomendado para produção)

### Desenvolvimento Local (já configurado)
- Docker Desktop
- pnpm ou npm

## Variáveis de Ambiente

Crie um arquivo `.env.production` com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@host:5432/spree_saas_prod
DIRECT_URL=postgresql://user:password@host:5432/spree_saas_prod

# Redis (para cache e sessions)
REDIS_URL=redis://user:password@host:6379

# Next.js
NEXT_PUBLIC_API_URL=https://sua-app.com/api
NODE_ENV=production

# Autenticação
JWT_SECRET=sua-chave-secreta-muito-longa-e-aleatoria-aqui
SESSION_SECRET=outra-chave-secreta-muito-longa-e-aleatoria-aqui

# Email (para notificações de pedidos)
SMTP_HOST=smtp.seumail.com
SMTP_PORT=587
SMTP_USER=seu-email@seumail.com
SMTP_PASSWORD=sua-senha-de-app

# Stripe (para pagamentos)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## 1. Deploy na Vercel (Recomendado)

### Passo 1: Conectar GitHub

```bash
# Fazer push do seu código para GitHub
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### Passo 2: Configurar Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente no painel de Vercel
5. Clique em "Deploy"

### Passo 3: Configurar Domínio

Para suportar subdomínios de tenants (ex: tenant1.seuloja.com):

1. No Vercel Dashboard, vá para Project Settings → Domains
2. Adicione seu domínio raiz
3. Configure wildcard DNS: `*.seuloja.com -> cname.vercel-dns.com`

## 2. Deploy Manual com PM2 (VPS/Servidor Dedicado)

### Passo 1: Preparar o Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar pnpm
npm install -g pnpm
```

### Passo 2: Clonar e Configurar

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# Instalar dependências
pnpm install

# Criar arquivo .env.production
cp .env.example .env.production
# Editar com suas variáveis de produção
nano .env.production

# Build
pnpm build
```

### Passo 3: Iniciar com PM2

```bash
# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'spree-saas',
      script: 'pnpm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
    }
  ]
};
EOF

# Iniciar a aplicação
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar para auto-iniciar ao rebootar
sudo pm2 startup
```

### Passo 4: Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo apt install -y nginx

# Criar configuração
sudo tee /etc/nginx/sites-available/spree-saas > /dev/null << EOF
upstream spree_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name seuloja.com *.seuloja.com;

    location / {
        proxy_pass http://spree_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Habilitar site
sudo ln -s /etc/nginx/sites-available/spree-saas /etc/nginx/sites-enabled/

# Teste e reinicie
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 5: SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Gerar certificado (substitua seu email e domínio)
sudo certbot certonly --nginx -d seuloja.com -d *.seuloja.com -m seu-email@gmail.com

# Auto-renovação
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 3. Banco de Dados - Configuração PostgreSQL

### Com Supabase (Recomendado - Mais Fácil)

1. Acesse https://supabase.com
2. Crie novo projeto
3. Copie a DATABASE_URL
4. Configure RLS nas tabelas (ver arquivo `lib/database-isolation-config.ts`)
5. Adicione a URL ao `.env.production` do Vercel ou servidor

### Com PostgreSQL Auto-Hosted

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar database e usuário
sudo -u postgres psql << EOF
CREATE DATABASE spree_saas;
CREATE USER spree_user WITH ENCRYPTED PASSWORD 'senha-segura-aqui';
ALTER ROLE spree_user SET client_encoding TO 'utf8';
ALTER ROLE spree_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE spree_user SET default_transaction_deferrable TO on;
ALTER ROLE spree_user SET default_transaction_deferrable TO on;
ALTER ROLE spree_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE spree_saas TO spree_user;
ALTER USER spree_user CREATEDB;
EOF

# Executar migrations (quando implementado)
# pnpm migrate:prod
```

## 4. CI/CD Pipeline (GitHub Actions)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test
    
    - name: Build
      run: pnpm build
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
```

## 5. Monitoramento e Logs

### Vercel (Automático)
- Logs disponíveis em: Vercel Dashboard → Deployments → Logs
- Analytics: Vercel Dashboard → Analytics

### PM2 Monitoramento

```bash
# Ver status das aplicações
pm2 status

# Ver logs em tempo real
pm2 logs spree-saas

# Ver dashboard interativo
pm2 monit

# Salvar logs
pm2 logs > app-logs.txt
```

## 6. Backup do Banco de Dados

```bash
# Backup manual
pg_dump -U spree_user spree_saas > backup-$(date +%Y%m%d).sql

# Automático com cron (diário às 2AM)
0 2 * * * pg_dump -U spree_user spree_saas > /backups/spree-$(date +\\%Y\\%m\\%d).sql

# Restaurar de um backup
psql -U spree_user spree_saas < backup-20240320.sql
```

## 7. Troubleshooting

### Problema: 502 Bad Gateway no Nginx
```bash
# Verificar se Next.js está rodando
pm2 status

# Revisar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problema: Conexão recusada ao banco de dados
```bash
# Verificar variáveis de ambiente
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL
```

### Problema: Rotas de tenant não funcionam
- Verificar DNS wildcard: `nslookup test.seuloja.com`
- Verificar middleware.ts está correto
- Verificar Nginx está aceitando todos os subdomínios

## 8. Segurança Essencial

- [ ] Habilitar HTTPS/SSL
- [ ] Configurar firewall (ufw, iptables)
- [ ] Usar .env para variáveis sensíveis
- [ ] Ativar 2FA em Vercel/GitHub
- [ ] Rotação regular de senhas e secrets
- [ ] Fazer backup diário do banco de dados
- [ ] Monitorar logs de erro

## Suporte

Para problemas:
1. Verificar logs: `pm2 logs` ou dashboard Vercel
2. Testar localmente: `pnpm dev`
3. Verificar variáveis de ambiente
4. Consultar documentação Vercel/Supabase/PostgreSQL
