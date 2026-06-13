# Modular Component Showcase

A full-stack modular UI component showcase application demonstrating:

- **Frontend**: React 19 + Vite (Login, Signup, Dashboard, Component Showcase, Admin Panel)
- **API Gateway**: FastAPI (routes all requests to appropriate backends)
- **Backend 1**: Spring Boot 3.4.5 (JWT Auth, RBAC, PostgreSQL CRUD)
- **Backend 2**: Node.js + Express + MongoDB (Categories and Reviews CRUD)
- **Database**: PostgreSQL (User/Component data) + MongoDB (Categories/Reviews)

## Architecture

```
Browser → FastAPI Gateway (:8000) → Spring Boot (:9090) → PostgreSQL
                                  → Node.js (:5000) → MongoDB
```

## Project Structure

```
modular-component-showcase/
├── src/                    # React frontend
│   ├── components/         # Navbar, ProtectedRoute
│   ├── context/            # AuthContext (JWT-based auth)
│   ├── pages/              # Login, Signup, Dashboard, Admin, etc.
│   └── showcase/           # Component previews (Button, Card, Table, etc.)
├── FastApi/                # API Gateway (Python/FastAPI)
│   └── main.py             # Proxies to Spring Boot + Node.js
├── backend/                # Spring Boot backend
│   └── src/main/java/com/showcase/
│       ├── config/         # SecurityConfig, CorsConfig
│       ├── controller/     # AuthController, ComponentController
│       ├── model/          # User, Role, ShowcaseComponent
│       ├── repository/     # JPA repositories
│       ├── security/       # JwtUtil, JwtAuthFilter
│       └── service/        # AuthService, ComponentService
├── node-backend/           # Node.js + Express backend
│   ├── models/             # Category, Review (Mongoose)
│   ├── routes/             # categories.js, reviews.js
│   └── server.js           # Express server
└── pom.xml                 # Maven parent POM
```

## Getting Started

### Prerequisites
- Node.js 20+
- Java 25+
- Python 3.10+
- PostgreSQL (running on localhost:5432)
- MongoDB (running on localhost:27017)

### 1. Frontend
```bash
npm install
npm run dev        # Starts on :5173
```

### 2. FastAPI Gateway
```bash
cd FastApi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Spring Boot Backend
```bash
# Ensure PostgreSQL has database 'modular_showcase'
cd backend
mvn spring-boot:run   # Starts on :9090
```

### 4. Node.js Backend
```bash
cd node-backend
npm install
npm start             # Starts on :5000
```

## API Endpoints

### FastAPI Gateway (:8000)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Gateway + Spring Boot health |
| POST | `/api/auth/login` | No | User login (returns JWT) |
| POST | `/api/auth/signup` | No | User registration |
| GET | `/api/auth/users` | Admin | List all users |
| DELETE | `/api/auth/users/{id}` | Admin | Delete user |
| GET | `/api/components` | No | List components |
| GET | `/api/components/{id}` | No | Component details |
| POST | `/api/components` | Admin | Create component |
| PUT | `/api/components/{id}` | Admin | Update component |
| DELETE | `/api/components/{id}` | Admin | Delete component |

### Spring Boot (:9090)
- All `/api/auth/*` and `/api/components/*` endpoints (authenticated via FastAPI)

### Node.js (:5000)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Node.js + MongoDB health |
| GET/POST | `/api/categories` | List/Create categories |
| GET/PUT/DELETE | `/api/categories/{id}` | Category CRUD |
| GET/POST | `/api/reviews` | List/Create reviews |
| GET/PUT/DELETE | `/api/reviews/{id}` | Review CRUD |

## Security

- JWT-based authentication (token returned on login)
- BCrypt password hashing
- Role-based access control (USER, ADMIN)
- Spring Security with method-level `@PreAuthorize`
- All requests routed through FastAPI Gateway with JWT validation

## Rubrics Coverage

### Review-2 (7 × 10 = 70 Marks)
1. ✅ Frontend UI Design & Functionality — React + Vite
2. ✅ API Gateway Implementation — FastAPI with proxying
3. ✅ Spring Boot Security — JWT + RBAC with Spring Security
4. ✅ Spring Boot CRUD — Component entity with full CRUD
5. ✅ PostgreSQL Database — JPA entities + SQL scripts
6. ✅ System Integration — Gateway → Spring Boot → PostgreSQL
7. ✅ Git Collaboration — Branches, meaningful commits

### Review-3 (7 × 10 = 70 Marks)
1. ✅ Frontend UI Design & Functionality — React + Vite
2. ✅ API Gateway Implementation — FastAPI with proxying
3. ✅ Spring Boot Backend — JWT, RBAC, full CRUD operations
4. ✅ Node.js Backend — Express + MongoDB CRUD
5. ✅ Database Design — PostgreSQL + MongoDB
6. ✅ System Integration — Gateway → Both Backends → Both DBs
7. ✅ Git Collaboration — Branches, meaningful commits
