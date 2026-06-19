from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from app.db.engine import engine

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
