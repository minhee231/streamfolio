import asyncio
from app.db.engine import engine, Base
from app.db.session import AsyncSessionLocal
from app.models.project import Project
from app.models.admin import Admin  # noqa: F401
from app.core.security import get_password_hash
from sqlalchemy import select

SAMPLE_PROJECTS = [
    {
        "title": "NeuralEngine: Real-time Data Visualization",
        "description": "A high-performance WebGL dashboard for monitoring distributed cloud infrastructure. Featuring low-latency data streaming, custom shader-based node maps, and predictive analysis modules.",
        "category": "WebGL/Graphics",
        "tech_stack": "Next.js,Three.js,Rust",
        "is_featured": True,
        "is_published": True,
        "thumbnail_url": "",
    },
    {
        "title": "Aetherial UI: A New Paradigm for Design Systems",
        "description": "A glassmorphism UI component library with vibrant purple and neon red accents.",
        "category": "Full Stack",
        "tech_stack": "React,TypeScript,Tailwind",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": "",
    },
    {
        "title": "CryptoCore: Web3 Analytics & Real-time Trading",
        "description": "Real-time crypto analytics dashboard with 3D wireframe globe visualization.",
        "category": "Full Stack",
        "tech_stack": "React,Solidity,Node.js,WebGL",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": "",
    },
    {
        "title": "Lumina: IoT Smart Home Integration",
        "description": "Enterprise IoT home automation system with sensor fusion and smart device control.",
        "category": "Full Stack",
        "tech_stack": "Python,FastAPI,MQTT,React Native",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": "",
    },
    {
        "title": "PulseFit: Cross-Platform Bio-Tracking",
        "description": "React Native mobile application utilizing sensor fusion for high-precision athlete performance monitoring.",
        "category": "Mobile Apps",
        "tech_stack": "React Native,TypeScript,Firebase",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": "",
    },
    {
        "title": "DocuStream: Interactive Documentation",
        "description": "Interactive documentation platform for modern development teams.",
        "category": "Open Source",
        "tech_stack": "Next.js,MDX,Algolia",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": "",
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from app.core.config import settings

    async with AsyncSessionLocal() as db:
        # 어드민 계정
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

        # 샘플 프로젝트
        for data in SAMPLE_PROJECTS:
            db.add(Project(**data))

        await db.commit()

    print(f"시드 완료: 프로젝트 {len(SAMPLE_PROJECTS)}개, 어드민 계정 생성")


if __name__ == "__main__":
    asyncio.run(seed())
