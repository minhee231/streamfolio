from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from app.db.engine import engine, Base
from app.models import project as _project_model  # noqa: F401
from app.models import admin as _admin_model  # noqa: F401
from app.models.admin import Admin
from app.models.project import Project
from app.core.config import settings
from app.core.security import get_password_hash
from app.routers import projects, auth
from app.db.session import AsyncSessionLocal

SAMPLE_PROJECTS = [
    {"title": "NeuralEngine: Real-time Data Visualization", "description": "A high-performance WebGL dashboard for monitoring distributed cloud infrastructure. Featuring low-latency data streaming, custom shader-based node maps, and predictive analysis modules.", "category": "WebGL/Graphics", "tech_stack": "Next.js,Three.js,Rust", "is_featured": True, "is_published": True, "thumbnail_url": ""},
    {"title": "Aetherial UI: A New Paradigm for Design Systems", "description": "A glassmorphism UI component library with vibrant purple and neon red accents.", "category": "Full Stack", "tech_stack": "React,TypeScript,Tailwind", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "CryptoCore: Web3 Analytics & Real-time Trading", "description": "Real-time crypto analytics dashboard with 3D wireframe globe visualization.", "category": "Full Stack", "tech_stack": "React,Solidity,Node.js,WebGL", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "Lumina: IoT Smart Home Integration", "description": "Enterprise IoT home automation system with sensor fusion and smart device control.", "category": "Full Stack", "tech_stack": "Python,FastAPI,MQTT,React Native", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "PulseFit: Cross-Platform Bio-Tracking", "description": "React Native mobile application utilizing sensor fusion for high-precision athlete performance monitoring.", "category": "Mobile Apps", "tech_stack": "React Native,TypeScript,Firebase", "is_featured": False, "is_published": True, "thumbnail_url": ""},
    {"title": "DocuStream: Interactive Documentation", "description": "Interactive documentation platform for modern development teams.", "category": "Open Source", "tech_stack": "Next.js,MDX,Algolia", "is_featured": False, "is_published": True, "thumbnail_url": ""},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Admin).where(Admin.username == settings.admin_username)
        )
        if not result.scalar_one_or_none():
            db.add(
                Admin(
                    username=settings.admin_username,
                    hashed_password=get_password_hash(settings.admin_password),
                )
            )
        count_result = await db.execute(select(func.count()).select_from(Project))
        if count_result.scalar() == 0:
            for data in SAMPLE_PROJECTS:
                db.add(Project(**data))
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
