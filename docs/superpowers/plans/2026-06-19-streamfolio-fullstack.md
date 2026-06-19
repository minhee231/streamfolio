# Streamfolio Fullstack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google Stitch 설계(6개 HTML)를 기반으로 React+FastAPI 포트폴리오 풀스택 앱을 구현하고 Playwright로 사용자/관리자 시나리오가 모두 통과하는 상태를 만든다.

**Architecture:** FastAPI가 `/api/*` REST 엔드포인트를 제공하고, Vite dev server가 프록시로 연결된다. SQLite를 기본 DB로 사용하며 `DATABASE_URL` 환경변수로 PostgreSQL 전환이 가능하다.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS v3 / FastAPI + SQLAlchemy 2.x + aiosqlite / Playwright (E2E)

## Global Constraints

- Python 3.12+, Node.js 18+
- Tailwind 색상 토큰: `primary=#ffb4a8`, `primary-container=#ff5540`, `background=#131313`, `on-surface=#e5e2e1`
- 폰트: Inter (Google Fonts), 아이콘: Material Symbols Outlined
- 모든 답변·주석은 한국어, 코드 식별자는 영어
- 어드민 기본 계정: `admin / streamfolio2024`
- API prefix: `/api/v1`
- CORS: Vite dev server `http://localhost:5173`

---

### Task 1: 백엔드 스캐폴딩 (FastAPI + SQLite)

**Files:**
- Create: `backend/main.py`
- Create: `backend/app/__init__.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/db/engine.py`
- Create: `backend/app/db/session.py`
- Create: `backend/app/models/project.py`
- Create: `backend/app/models/admin.py`
- Create: `backend/app/schemas/project.py`
- Create: `backend/app/schemas/auth.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/routers/projects.py`
- Create: `backend/app/routers/auth.py`
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/conftest.py`
- Create: `backend/tests/test_projects.py`
- Create: `backend/tests/test_auth.py`

**Interfaces:**
- Produces: `GET /api/v1/projects`, `POST /api/v1/projects`, `PUT /api/v1/projects/{id}`, `DELETE /api/v1/projects/{id}`, `POST /api/v1/auth/login`

- [ ] **Step 1: requirements.txt 작성**

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
aiosqlite==0.20.0
asyncpg==0.29.0
pydantic==2.9.2
pydantic-settings==2.5.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
httpx==0.27.2
pytest==8.3.3
pytest-asyncio==0.24.0
anyio==4.6.2
```

- [ ] **Step 2: 디렉터리 생성 및 `__init__.py` 파일 생성**

```bash
cd backend
mkdir -p app/core app/db app/models app/schemas app/routers tests
touch app/__init__.py app/core/__init__.py app/db/__init__.py
touch app/models/__init__.py app/schemas/__init__.py app/routers/__init__.py
touch tests/__init__.py
```

- [ ] **Step 3: `app/core/config.py` 작성**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./dev.db"
    secret_key: str = "change-me-in-production-very-long-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    admin_username: str = "admin"
    admin_password: str = "streamfolio2024"
    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 4: `app/core/security.py` 작성**

```python
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except Exception:
        return None
```

- [ ] **Step 5: `app/db/engine.py` 작성**

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine: AsyncEngine = create_async_engine(settings.database_url, echo=False)

class Base(DeclarativeBase):
    pass
```

- [ ] **Step 6: `app/db/session.py` 작성**

```python
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from app.db.engine import engine

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

- [ ] **Step 7: `app/models/project.py` 작성**

```python
from sqlalchemy import String, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.engine import Base

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    thumbnail_url: Mapped[str] = mapped_column(String(500), default="")
    tech_stack: Mapped[str] = mapped_column(String(500), default="")  # comma-separated
    category: Mapped[str] = mapped_column(String(100), default="Full Stack")
    github_url: Mapped[str] = mapped_column(String(500), default="")
    live_url: Mapped[str] = mapped_column(String(500), default="")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    view_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

- [ ] **Step 8: `app/models/admin.py` 작성**

```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.engine import Base

class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(200))
```

- [ ] **Step 9: `app/schemas/project.py` 작성**

```python
from pydantic import BaseModel
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str = ""
    thumbnail_url: str = ""
    tech_stack: str = ""
    category: str = "Full Stack"
    github_url: str = ""
    live_url: str = ""
    is_featured: bool = False
    is_published: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

- [ ] **Step 10: `app/schemas/auth.py` 작성**

```python
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

- [ ] **Step 11: `app/routers/auth.py` 작성**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, create_access_token, decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.username == body.username))
    admin = result.scalar_one_or_none()
    if not admin or not verify_password(body.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": admin.username})
    return TokenResponse(access_token=token)

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncSession = Depends(get_db),
):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    result = await db.execute(select(Admin).where(Admin.username == payload["sub"]))
    admin = result.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin
```

- [ ] **Step 12: `app/routers/projects.py` 작성**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=list[ProjectOut])
async def list_projects(
    category: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Project).where(Project.is_published == True)
    if category and category != "All":
        query = query.where(Project.category == category)
    if search:
        query = query.where(Project.title.ilike(f"%{search}%"))
    query = query.order_by(Project.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.view_count += 1
    await db.commit()
    await db.refresh(project)
    return project

@router.post("/", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
async def create_project(body: ProjectCreate, db: AsyncSession = Depends(get_db)):
    project = Project(**body.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.put("/{project_id}", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
async def update_project(project_id: int, body: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, val in body.model_dump().items():
        setattr(project, key, val)
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}", dependencies=[Depends(get_current_admin)])
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"ok": True}
```

- [ ] **Step 13: `main.py` 작성**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.db.engine import engine, Base
from app.models import project, admin as admin_model
from app.core.config import settings
from app.core.security import get_password_hash
from app.routers import projects, auth
from app.db.session import AsyncSessionLocal
from app.models.admin import Admin
from sqlalchemy import select

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Admin).where(Admin.username == settings.admin_username))
        if not result.scalar_one_or_none():
            db.add(Admin(
                username=settings.admin_username,
                hashed_password=get_password_hash(settings.admin_password),
            ))
            await db.commit()
    yield

app = FastAPI(title="Streamfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 14: `tests/conftest.py` 작성**

```python
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db.engine import Base
from app.db.session import get_db
from main import app

TEST_DB_URL = "sqlite+aiosqlite:///./test.db"

@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DB_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def db_session(test_engine):
    Session = async_sessionmaker(test_engine, expire_on_commit=False)
    async with Session() as session:
        yield session

@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
```

- [ ] **Step 15: `tests/test_auth.py` 작성**

```python
import pytest
from app.models.admin import Admin
from app.core.security import get_password_hash

@pytest.mark.asyncio
async def test_login_success(client, db_session):
    db_session.add(Admin(username="testadmin", hashed_password=get_password_hash("testpass")))
    await db_session.commit()
    resp = await client.post("/api/v1/auth/login", json={"username": "testadmin", "password": "testpass"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()

@pytest.mark.asyncio
async def test_login_fail(client):
    resp = await client.post("/api/v1/auth/login", json={"username": "wrong", "password": "wrong"})
    assert resp.status_code == 401
```

- [ ] **Step 16: `tests/test_projects.py` 작성**

```python
import pytest
from app.models.admin import Admin
from app.core.security import get_password_hash

async def get_token(client, db_session) -> str:
    db_session.add(Admin(username="admin2", hashed_password=get_password_hash("pass2")))
    await db_session.commit()
    resp = await client.post("/api/v1/auth/login", json={"username": "admin2", "password": "pass2"})
    return resp.json()["access_token"]

@pytest.mark.asyncio
async def test_list_projects_empty(client):
    resp = await client.get("/api/v1/projects/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.asyncio
async def test_create_and_get_project(client, db_session):
    token = await get_token(client, db_session)
    headers = {"Authorization": f"Bearer {token}"}
    body = {"title": "Test Project", "description": "desc", "category": "Full Stack"}
    resp = await client.post("/api/v1/projects/", json=body, headers=headers)
    assert resp.status_code == 200
    pid = resp.json()["id"]
    resp2 = await client.get(f"/api/v1/projects/{pid}")
    assert resp2.json()["title"] == "Test Project"

@pytest.mark.asyncio
async def test_delete_project(client, db_session):
    token = await get_token(client, db_session)
    headers = {"Authorization": f"Bearer {token}"}
    resp = await client.post("/api/v1/projects/", json={"title": "ToDelete"}, headers=headers)
    pid = resp.json()["id"]
    del_resp = await client.delete(f"/api/v1/projects/{pid}", headers=headers)
    assert del_resp.status_code == 200
```

- [ ] **Step 17: pytest.ini 작성 및 테스트 실행**

```ini
# backend/pytest.ini
[pytest]
asyncio_mode = auto
```

```bash
cd backend
pip install -r requirements.txt
pytest -x -q
```

Expected: All tests PASS

---

### Task 2: 프론트엔드 스캐폴딩 (React + TypeScript + Vite + Tailwind)

**Files:**
- Create: `frontend/` (Vite 프로젝트 전체)
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/components/Layout.tsx`
- Create: `frontend/src/components/Sidebar.tsx`
- Create: `frontend/src/components/TopNav.tsx`
- Create: `frontend/src/components/ProjectCard.tsx`
- Create: `frontend/src/components/Chip.tsx`

**Interfaces:**
- Produces: `useProjects()` hook, `<ProjectCard>`, `<Layout>`, `<Sidebar>`

- [ ] **Step 1: Vite + React + TypeScript 프로젝트 생성**

```bash
cd C:/Users/USER/Documents/isaac-portfolio
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install axios @tanstack/react-query react-router-dom zustand
npm install -D @playwright/test @types/node
```

- [ ] **Step 2: `tailwind.config.ts` 작성** (Cinematic Stream 토큰 완전 등록)

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "background": "#131313",
        "surface": "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#ebbbb4",
        "outline": "#b18780",
        "outline-variant": "#603e39",
        "primary": "#ffb4a8",
        "on-primary": "#690100",
        "primary-container": "#ff5540",
        "on-primary-container": "#5c0000",
        "secondary": "#9ccaff",
        "on-secondary": "#003257",
        "secondary-container": "#2295ed",
        "tertiary": "#acc7ff",
        "tertiary-container": "#488fff",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        "surface-variant": "#353534",
        "surface-tint": "#ffb4a8",
      },
      spacing: {
        "sidebar-width": "240px",
        "sidebar-collapsed-width": "72px",
        "gutter": "16px",
        "margin-desktop": "24px",
        "margin-mobile": "16px",
        "container-max": "1280px",
      },
      fontSize: {
        "headline-xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 3: `src/index.css` 작성**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

* { box-sizing: border-box; }
body {
  font-family: 'Inter', sans-serif;
  background-color: #131313;
  color: #e5e2e1;
  overflow-x: hidden;
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.video-aspect { aspect-ratio: 16 / 9; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

- [ ] **Step 4: `src/types/index.ts` 작성**

```ts
export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  tech_stack: string;
  category: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
```

- [ ] **Step 5: `src/lib/api.ts` 작성**

```ts
import axios from "axios";

export const api = axios.create({ baseURL: "/api/v1" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const projectsApi = {
  list: (params?: { category?: string; search?: string }) =>
    api.get<import("../types").Project[]>("/projects/", { params }),
  get: (id: number) => api.get<import("../types").Project>(`/projects/${id}`),
  create: (data: Partial<import("../types").Project>) =>
    api.post<import("../types").Project>("/projects/", data),
  update: (id: number, data: Partial<import("../types").Project>) =>
    api.put<import("../types").Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const authApi = {
  login: (data: import("../types").LoginRequest) =>
    api.post<import("../types").TokenResponse>("/auth/login", data),
};
```

- [ ] **Step 6: `vite.config.ts` 프록시 설정**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
```

---

### Task 3: 공통 레이아웃 컴포넌트

**Files:**
- Create: `frontend/src/components/Sidebar.tsx`
- Create: `frontend/src/components/TopNav.tsx`
- Create: `frontend/src/components/Layout.tsx`
- Create: `frontend/src/components/ProjectCard.tsx`
- Create: `frontend/src/components/Chip.tsx`

- [ ] **Step 1: `Sidebar.tsx` 작성** (stitch _1 HTML의 `<aside>` 구조 그대로)

```tsx
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "home", label: "Home", fill: true },
  { to: "/explore", icon: "video_library", label: "Projects" },
  { to: "/about", icon: "person", label: "About" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-sidebar-width flex-col p-2 overflow-y-auto bg-background hidden md:flex">
      <nav className="space-y-1">
        {navItems.map(({ to, icon, label, fill }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? "bg-surface-container-highest text-on-surface font-bold"
                  : "text-on-surface hover:bg-surface-container"
              }`
            }
          >
            <span
              className="material-symbols-outlined"
              style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-label-md">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: `TopNav.tsx` 작성** (stitch _1 HTML의 `<header>` 구조)

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-background">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-headline-lg font-bold text-on-surface">
          <span
            className="material-symbols-outlined text-primary-container text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_circle
          </span>
          <span>Streamfolio</span>
        </div>
      </div>
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-10">
        <div className="flex w-full bg-surface-container-lowest border border-outline-variant rounded-full overflow-hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none px-5 py-2 text-body-md focus:ring-0 placeholder:text-on-surface-variant"
            placeholder="Search projects..."
          />
          <button
            type="submit"
            className="bg-surface-container-high px-5 border-l border-outline-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">search</span>
          </button>
        </div>
      </form>
      <div className="flex items-center gap-3">
        <NavLink to="/admin" className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined text-on-surface">settings</span>
        </NavLink>
      </div>
    </header>
  );
}

import { NavLink } from "react-router-dom";
```

- [ ] **Step 3: `Layout.tsx` 작성**

```tsx
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="bg-background min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="pt-14 md:pl-sidebar-width min-h-screen">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: `ProjectCard.tsx` 작성** (stitch _1 그리드 카드 구조)

```tsx
import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
      data-testid="project-card"
    >
      <div className="relative video-aspect rounded-xl overflow-hidden bg-surface-container-low mb-3">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">movie</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white text-5xl opacity-80"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-on-surface font-semibold text-body-md line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-on-surface-variant text-body-sm mb-0.5">{project.category}</p>
        <div className="flex items-center text-on-surface-variant text-body-sm">
          <span>{project.view_count.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `Chip.tsx` 작성**

```tsx
interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-label-md transition-colors ${
        active
          ? "bg-on-surface text-background font-bold"
          : "bg-surface-container-highest hover:bg-surface-container text-on-surface"
      }`}
    >
      {label}
    </button>
  );
}
```

---

### Task 4: 사용자 화면 6개 구현

**Files:**
- Create: `frontend/src/pages/HomePage.tsx`
- Create: `frontend/src/pages/ExplorePage.tsx`
- Create: `frontend/src/pages/ProjectDetailPage.tsx`
- Create: `frontend/src/pages/AboutPage.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/main.tsx`

- [ ] **Step 1: `HomePage.tsx` 작성** (stitch _1)

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import Chip from "../components/Chip";

const CATEGORIES = ["All", "Full Stack", "WebGL/Graphics", "Open Source", "Mobile Apps", "E-commerce", "AI/ML"];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", activeCategory],
    queryFn: () =>
      projectsApi.list(activeCategory !== "All" ? { category: activeCategory } : undefined).then((r) => r.data),
  });
  const featured = projects.find((p) => p.is_featured) ?? projects[0];
  const grid = projects.filter((p) => !p.is_featured);

  return (
    <div>
      {featured && (
        <section className="relative group mb-12 rounded-xl overflow-hidden shadow-2xl bg-surface-container-low">
          <div className="video-aspect relative w-full overflow-hidden">
            {featured.thumbnail_url && (
              <img src={featured.thumbnail_url} alt={featured.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/20" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full lg:w-2/3">
              <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-3 py-1 rounded-md text-label-sm uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Featured Project
              </div>
              <h1 className="text-headline-xl text-on-surface mb-3 drop-shadow-lg">{featured.title}</h1>
              <p className="text-body-md text-on-surface-variant mb-6 line-clamp-3 max-w-xl">{featured.description}</p>
            </div>
          </div>
        </section>
      )}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8">
        {CATEGORIES.map((cat) => (
          <Chip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>
      <div>
        <h2 className="text-headline-lg text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">recommend</span>
          Recommended Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-on-surface-variant text-body-md" data-testid="empty-state">
            아직 등록된 프로젝트가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {grid.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `ExplorePage.tsx` 작성** (stitch _3)

```tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import Chip from "../components/Chip";

const CATEGORIES = ["All", "Full Stack", "WebGL/Graphics", "Open Source", "Mobile Apps", "E-commerce", "AI/ML"];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects", category, search],
    queryFn: () =>
      projectsApi.list({
        category: category !== "All" ? category : undefined,
        search: search || undefined,
      }).then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-headline-xl text-on-surface mb-6">Explore Projects</h1>
      <div className="flex w-full bg-surface-container-lowest border border-outline-variant rounded-full overflow-hidden mb-6 max-w-2xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none px-5 py-2 text-body-md focus:ring-0 placeholder:text-on-surface-variant"
          placeholder="Search projects..."
          data-testid="search-input"
        />
        <button className="bg-surface-container-high px-5 border-l border-outline-variant hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined text-on-surface">search</span>
        </button>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8">
        {CATEGORIES.map((cat) => (
          <Chip key={cat} label={cat} active={category === cat} onClick={() => setCategory(cat)} />
        ))}
      </div>
      {projects.length === 0 ? (
        <p className="text-on-surface-variant text-body-md" data-testid="no-results">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `ProjectDetailPage.tsx` 작성** (stitch _5)

```tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.get(Number(id)).then((r) => r.data),
  });

  if (isLoading) return <div className="text-on-surface-variant text-body-md">Loading...</div>;
  if (!project) return <div className="text-error">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </button>
      <div className="rounded-xl overflow-hidden mb-6 video-aspect bg-surface-container-low">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant">movie</span>
          </div>
        )}
      </div>
      <h1 className="text-headline-xl text-on-surface mb-4" data-testid="project-title">{project.title}</h1>
      <p className="text-on-surface-variant text-body-md mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech_stack.split(",").filter(Boolean).map((tech) => (
          <span key={tech} className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-body-sm">
            {tech.trim()}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">code</span> GitHub
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">open_in_new</span> Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `AboutPage.tsx` 작성** (stitch _2)

```tsx
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-headline-xl text-on-surface mb-8">About</h1>
      <div className="flex gap-6 mb-10 items-center">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
        </div>
        <div>
          <h2 className="text-headline-lg text-on-surface mb-1">Isaac Developer</h2>
          <p className="text-on-surface-variant text-body-md">Full Stack Developer · Seoul, Korea</p>
        </div>
      </div>
      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {["TypeScript", "React", "FastAPI", "Python", "PostgreSQL", "Docker"].map((skill) => (
            <span key={skill} className="bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-body-md">
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-headline-lg text-on-surface mb-4">Contact</h3>
        <p className="text-on-surface-variant text-body-md">
          goominhee123@gmail.com
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: `App.tsx` 라우팅 작성**

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/signin" element={<SignInPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

### Task 5: 어드민 화면 (Sign-in + Dashboard)

**Files:**
- Create: `frontend/src/pages/SignInPage.tsx`
- Create: `frontend/src/pages/AdminDashboardPage.tsx`
- Create: `frontend/src/components/ProtectedRoute.tsx`
- Create: `frontend/src/stores/auth.ts`

- [ ] **Step 1: `stores/auth.ts` 작성**

```ts
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("admin_token"),
  setToken: (token) => {
    localStorage.setItem("admin_token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("admin_token");
    set({ token: null });
  },
}));
```

- [ ] **Step 2: `ProtectedRoute.tsx` 작성**

```tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/admin/signin" replace />;
  return <>{children}</>;
}
```

- [ ] **Step 3: `SignInPage.tsx` 작성** (stitch _6)

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuthStore } from "../stores/auth";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authApi.login({ username, password });
      setToken(res.data.access_token);
      navigate("/admin");
    } catch {
      setError("잘못된 아이디 또는 비밀번호입니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-surface-container rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          <span className="text-headline-lg font-bold text-on-surface">Streamfolio Studio</span>
        </div>
        <h1 className="text-headline-lg text-on-surface mb-6 text-center">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-body-sm text-on-surface-variant mb-1 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-body-sm text-on-surface-variant mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-error text-body-sm" data-testid="login-error">{error}</p>}
          <button
            type="submit"
            data-testid="login-submit"
            className="w-full bg-primary-container text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `AdminDashboardPage.tsx` 작성** (stitch _4)

```tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import { useAuthStore } from "../stores/auth";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

export default function AdminDashboardPage() {
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectsApi.list().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Project>) =>
      data.id ? projectsApi.update(data.id, data) : projectsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      setEditingProject(null);
      setIsCreating(false);
    },
  });

  const handleLogout = () => { logout(); navigate("/admin/signin"); };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-headline-xl text-on-surface">Channel Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => { setIsCreating(true); setEditingProject({ title: "", description: "", category: "Full Stack", tech_stack: "", thumbnail_url: "", github_url: "", live_url: "", is_featured: false, is_published: true }); }}
            data-testid="create-project-btn"
            className="flex items-center gap-2 bg-primary-container text-on-primary font-bold px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            CREATE
          </button>
          <button onClick={handleLogout} className="p-2 hover:bg-surface-container-high rounded-full transition-colors" data-testid="logout-btn">
            <span className="material-symbols-outlined text-on-surface">logout</span>
          </button>
        </div>
      </div>

      {(isCreating || editingProject?.id) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container rounded-xl p-6 w-full max-w-lg border border-white/10">
            <h2 className="text-headline-lg text-on-surface mb-4">{isCreating ? "새 프로젝트" : "프로젝트 수정"}</h2>
            <div className="space-y-3">
              {(["title", "description", "thumbnail_url", "tech_stack", "category", "github_url", "live_url"] as const).map((field) => (
                <div key={field}>
                  <label className="text-body-sm text-on-surface-variant mb-1 block">{field}</label>
                  <input
                    value={(editingProject as Record<string, string>)[field] ?? ""}
                    onChange={(e) => setEditingProject((p) => ({ ...p, [field]: e.target.value }))}
                    data-testid={`field-${field}`}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 text-body-sm text-on-surface cursor-pointer">
                <input type="checkbox" checked={editingProject?.is_featured ?? false}
                  onChange={(e) => setEditingProject((p) => ({ ...p, is_featured: e.target.checked }))} />
                Featured
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => saveMutation.mutate(editingProject!)}
                data-testid="save-project-btn"
                className="flex-1 bg-primary-container text-on-primary font-bold py-2 rounded-full hover:opacity-90">
                Save
              </button>
              <button onClick={() => { setEditingProject(null); setIsCreating(false); }}
                className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-full hover:bg-surface-container-highest">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20">
          <h2 className="text-headline-lg text-on-surface">Content Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="projects-table">
            <thead>
              <tr className="text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-high/50 transition-colors" data-testid="project-row">
                  <td className="px-6 py-4 text-body-md font-bold text-on-surface">{p.title}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">{p.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-body-sm ${p.is_published ? "text-green-400" : "text-on-surface-variant"}`}>
                      {p.is_published ? "Public" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-body-sm text-on-surface">{p.view_count.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingProject(p)} data-testid="edit-btn"
                        className="p-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-all">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteMutation.mutate(p.id)} data-testid="delete-btn"
                        className="p-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-error transition-all">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant" data-testid="empty-table">
                  프로젝트가 없습니다.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `main.tsx` 수정**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

---

### Task 6: 시드 데이터 스크립트

**Files:**
- Create: `backend/seed.py`

- [ ] **Step 1: `seed.py` 작성**

```python
import asyncio
from app.db.engine import engine, Base
from app.db.session import AsyncSessionLocal
from app.models.project import Project

SAMPLE_PROJECTS = [
    {"title": "NeuralEngine: Real-time Data Visualization", "description": "A high-performance WebGL dashboard for monitoring distributed cloud infrastructure.", "category": "WebGL/Graphics", "tech_stack": "Next.js,Three.js,Rust", "is_featured": True, "is_published": True, "thumbnail_url": ""},
    {"title": "Aetherial UI: A New Paradigm for Design Systems", "description": "A glassmorphism UI component library.", "category": "Full Stack", "tech_stack": "React,TypeScript,Tailwind", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "CryptoCore: Web3 Analytics", "description": "Real-time crypto analytics dashboard.", "category": "Full Stack", "tech_stack": "React,Solidity,Node.js", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "Lumina: IoT Smart Home Integration", "description": "Enterprise IoT home automation system.", "category": "Full Stack", "tech_stack": "Python,FastAPI,MQTT,React", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "PulseFit: Bio-Tracking Mobile App", "description": "React Native mobile fitness tracker.", "category": "Mobile Apps", "tech_stack": "React Native,TypeScript,Firebase", "is_featured": False, "is_published": True, "thumbnail_url": ""},
]

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        for data in SAMPLE_PROJECTS:
            db.add(Project(**data))
        await db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
```

---

### Task 7: Playwright E2E 테스트

**Files:**
- Create: `e2e/playwright.config.ts`
- Create: `e2e/tests/user.spec.ts`
- Create: `e2e/tests/admin.spec.ts`

- [ ] **Step 1: `e2e/playwright.config.ts` 작성**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "cd ../backend && uvicorn main:app --port 8000",
      port: 8000,
      reuseExistingServer: true,
    },
    {
      command: "cd ../frontend && npm run dev",
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});
```

- [ ] **Step 2: `e2e/tests/user.spec.ts` 작성**

```ts
import { test, expect } from "@playwright/test";

test.describe("사용자 시나리오", () => {
  test("홈 페이지 로드 및 프로젝트 카드 표시", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Streamfolio")).toBeVisible();
    // 카드가 없으면 빈 상태 메시지 확인
    const cards = page.locator('[data-testid="project-card"]');
    const empty = page.locator('[data-testid="empty-state"]');
    const count = await cards.count();
    if (count === 0) {
      await expect(empty).toBeVisible();
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("탐색 페이지 이동 및 검색", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("text=Explore Projects")).toBeVisible();
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("Neural");
    await page.waitForTimeout(600);
  });

  test("프로젝트 상세 페이지 — 존재하는 프로젝트", async ({ page }) => {
    // 먼저 홈에서 카드가 있는지 확인
    await page.goto("/");
    const cards = page.locator('[data-testid="project-card"]');
    const count = await cards.count();
    if (count > 0) {
      await cards.first().click();
      await expect(page.locator('[data-testid="project-title"]')).toBeVisible();
    }
  });

  test("About 페이지 로드", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=About")).toBeVisible();
    await expect(page.locator("text=Skills")).toBeVisible();
  });

  test("사이드바 네비게이션 작동", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL("/about");
  });
});
```

- [ ] **Step 3: `e2e/tests/admin.spec.ts` 작성**

```ts
import { test, expect } from "@playwright/test";

test.describe("관리자 시나리오", () => {
  test("로그인 페이지 로드", async ({ page }) => {
    await page.goto("/admin/signin");
    await expect(page.locator("text=Streamfolio Studio")).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });

  test("잘못된 자격증명으로 로그인 실패", async ({ page }) => {
    await page.goto("/admin/signin");
    await page.fill('[data-testid="username-input"]', "wrong");
    await page.fill('[data-testid="password-input"]', "wrong");
    await page.click('[data-testid="login-submit"]');
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
  });

  test("올바른 자격증명으로 로그인 성공 → 대시보드", async ({ page }) => {
    await page.goto("/admin/signin");
    await page.fill('[data-testid="username-input"]', "admin");
    await page.fill('[data-testid="password-input"]', "streamfolio2024");
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL("/admin");
    await expect(page.locator("text=Channel Dashboard")).toBeVisible();
  });

  test("프로젝트 생성", async ({ page }) => {
    await page.goto("/admin/signin");
    await page.fill('[data-testid="username-input"]', "admin");
    await page.fill('[data-testid="password-input"]', "streamfolio2024");
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL("/admin");
    await page.click('[data-testid="create-project-btn"]');
    await page.fill('[data-testid="field-title"]', "E2E Test Project");
    await page.fill('[data-testid="field-description"]', "Created by Playwright");
    await page.fill('[data-testid="field-category"]', "Full Stack");
    await page.click('[data-testid="save-project-btn"]');
    await expect(page.locator("text=E2E Test Project")).toBeVisible();
  });

  test("프로젝트 삭제", async ({ page }) => {
    await page.goto("/admin/signin");
    await page.fill('[data-testid="username-input"]', "admin");
    await page.fill('[data-testid="password-input"]', "streamfolio2024");
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL("/admin");
    const rows = page.locator('[data-testid="project-row"]');
    const count = await rows.count();
    if (count > 0) {
      const firstDeleteBtn = rows.first().locator('[data-testid="delete-btn"]');
      await firstDeleteBtn.click();
      await page.waitForTimeout(500);
      const newCount = await rows.count();
      expect(newCount).toBe(count - 1);
    }
  });

  test("보호된 어드민 라우트 — 미로그인 시 로그인 페이지로 이동", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/admin\/signin/);
  });
});
```

- [ ] **Step 4: `e2e/package.json` 작성**

```json
{
  "name": "e2e",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0"
  }
}
```

- [ ] **Step 5: Playwright 설치 및 테스트 실행**

```bash
cd e2e
npm install
npx playwright install chromium
```

---

### Task 8: 전체 통합 실행 및 테스트 통과 확인

- [ ] **Step 1: 백엔드 실행**
```bash
cd backend && uvicorn main:app --reload --port 8000
```

- [ ] **Step 2: 시드 데이터 삽입**
```bash
cd backend && python seed.py
```

- [ ] **Step 3: 프론트엔드 실행**
```bash
cd frontend && npm run dev
```

- [ ] **Step 4: 백엔드 유닛 테스트 통과**
```bash
cd backend && pytest -x -q
```
Expected: `4 passed`

- [ ] **Step 5: Playwright E2E 실행**
```bash
cd e2e && npx playwright test
```
Expected: `9 passed` (사용자 5 + 관리자 4)

- [ ] **Step 6: 실패 시 원인 파악 후 수정 → 재실행 (조건 만족까지 반복)**
