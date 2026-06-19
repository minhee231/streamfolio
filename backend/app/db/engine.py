from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine: AsyncEngine = create_async_engine(settings.async_database_url, echo=False)


class Base(DeclarativeBase):
    pass
