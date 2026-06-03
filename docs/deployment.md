# Deployment Guide

Production deployment for `geoportal.gis.iihs.co.in` running on Ubuntu 24 with Docker + nginx.

## Architecture

```
Internet → nginx (port 80) → TerriaMap container (127.0.0.1:3020)
                                      ↓
                               MinIO container (internal :9000)
                               stores share link JSON blobs
```

- TerriaMap and MinIO are containerised, bound to localhost only
- nginx handles the public-facing reverse proxy
- Share links are stored as JSON blobs in MinIO (`terriajs-shares` bucket)
- MinIO console accessible via SSH tunnel on port 9001

---

## Prerequisites

- Ubuntu 24
- Docker + Docker Compose V2 installed
- nginx installed
- DNS for `geoportal.gis.iihs.co.in` pointing to server IP

```bash
# Verify
docker compose version
nginx -v

# Install git if needed
sudo apt install -y git
```

---

## First-Time Setup

### 1. Clone the repo

```bash
cd /opt
sudo git clone https://github.com/iihs-gsl/geospatial-lab-geoportal.git geoportal
sudo chown -R $USER:$USER /opt/geoportal
cd /opt/geoportal
```

### 2. Set up credentials

```bash
# MinIO credentials
cp .env.example .env
nano .env   # fill in MINIO_ROOT_USER and MINIO_ROOT_PASSWORD (min 8 chars)

# Production serverconfig (with MinIO share config)
cp serverconfig.production.json.example serverconfig.production.json
nano serverconfig.production.json   # replace REPLACE_WITH_MINIO_ROOT_USER and REPLACE_WITH_MINIO_ROOT_PASSWORD with same values
```

### 3. Build and start all services

```bash
# Build TerriaMap image (5–15 mins — installs deps + yarn gulp release inside Docker)
docker compose build

# Start all services (TerriaMap + MinIO + bucket init) in background
docker compose up -d

# Verify everything is running
docker compose ps
docker compose logs -f
```

The MinIO init container runs once, creates the `terriajs-shares` bucket, then exits. TerriaMap waits for it before starting.

### 4. Install the nginx config

```bash
sudo cp deploy/nginx/geoportal.gis.iihs.co.in.conf \
     /etc/nginx/sites-available/geoportal.gis.iihs.co.in

sudo ln -s /etc/nginx/sites-available/geoportal.gis.iihs.co.in \
           /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx
```

### 5. Verify

```bash
curl -I http://geoportal.gis.iihs.co.in
```

Open **http://geoportal.gis.iihs.co.in** in a browser — the IIHS Geoportal should load.

---

## Accessing the MinIO Console

The MinIO admin panel runs on `127.0.0.1:9001` (internal only). Access it via SSH tunnel:

```bash
# Run on your LOCAL machine
ssh -L 9001:127.0.0.1:9001 user@your-server-ip
```

Then open **http://localhost:9001** — log in with the credentials from your `.env` file.

The console lets you browse the `terriajs-shares` bucket, inspect or delete stored share blobs, and monitor storage usage.

---

## Updating

When changes are pushed to the TerriaMap fork:

```bash
cd /opt/geoportal
git pull origin main
docker compose build
docker compose up -d
```

> `serverconfig.production.json` and `.env` are gitignored — `git pull` will never overwrite them.

---

## Useful Commands

```bash
# View live logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f app
docker compose logs -f minio

# Restart a service
docker compose restart app

# Stop all services
docker compose down

# Stop and remove volumes (destructive — deletes share data)
docker compose down -v

# Check health status
docker compose ps

# Reload nginx after config changes
sudo nginx -t && sudo systemctl reload nginx
```

---

## Files

| File                                         | Purpose                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `Dockerfile`                                 | Multi-stage production build (Node 22, `yarn gulp release`)             |
| `docker-compose.yml`                         | TerriaMap + MinIO services, port bindings, health checks                |
| `deploy/nginx/geoportal.gis.iihs.co.in.conf` | nginx HTTP reverse proxy config                                         |
| `serverconfig.json`                          | Dev server config — port 3020, no share config                          |
| `serverconfig.production.json`               | Prod config — MinIO share settings (gitignored, create from `.example`) |
| `.env`                                       | MinIO credentials (gitignored, create from `.env.example`)              |

---

## TODO: SSL

When ready to add HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d geoportal.gis.iihs.co.in
```

Certbot will auto-update the nginx config with certificate paths and add an HTTP→HTTPS redirect.
