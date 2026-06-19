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
