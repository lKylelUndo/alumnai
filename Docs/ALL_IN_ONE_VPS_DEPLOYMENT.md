# 🖥️ All-in-One VPS Deployment Guide (Hostinger)

Deploy the entire AlumnAI stack on a single Hostinger VPS — Express backend, PostgreSQL, Redis, pgAdmin, and Nginx reverse proxy with SSL. The frontend is deployed separately on Vercel.

---

## Architecture

```
Vercel (client) ──► VPS (Hostinger)
                    │
                    ├── Nginx (80/443)
                    │   ├── api.yourdomain.com    → server:8000
                    │   └── pgadmin.yourdomain.com → pgadmin:5050
                    │
                    ├── server:8000   (Express + Socket.IO)
                    ├── postgres:5432 (PostgreSQL 16)
                    ├── redis:6379    (Redis 7)
                    └── pgadmin:5050  (pgAdmin 4)
```

- **Frontend**: Deployed on Vercel (free, global CDN)
- **Backend + DB + Cache**: All on one VPS
- **Storage**: Cloudinary (managed, kept as-is)

---

## Prerequisites

- Hostinger VPS plan (Ubuntu 22.04/24.04, 2GB+ RAM recommended)
- A domain with 2 subdomains (e.g., `api.yourdomain.com`, `pgadmin.yourdomain.com`)
- SSH access
- Vercel account (for frontend)

---

## Step 1 — Initial Server Setup

SSH into your VPS:

```bash
ssh root@YOUR_VPS_IP
```

Update and install essentials:

```bash
apt update && apt upgrade -y
apt install -y curl git ufw
```

Set up firewall:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Step 2 — Install Docker & Docker Compose

```bash
curl -fsSL https://get.docker.com | sh
docker --version
docker compose version
```

---

## Step 3 — Clone the Repository

```bash
cd /opt
git clone -b all-in-one-vps https://github.com/YOUR_USERNAME/alumnai.git
cd alumnai
```

---

## Step 4 — Create Docker Env File

Create a `.env` file in the project root for Docker Compose variables:

```bash
nano .env
```

```env
# PostgreSQL
POSTGRES_USER=alumnai
POSTGRES_PASSWORD=generate_a_strong_password_here
POSTGRES_DB=alumnai

# Redis
REDIS_PASSWORD=generate_another_strong_password_here

# pgAdmin
PGADMIN_EMAIL=admin@yourdomain.com
PGADMIN_PASSWORD=generate_a_third_strong_password_here
```

> **Generate strong passwords**: `openssl rand -hex 24`

---

## Step 5 — Configure Server Environment Variables

```bash
cp server/.env.example server/.env
nano server/.env
```

Fill in production values:

```env
APP_NAME="AlumnAI"
NODE_ENV=production
PORT=8000

# Frontend URL (Vercel)
FRONTEND_URL="https://yourproject.vercel.app"

# Backend URL (VPS)
BACKEND_URL="https://api.yourdomain.com"

# Database (local PostgreSQL container)
DATABASE_URL="postgresql://alumnai:your_password@postgres:5432/alumnai"

# Redis (local Redis container)
REDIS_URL="redis://:your_password@redis:6379"

# JWT
JWT_SECRET="run_openssl_rand_hex_32"

# Gemini & GitHub
GEMINI_KEY="your_gemini_key"
GITHUB_PAT="your_github_pat"

# Cloudinary
CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_SECRET_KEY="your_cloudinary_secret_key"

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_gmail_app_password"
SMTP_FROM="your_email@gmail.com"
```

> **Note**: `DATABASE_URL` and `REDIS_URL` use container names (`postgres`, `redis`) as hostnames because they're on the same Docker network.

---

## Step 6 — DNS Setup (Hostinger Panel)

Add these DNS A records:

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| A | `api` | `YOUR_VPS_IP` | 14400 |
| A | `pgadmin` | `YOUR_VPS_IP` | 14400 |

---

## Step 7 — Nginx Configuration

Replace placeholders in the Nginx config:

```bash
sed -i 's/YOUR_API_DOMAIN/api.yourdomain.com/g' nginx/conf.d/default.conf
sed -i 's/YOUR_PGADMIN_DOMAIN/pgadmin.yourdomain.com/g' nginx/conf.d/default.conf
```

---

## Step 8 — Start Everything

```bash
docker compose up -d
```

This starts all 6 containers: nginx, certbot, postgres, redis, pgadmin, server.

Check status:

```bash
docker compose ps
```

---

## Step 9 — Initial SSL Certificates

Request certificates for both subdomains:

```bash
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d api.yourdomain.com \
  -d pgadmin.yourdomain.com
```

Restart Nginx to load the certificates:

```bash
docker compose restart nginx
```

---

## Step 10 — Verify Everything

```bash
# Check all containers
docker compose ps

# Backend health check
curl https://api.yourdomain.com/

# Check server logs
docker compose logs -f server

# Check PostgreSQL is ready
docker compose exec postgres pg_isready -U alumnai
```

Test pgAdmin in your browser: `https://pgadmin.yourdomain.com`

Login with the email/password from your `.env` file.

To add the database server in pgAdmin:
- **Host**: `postgres`
- **Port**: `5432`
- **Username**: `alumnai`
- **Password**: (from your `.env`)

---

## Step 11 — Auto-Renewal

The certbot container handles renewal automatically. To manually renew:

```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```

---

## GitHub Actions Auto-Deploy

The same `deploy-server.yml` workflow works for this branch. Pushes to `main` with `server/**` changes auto-deploy.

**One-time setup** (same as managed-services branch):

1. Generate SSH key: `ssh-keygen -t ed25519 -C "github-actions"`
2. Add public key to VPS: `~/.ssh/authorized_keys`
3. Add GitHub secrets: `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`

The entrypoint script handles migrations automatically on every deploy.

---

## Data Persistence

All data is saved to Docker named volumes:

| Volume | Container | Data |
| :--- | :--- | :--- |
| `postgres-data` | postgres | Database files |
| `redis-data` | redis | Cache files |
| `pgadmin-data` | pgadmin | pgAdmin config + saved servers |

Volumes persist across container restarts and rebuilds.

---

## Database Backups

### Manual backup

```bash
docker compose exec postgres pg_dump -U alumnai alumnai > backup_$(date +%Y%m%d).sql
```

### Restore from backup

```bash
cat backup_20260831.sql | docker compose exec -T postgres psql -U alumnai -d alumnai
```

### Automated daily backup (optional)

Add a cron job on the VPS:

```bash
crontab -e
```

```
0 2 * * * cd /opt/alumnai && docker compose exec -T postgres pg_dump -U alumnai alumnai > /opt/backups/alumnai_$(date +\%Y\%m\%d).sql
```

Create the backups directory:

```bash
mkdir -p /opt/backups
```

---

## Updating

```bash
cd /opt/alumnai
git pull origin main
docker compose up -d --build
```

Migrations run automatically via the entrypoint script.

---

## Useful Commands

| Command | Purpose |
| :--- | :--- |
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | Tail all logs |
| `docker compose logs -f server` | Tail backend logs |
| `docker compose exec server sh` | Shell into backend |
| `docker compose exec postgres psql -U alumnai -d alumnai` | Connect to PostgreSQL |
| `docker compose exec redis redis-cli -a PASSWORD` | Connect to Redis |
| `docker compose restart server` | Restart backend only |
| `docker compose build --no-cache` | Rebuild from scratch |

---

## Deploy Frontend to Vercel

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `client`
3. Add environment variables:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://api.yourdomain.com`
   - `NEXT_PUBLIC_BASE_URL` = `https://yourproject.vercel.app`
4. Deploy

---

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| `502 Bad Gateway` | Check container status: `docker compose ps` |
| SSL cert failed | Verify DNS A records point to VPS IP, ports 80/443 open |
| Socket.IO not connecting | Verify Nginx `/socket.io/` block has WebSocket headers |
| CORS errors | Confirm `FRONTEND_URL` matches your Vercel URL exactly |
| PostgreSQL connection refused | Check `DATABASE_URL` format: `postgresql://user:pass@postgres:5432/db` |
| Redis connection refused | Check `REDIS_URL` format: `redis://:password@redis:6379` |
| pgAdmin won't load | Check `docker compose logs pgadmin` |
| Migrations not running | Check `docker compose logs server` for entrypoint output |
| Container keeps restarting | Check logs: `docker compose logs -f <service>` |
| Out of disk space | Run `docker system prune -a` to clean unused images |
