# 🖥️ VPS Deployment Guide (Hostinger)

Step-by-step guide to deploy the AlumnAI backend on a Hostinger VPS using Docker Compose, Nginx reverse proxy, and Let's Encrypt SSL. The frontend is deployed separately on Vercel.

---

## Architecture

```
Vercel (client) ──► VPS (server:8000) ──► Neon (PostgreSQL) + Upstash (Redis)
```

- **Frontend (client/)**: Deployed on Vercel — free, global CDN, automatic Next.js builds
- **Backend (server/)**: Deployed on Hostinger VPS — full control for Socket.IO, Redis, long-running processes
- **Database**: Neon PostgreSQL (managed, already in use)
- **Cache**: Upstash Redis (managed, already in use)
- **Storage**: Cloudinary (managed)

---

## Prerequisites

- Hostinger VPS plan (Ubuntu 22.04/24.04 recommended)
- A domain or subdomain (e.g., `api.yourdomain.com`)
- SSH access (provided by Hostinger after provisioning)
- Vercel account (for frontend deployment)

---

## Step 1 — Initial Server Setup

SSH into your VPS:

```bash
ssh root@YOUR_VPS_IP
```

Update the system:

```bash
apt update && apt upgrade -y
```

Install essential packages:

```bash
apt install -y curl git ufw
```

Set up the firewall:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Step 2 — Install Docker & Docker Compose

Install Docker:

```bash
curl -fsSL https://get.docker.com | sh
```

Verify:

```bash
docker --version
docker compose version
```

Add your user to the `docker` group (optional, avoids `sudo`):

```bash
usermod -aG docker $USER
```

Log out and SSH back in for the group change to take effect.

---

## Step 3 — Clone the Repository

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/alumnai.git
cd alumnai
```

---

## Step 4 — Configure Server Environment Variables

```bash
cp server/.env.example server/.env
nano server/.env
```

Fill in your production values:

```env
APP_NAME="AlumnAI"
NODE_ENV=production
PORT=8000

# Frontend URL (your Vercel deployment)
FRONTEND_URL="https://yourproject.vercel.app"

# Backend URL (your VPS API domain)
BACKEND_URL="https://api.yourdomain.com"

# Database (Neon)
DATABASE_URL="your_neon_postgres_connection_string"

# Redis (Upstash)
REDIS_URL="your_upstash_redis_connection_string"

# JWT — generate a strong secret
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

> **Generate a strong JWT_SECRET**: `openssl rand -hex 32`

---

## Step 5 — DNS Setup (Hostinger Panel)

Add a DNS A record for your API subdomain:

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| A | `api` | `YOUR_VPS_IP` | 14400 |

This maps `api.yourdomain.com` → your VPS.

---

## Step 6 — Nginx Configuration

The Nginx config is already in `nginx/conf.d/default.conf`. Replace the placeholder:

```bash
sed -i 's/YOUR_API_DOMAIN/api.yourdomain.com/g' nginx/conf.d/default.conf
```

Or edit manually:

```bash
nano nginx/conf.d/default.conf
```

Replace `YOUR_API_DOMAIN` with your actual API domain (e.g., `api.alumnai.com`).

---

## Step 7 — Initial SSL Certificate

1. Start the stack:

```bash
docker compose up -d
```

2. Request the initial SSL certificate:

```bash
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d api.yourdomain.com
```

3. Restart Nginx to pick up the certificate:

```bash
docker compose restart nginx
```

---

## Step 8 — Verify Everything

```bash
# Check all containers are running
docker compose ps

# Check server logs
docker compose logs -f server

# Check nginx logs
docker compose logs -f nginx

# Health check
curl https://api.yourdomain.com/
```

---

## Step 9 — Auto-Renewal

The `certbot` service container handles renewal automatically (every 12 hours). To manually renew:

```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```

---

## Updating the Backend

### Option A — GitHub Actions (Automatic)

Pushes to `main` that change `server/**` files automatically deploy to the VPS via GitHub Actions.

**One-time setup:**

1. Generate an SSH key pair on your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

2. Add the **public** key to your VPS:

```bash
# Copy the public key content
cat ~/.ssh/github_actions_deploy.pub

# SSH into your VPS and add it
ssh root@YOUR_VPS_IP
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
exit
```

3. Add these 3 secrets in your GitHub repo (Settings → Secrets and variables → Actions):

| Secret | Value |
| :--- | :--- |
| `VPS_HOST` | Your VPS IP address |
| `VPS_USERNAME` | `root` (or your SSH user) |
| `VPS_SSH_KEY` | Contents of `~/.ssh/github_actions_deploy` (private key) |

4. Ensure the repo is cloned on your VPS:

```bash
ssh root@YOUR_VPS_IP
cd /opt
git clone https://github.com/YOUR_USERNAME/alumnai.git
```

After this, every push to `main` with changes in `server/` will auto-deploy.

### Option B — Manual Deploy

```bash
ssh root@YOUR_VPS_IP
cd /opt/alumnai

git pull origin main

docker compose up -d --build
```

---

## Deploy Frontend to Vercel

In your AlumnAI repo root on Vercel:

1. Connect your GitHub repo
2. Set **Root Directory** to `client`
3. Add environment variable:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://api.yourdomain.com`
   - `NEXT_PUBLIC_BASE_URL` = `https://yourproject.vercel.app`
4. Deploy

---

## Useful Commands

| Command | Purpose |
| :--- | :--- |
| `docker compose up -d` | Start all services in background |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | Tail logs from all services |
| `docker compose logs -f server` | Tail only backend logs |
| `docker compose exec server sh` | Shell into the backend container |
| `docker compose restart server` | Restart only the backend |
| `docker compose build --no-cache` | Rebuild images from scratch |

---

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| `502 Bad Gateway` | Check if `server` container is running: `docker compose ps` |
| SSL cert failed | Ensure DNS A record points to VPS IP and ports 80/443 are open |
| Socket.IO not connecting | Verify the Nginx `/socket.io/` block has `Upgrade` and `Connection` headers |
| CORS errors | Confirm `FRONTEND_URL` in `server/.env` matches your Vercel URL exactly |
| Database connection refused | Confirm `DATABASE_URL` is correct and Neon allows connections |
| Container keeps restarting | Check logs: `docker compose logs -f server` |
