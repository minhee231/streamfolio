import pytest
from app.models.admin import Admin
from app.core.security import get_password_hash


async def _get_token(client, db_session, username: str, password: str) -> str:
    db_session.add(Admin(username=username, hashed_password=get_password_hash(password)))
    await db_session.commit()
    resp = await client.post(
        "/api/v1/auth/login", json={"username": username, "password": password}
    )
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_list_projects_empty(client):
    resp = await client.get("/api/v1/projects/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_create_and_get_project(client, db_session):
    token = await _get_token(client, db_session, "admin_proj", "pass_proj")
    headers = {"Authorization": f"Bearer {token}"}
    body = {"title": "Test Project", "description": "desc", "category": "Full Stack"}
    resp = await client.post("/api/v1/projects/", json=body, headers=headers)
    assert resp.status_code == 200
    pid = resp.json()["id"]
    resp2 = await client.get(f"/api/v1/projects/{pid}")
    assert resp2.json()["title"] == "Test Project"


@pytest.mark.asyncio
async def test_delete_project(client, db_session):
    token = await _get_token(client, db_session, "admin_del", "pass_del")
    headers = {"Authorization": f"Bearer {token}"}
    resp = await client.post("/api/v1/projects/", json={"title": "ToDelete"}, headers=headers)
    pid = resp.json()["id"]
    del_resp = await client.delete(f"/api/v1/projects/{pid}", headers=headers)
    assert del_resp.status_code == 200
