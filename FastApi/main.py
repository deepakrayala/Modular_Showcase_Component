"""
FastAPI Gateway - Entry point for all frontend requests.
Proxies auth and CRUD operations to Spring Boot backend.
Provides its own lightweight endpoints for component metadata.
"""

import json
import jwt
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SPRING_BOOT_URL = "http://localhost:9090"
JWT_SECRET = "MySuperSecretKeyForJWTTokenGeneration2026SpringBootApp!@#$"
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Modular Component Showcase - API Gateway")

# CORS - Allow frontend dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# HTTP client (shared across requests)
# ---------------------------------------------------------------------------
client = httpx.AsyncClient(base_url=SPRING_BOOT_URL, timeout=30.0)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def decode_token(authorization: str | None) -> dict | None:
    """Validate and decode JWT from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization[7:]
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None


async def proxy_request(
    method: str, path: str, request: Request, auth_required: bool = False
) -> JSONResponse:
    """Proxy an HTTP request to the Spring Boot backend."""
    # Auth check
    payload = None
    if auth_required:
        payload = decode_token(request.headers.get("Authorization"))
        if payload is None:
            raise HTTPException(status_code=401, detail="Unauthorized")

    # Build forwarded headers (copy Authorization if present)
    headers = {}
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header

    # Read body if present
    body = None
    if method in ("POST", "PUT", "PATCH"):
        body = await request.body()

    try:
        response = await client.request(
            method=method,
            url=path,
            headers=headers,
            content=body,
        )
        content_type = response.headers.get("content-type", "")
        if "application/json" in content_type:
            return JSONResponse(
                status_code=response.status_code,
                content=response.json(),
            )
        return JSONResponse(
            status_code=response.status_code,
            content={"text": response.text},
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Backend service unavailable: {str(e)}",
        )


# ---------------------------------------------------------------------------
# Gateway Health / Metadata endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "name": "Modular Component Showcase - API Gateway",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    """Gateway health check — also pings Spring Boot."""
    backend_ok = False
    try:
        r = await client.get("/api/auth/health")
        backend_ok = r.status_code == 200
    except Exception:
        pass

    return {
        "gateway": "ok",
        "spring_boot": "ok" if backend_ok else "unreachable",
        "timestamp": __import__("datetime").datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# Auth routes — proxied to Spring Boot
# ---------------------------------------------------------------------------
@app.post("/api/auth/signup")
async def signup(request: Request):
    return await proxy_request("POST", "/api/auth/signup", request)


@app.post("/api/auth/login")
async def login(request: Request):
    return await proxy_request("POST", "/api/auth/login", request)


@app.get("/api/auth/users")
async def get_users(request: Request):
    return await proxy_request("GET", "/api/auth/users", request, auth_required=True)


@app.delete("/api/auth/users/{user_id}")
async def delete_user(user_id: int, request: Request):
    return await proxy_request("DELETE", f"/api/auth/users/{user_id}", request, auth_required=True)


@app.get("/api/auth/health")
async def auth_health(request: Request):
    return await proxy_request("GET", "/api/auth/health", request)


# ---------------------------------------------------------------------------
# Component CRUD — proxied to Spring Boot
# ---------------------------------------------------------------------------
@app.get("/api/components")
async def get_components(request: Request):
    return await proxy_request("GET", "/api/components", request)


@app.get("/api/components/{component_id}")
async def get_component(component_id: int, request: Request):
    return await proxy_request("GET", f"/api/components/{component_id}", request)


@app.post("/api/components")
async def create_component(request: Request):
    return await proxy_request("POST", "/api/components", request, auth_required=True)


@app.put("/api/components/{component_id}")
async def update_component(component_id: int, request: Request):
    return await proxy_request("PUT", f"/api/components/{component_id}", request, auth_required=True)


@app.delete("/api/components/{component_id}")
async def delete_component(component_id: int, request: Request):
    return await proxy_request("DELETE", f"/api/components/{component_id}", request, auth_required=True)


# ---------------------------------------------------------------------------
# Legacy endpoint — kept for backward compatibility
# ---------------------------------------------------------------------------
@app.get("/components")
def static_components():
    return {
        "components": [
            "Navbar", "Sidebar", "Button", "Card", "Modal",
            "DataTable", "Form", "Badge", "Alert", "Spinner",
        ]
    }


# ---------------------------------------------------------------------------
# Shutdown
# ---------------------------------------------------------------------------
@app.on_event("shutdown")
async def shutdown():
    await client.aclose()
