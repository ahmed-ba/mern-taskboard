# TaskBoard — MERN DevOps Mini Project

A GitHub-ready MERN task manager with CRUD, MongoDB persistence, Docker Compose, and Nginx frontend reverse proxy.

## Stack
- MongoDB 7 (private Docker network + persistent named volume)
- Express / Node.js 22 REST API
- React 19 / Vite 6 frontend
- Docker Compose / Nginx

## Start on VPS (Ubuntu + Docker installed)
```bash
cp .env.example .env
# IMPORTANT: edit .env and replace REPLACE_WITH_RANDOM_HEX_PASSWORD, e.g. with openssl rand -hex 24
sudo docker compose up -d --build
sudo docker compose ps
curl -i http://127.0.0.1:8080/api/health
```

Easier secure password generation:
```bash
printf 'MONGO_ROOT_PASSWORD=%s\n' "$(openssl rand -hex 24)" > .env
chmod 600 .env
```

Frontend is bound only to `127.0.0.1:8080` on host. MongoDB and the API are **not** published on host ports. Nginx inside frontend forwards `/api/` to `api:3000` over the Compose private network.

### Host Nginx example
For `app.183.lebondeveloppeur.net`, proxy to `http://127.0.0.1:8080`. For `api.183.lebondeveloppeur.net`, you can proxy `/` to `http://127.0.0.1:8080/api/` (the app's API) using an appropriate Nginx location/proxy_pass setup. Apply Let's Encrypt HTTPS after validating DNS and port 80/443 reachability.

## API routes
- `GET /api/health` readiness
- `GET /api/tasks` all tasks
- `POST /api/tasks` JSON `{ "title": "Example", "description": "Optional" }`
- `PATCH /api/tasks/:id` JSON `{ "completed": true }` or `{ "title": "New title" }`
- `DELETE /api/tasks/:id`

## Check logs
```bash
sudo docker compose logs --tail=100 api
sudo docker compose logs --tail=100 mongo
sudo docker compose down  # does not remove database volume
```
Never run `docker compose down -v` unless you intend to delete your DB volume.

## Security and limits
This is a **course demo**: no account authentication, and all tasks are shared by all visitors. Do not put private data in it or expose it as a production multi-user service without authentication/authorization. Never commit `.env` (excluded by `.gitignore`). Before enabling public access, rotate any exposed VPS passwords, use SSH keys, inspect host Nginx config and configure firewall safely. Docker containers use only internal networking except the localhost frontend.

## Publish to GitHub
Create an empty private repo `mern-taskboard`, then:
```bash
git init -b main
git add .
git commit -m "Initial MERN TaskBoard project"
git remote add origin https://github.com/YOUR_USERNAME/mern-taskboard.git
git push -u origin main
```
Authenticate with GitHub CLI or a supported Git credential method, **not** your GitHub account password over HTTPS.
