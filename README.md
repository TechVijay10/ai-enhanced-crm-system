# AI-Enhanced CRM System

![CI](https://github.com/TechVijay10/ai-enhanced-crm-system/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/TechVijay10/ai-enhanced-crm-system)

A full-stack Customer Relationship Management system built with a microservices architecture — Spring Boot backend, React frontend, Oracle XE database, fully containerised with Docker.

---

## Architecture

```
                        ┌─────────────────┐
                        │  React Frontend │  :3000
                        │  (Vite / Nginx) │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   API Gateway   │  :9090
                        │  (Spring Cloud) │
                        └────────┬────────┘
                                 │  JWT Auth Filter
          ┌──────────────────────┼───────────────────────┐
          │          │           │           │            │
   ┌──────▼──┐ ┌─────▼───┐ ┌────▼────┐ ┌───▼────┐ ┌────▼────────┐
   │  Auth   │ │Customer │ │  Lead   │ │ Task   │ │  Analytics  │
   │  :8081  │ │  :8082  │ │  :8083  │ │ :8087  │ │    :8084    │
   └────┬────┘ └────┬────┘ └────┬────┘ └───┬────┘ └────┬────────┘
        │                                               │
   ┌────▼────┐ ┌────────────┐ ┌─────────┐ ┌────────────▼──────────┐
   │Recommend│ │Notification│ │ Social  │ │      Oracle XE :1521  │
   │  :8085  │ │   :8086    │ │  :8088  │ └───────────────────────┘
   └─────────┘ └────────────┘ └─────────┘

   ┌──────────────────┐     ┌──────────────────┐
   │  Eureka  :8761   │     │  Config  :8888   │
   └──────────────────┘     └──────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Recharts, SockJS + STOMP |
| API Gateway | Spring Cloud Gateway |
| Microservices | Spring Boot 3.2.5, Java 17 |
| Service Discovery | Netflix Eureka |
| Config | Spring Cloud Config Server |
| Database | Oracle XE 21c |
| Security | Spring Security + JWT (JJWT 0.12.3) |
| Real-time | WebSocket (STOMP over SockJS) |
| Containerisation | Docker + Docker Compose |
| CI | GitHub Actions |

---

## Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| React Frontend | 3000 | Main UI |
| API Gateway | 9090 | Single entry point, JWT validation |
| Auth Service | 8081 | Login, registration, token management |
| Customer Service | 8082 | Customer CRUD & interactions |
| Lead Service | 8083 | Lead tracking & scoring |
| Analytics Service | 8084 | Sales & customer reports |
| Recommendation Service | 8085 | AI-based customer recommendations |
| Notification Service | 8086 | Email & WebSocket notifications |
| Task Service | 8087 | Task & assignment management |
| Social Analytics | 8088 | Social media analytics |
| Eureka Server | 8761 | Service discovery dashboard |
| Config Server | 8888 | Centralised configuration |
| Oracle XE | 1521 | Database |

---

## Project Structure

```
ai-enhanced-crm-system/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions — build + lint on push/PR
├── backend/                    # Java Spring Boot microservices
│   ├── pom.xml                 # Maven parent POM (multi-module)
│   ├── eureka-server/          # Service discovery  :8761
│   ├── config-server/          # Centralised config  :8888
│   ├── api-gateway/            # Gateway + JWT filter  :9090
│   ├── auth-service/           # Authentication  :8081
│   ├── customer-service/       # Customer management  :8082
│   ├── lead-service/           # Lead management  :8083
│   ├── analytics-service/      # Reporting & analytics  :8084
│   ├── recommendation-service/ # AI recommendations  :8085
│   ├── notification-service/   # Email + WebSocket  :8086
│   ├── task-service/           # Task management  :8087
│   └── social-analytics-service/ # Social analytics  :8088
├── frontend/                   # React + Vite app  :3000
│   ├── src/
│   │   ├── api/                # Axios config
│   │   ├── components/         # Shared components (Sidebar, PrivateRoute)
│   │   ├── context/            # Auth + WebSocket context providers
│   │   └── pages/              # Login, Dashboard, Customers, Leads...
│   ├── Dockerfile              # Multi-stage: Node build → Nginx serve
│   └── nginx.conf              # Nginx proxy config for production
├── database/
│   └── migrations/             # Oracle SQL scripts (run in order)
│       ├── 01_tables.sql       # Schema & sequences
│       ├── 02_triggers.sql     # Auto-increment triggers
│       ├── 03_seed.sql         # Sample data
│       └── schema.sql          # Combined all-in-one script
├── scripts/                    # Windows batch scripts for local dev
│   ├── 01-eureka.bat           # Start Eureka (run first)
│   ├── 02-config.bat
│   ├── 03-gateway.bat
│   ├── 04-auth.bat ... 12-frontend.bat
│   └── start-crm.bat           # Startup guide & Oracle XE check
├── docker-compose.yml          # Full-stack Docker orchestration
├── .env.example                # Environment variable template
├── .gitignore
├── LICENSE
└── README.md
```

---

## Prerequisites

| Tool | Version | Local run | Docker run |
|------|---------|-----------|------------|
| Java | 17+ | Required | Not needed |
| Maven | 3.9+ | Required | Not needed |
| Node.js | 18+ | Required | Not needed |
| Oracle XE | 21c | Required | Not needed |
| Docker Desktop | 4.x+ | Not needed | Required |

---

## Running with Docker (Recommended)

### 1. Clone the repo
```bash
git clone https://github.com/TechVijay10/ai-enhanced-crm-system.git
cd ai-enhanced-crm-system
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — change JWT_SECRET and DB_PASSWORD for production
```

### 3. Start all containers
```bash
docker compose up --build
```
> First run takes ~5–10 minutes (Maven downloads + Oracle XE initialisation).

### 4. Initialise database (first time only)
Once Oracle XE is healthy, seed the schema:
```bash
docker exec -it crm-oracle-xe sqlplus system/oracle@XE @/container-entrypoint-initdb.d/01_tables.sql
docker exec -it crm-oracle-xe sqlplus system/oracle@XE @/container-entrypoint-initdb.d/02_triggers.sql
docker exec -it crm-oracle-xe sqlplus system/oracle@XE @/container-entrypoint-initdb.d/03_seed.sql
```

### 5. Access the app
| URL | Description |
|-----|-------------|
| http://localhost:3000 | CRM Frontend |
| http://localhost:8761 | Eureka Dashboard |
| http://localhost:9090 | API Gateway |

### Useful Docker commands
```bash
docker compose down            # Stop all
docker compose down -v         # Stop + wipe database volume
docker compose logs -f auth-service   # Tail a service log
docker compose up --build auth-service  # Rebuild one service
```

---

## Running Locally (Windows)

### 1. Start Oracle XE
```bat
net start OracleServiceXE
net start OracleXETNSListener
```

### 2. Run database migrations (first time only)
Connect to Oracle as `system / oracle` and run:
```
@database/migrations/01_tables.sql
@database/migrations/02_triggers.sql
@database/migrations/03_seed.sql
```

### 3. Build all backend services
```bat
cd backend
mvn clean package -DskipTests
```

### 4. Start services in order
Open a separate terminal for each script in `scripts/`:
```
scripts\01-eureka.bat       ← wait ~20 s
scripts\02-config.bat       ← wait ~15 s
scripts\03-gateway.bat      ← wait ~15 s
scripts\04-auth.bat         ┐
scripts\05-customer.bat     │ start in
scripts\06-leads.bat        │ parallel
scripts\07-analytics.bat    │
scripts\08-recommendation.bat│
scripts\09-notification.bat │
scripts\10-tasks.bat        │
scripts\11-social.bat       ┘
scripts\12-frontend.bat     ← last
```

---

## Environment Variables

Copy `.env.example` to `.env` before running Docker.

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `system` | Oracle DB username |
| `DB_PASSWORD` | `oracle` | Oracle DB password — **change in production** |
| `JWT_SECRET` | *(see file)* | JWT signing key — **change in production** |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host for notifications |
| `MAIL_USERNAME` | — | Email sender address |
| `MAIL_PASSWORD` | — | Email app password |

---

## License

[MIT](LICENSE) © 2026 TechVijay10
