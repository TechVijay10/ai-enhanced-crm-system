# AI-Enhanced CRM System

A full-stack Customer Relationship Management system built with a microservices architecture.

## Architecture

```
                        ┌─────────────────┐
                        │  React Frontend │  :3000
                        │   (Vite / Nginx)│
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
        │           │           │           │            │
   ┌────▼────┐ ┌────▼──────┐ ┌──▼──────────▼────────────▼───┐
   │Recommend│ │Notification│ │       Oracle XE :1521        │
   │  :8085  │ │   :8086   │ └──────────────────────────────┘
   └─────────┘ └───────────┘
   ┌─────────┐
   │ Social  │
   │  :8088  │
   └─────────┘

   ┌─────────────────┐     ┌──────────────────┐
   │  Eureka Server  │     │  Config Server   │
   │     :8761       │     │     :8888        │
   └─────────────────┘     └──────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Recharts, SockJS + STOMP |
| API Gateway | Spring Cloud Gateway |
| Microservices | Spring Boot 3.2.5, Java 17 |
| Service Discovery | Netflix Eureka |
| Config | Spring Cloud Config Server |
| Database | Oracle XE 21c |
| Security | Spring Security + JWT |
| Real-time | WebSocket (STOMP over SockJS) |
| Containerization | Docker + Docker Compose |

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

## Prerequisites

- **Local run:** Java 17, Maven 3.9+, Node.js 18+, Oracle XE 21c
- **Docker run:** Docker Desktop 4.x+

## Running Locally (Windows)

### 1. Start Oracle XE
```bat
net start OracleServiceXE
net start OracleXETNSListener
```

### 2. Initialise the database (first time only)
Connect to Oracle as `system/oracle` and run:
```sql
@database/01_tables.sql
@database/02_triggers.sql
@database/03_seed.sql
```

### 3. Build all backend services
```bat
cd backend
mvn clean package -DskipTests
```

### 4. Start services in order
Run each script in `launch/` in a separate terminal:
```
launch\01-eureka.bat      → wait ~20s
launch\02-config.bat      → wait ~15s
launch\03-gateway.bat     → wait ~15s
launch\04-auth.bat        → (parallel)
launch\05-customer.bat    → (parallel)
launch\06-leads.bat       → (parallel)
launch\07-analytics.bat   → (parallel)
launch\08-recommendation.bat
launch\09-notification.bat
launch\10-tasks.bat
launch\11-social.bat
launch\12-frontend.bat    → last
```

### 5. Open the app
- Frontend: http://localhost:3000
- Eureka Dashboard: http://localhost:8761

## Running with Docker

### 1. Copy and configure environment
```bash
cp .env.example .env
# Edit .env with your values (especially JWT_SECRET in production)
```

### 2. Build and start all containers
```bash
docker-compose up --build
```
> First run takes ~5–10 minutes (Maven downloads + Oracle XE init).

### 3. Initialise the database (first time)
Once Oracle XE is healthy, run the schema:
```bash
docker exec -it crm-oracle-xe sqlplus system/oracle@XE @/container-entrypoint-initdb.d/01_tables.sql
```

### 4. Open the app
- Frontend: http://localhost:3000
- Eureka Dashboard: http://localhost:8761

### Useful Docker commands
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (wipes database)
docker-compose down -v

# View logs for a specific service
docker-compose logs -f auth-service

# Rebuild a single service
docker-compose up --build auth-service
```

## Project Structure

```
crm-system/
├── backend/                    # Java Spring Boot microservices
│   ├── pom.xml                 # Maven parent POM
│   ├── eureka-server/          # Service discovery
│   ├── config-server/          # Centralised config
│   ├── api-gateway/            # Gateway + JWT filter
│   ├── auth-service/           # Authentication
│   ├── customer-service/       # Customer management
│   ├── lead-service/           # Lead management
│   ├── analytics-service/      # Reporting
│   ├── recommendation-service/ # AI recommendations
│   ├── notification-service/   # Email + WebSocket
│   ├── task-service/           # Task management
│   └── social-analytics-service/
├── frontend/
│   └── crm-frontend/           # React + Vite app
├── database/                   # Oracle SQL scripts
│   ├── 01_tables.sql
│   ├── 02_triggers.sql
│   └── 03_seed.sql
├── launch/                     # Windows batch scripts (local run)
├── docker-compose.yml          # Full-stack Docker orchestration
├── .env.example                # Environment variable template
└── start-crm.bat               # Local startup helper
```

## Environment Variables

See [.env.example](.env.example) for all configurable values.

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `system` | Oracle DB username |
| `DB_PASSWORD` | `oracle` | Oracle DB password |
| `JWT_SECRET` | *(see file)* | JWT signing secret — change in production |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server for notifications |
| `MAIL_USERNAME` | — | Email sender address |
| `MAIL_PASSWORD` | — | Email app password |
