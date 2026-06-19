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

_IMG = "https://lh3.googleusercontent.com/aida-public/"
SAMPLE_PROJECTS = [
    {"title": "NeuralEngine: Real-time Data Visualization", "description": "A high-performance WebGL dashboard for monitoring distributed cloud infrastructure. Featuring low-latency data streaming, custom shader-based node maps, and predictive analysis modules.", "category": "WebGL/Graphics", "tech_stack": "Next.js,Three.js,Rust", "is_featured": True, "is_published": True, "thumbnail_url": _IMG + "AB6AXuD9oX6G9mAbPwbsFrvKU9oHw2Xfcbbqvj4NY41yqgdt3BPqEv-8CrOBC9ouLNAkA23t0XTUpgoInFE-Eg5cq6WOx1j1MBD6_O56pUACXjdECJenWU9fhhh-CT7ur4zjL52fV3Oe_dV9InJAV_aTVH6Tg3ys10EnyPkwAjg80gkn8z4aPqK9iHmOwjvmiN2LEwRDYzQspOjqJ2wZKY3rRnTcuN8XruFrvhk3ZjfUQKtQinFeYv4DzvvdIiIV1rwIXyGn0YEJZlTmo99u"},
    {"title": "Aetherial UI: A New Paradigm for Design Systems", "description": "A glassmorphism UI component library with vibrant purple and neon red accents.", "category": "Full Stack", "tech_stack": "React,TypeScript,Tailwind", "is_featured": False, "is_published": True, "thumbnail_url": _IMG + "AB6AXuCX8EKJCMxjBpmmHYkfEgvlz2nI_HEfqadgLSol71JQykmSFZlGf_GKMneMP7RxQ8cF8vD8J4amnoZbtfOiCTqRGxVA-pclvo77Uzr-Fy_QIrYchvbx3uyN76fFq58zel_uAl_-nXjQM14ax2MgmAROYxiGqPXYptJkMVMc3WopJH23KscrZvV0EgNubhRuPex8VlhhaRnermtn7Xc38XGnFIxNk6poCI6Cc0XJoPhSlBMoqnh5whGPqwXSJdKC1PVXEAG5C7Uc9agI"},
    {"title": "CryptoCore: Web3 Analytics & Real-time Trading", "description": "Real-time crypto analytics dashboard with 3D wireframe globe visualization.", "category": "Full Stack", "tech_stack": "React,Solidity,Node.js,WebGL", "is_featured": False, "is_published": True, "thumbnail_url": _IMG + "AB6AXuDRzFAXIlBdjbTz82Mm3HS_vxn9CaJwN15yLLUAWrrPFiRDstPmLn7nR5NEzK94JGygwgk1MOohN4xtKu2NAlJJeG2SteK7Za-l4glhS9z1jn997pe97yGWH3dRKxHvviwA0ZhTVl-WHEslQ54RS5Ruhv3AKq6va6cEnHPX6RiTH5Rm2PjYc9SwIvfKZ0oPCu2A82NzoLrRcaY7UWIfTuM1Df-Em5CEj5ke8HQlaR8RDxsgBrnURgVbQirmPtBWxo2V8OPHkqbXwaIx"},
    {"title": "Lumina: IoT Smart Home Integration", "description": "Enterprise IoT home automation system with sensor fusion and smart device control.", "category": "Full Stack", "tech_stack": "Python,FastAPI,MQTT,React Native", "is_featured": False, "is_published": True, "thumbnail_url": _IMG + "AB6AXuBqrZeLniagy-FYp2oPa4gwbushbNyDYlRE2k4-g3WiZpuU9FS3c5EqHJgMGTB2REacZB1pD9h_7Z3gczq_LDnWedVrP5EAjZXns5tUMeQBJeupudVfFTo4OPbRnmVo0wwDGA1X4W4YWIPx1qW2pOKOf8gdlJbejG_NHtkNrt5gMC96qt5tJnZflYulba0PEgfrKv7eqmqlhdHJ7n1gd2CI307mppd83smnu44oZamhUlgs1NJ-yBmE3Wy4ywaS1ixBSgxmbvJuuYWz"},
    {"title": "PulseFit: Cross-Platform Bio-Tracking", "description": "React Native mobile application utilizing sensor fusion for high-precision athlete performance monitoring.", "category": "Mobile Apps", "tech_stack": "React Native,TypeScript,Firebase", "is_featured": False, "is_published": True, "thumbnail_url": _IMG + "AB6AXuBNGWvxrL4Y2htRKxFOQr-IFdipUnN855UXGS2DpRg08p5wCBSx8F4T6C8NcMDq5wEApq9B6ikCoUy0x2f4rLRFpSyaPJdmB3LkA1702v9bBncQdgfXSnpg-rdOh4a7Aq71h3haGcYa35qpj_gvpvElt6i-kuCvGijYn9M1V0zdJCPrL66pkNC5Bzf0cRA-8HwNg5HjJo8-Vh19GOJIt-1JTaEfsVkDYBhty-x1V348RpiV60E3fM2lhjm-J-NPZ00AdRdcEUC5_BZj"},
    {"title": "DocuStream: Interactive Documentation", "description": "Interactive documentation platform for modern development teams.", "category": "Open Source", "tech_stack": "Next.js,MDX,Algolia", "is_featured": False, "is_published": True, "thumbnail_url": _IMG + "AB6AXuAHPZwmEinPX5yopLGeloCr9bNYJEqQp_ZJd_q--C6yhg5V4zR7hSYejn6qv15Kfk7YMsL96criZXaFquwOKMXNUofLJ5WPb1C2qSZy4ou9s4-EPYKGQIld89dRbkLecX22oH8jwecp8AvvctJqeCip8sxGnuTse3ev6RmiUXxe_-8UuCrQEcAGGJ9T9FZ7gbwd2TJqAfVr3dhZf9MkRZkDh2qLp4p1jawZg6C-j4MoFXdE33Dhp3WXIYOjpT6d6hhT4ysL58BdC1F6"},
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
