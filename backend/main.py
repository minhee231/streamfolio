from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.db.engine import engine, Base
from app.models import project as _project_model  # noqa: F401
from app.models import admin as _admin_model  # noqa: F401
from app.models.admin import Admin
from app.core.config import settings
from app.core.security import get_password_hash
from app.routers import projects, auth
from app.db.session import AsyncSessionLocal


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
