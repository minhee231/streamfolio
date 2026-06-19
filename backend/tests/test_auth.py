import pytest
from app.models.admin import Admin
from app.core.security import get_password_hash


@pytest.mark.asyncio
async def test_login_success(client, db_session):
    db_session.add(Admin(username="testadmin", hashed_password=get_password_hash("testpass")))
    await db_session.commit()
    resp = await client.post(
        "/api/v1/auth/login", json={"username": "testadmin", "password": "testpass"}
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_login_fail(client):
    resp = await client.post(
        "/api/v1/auth/login", json={"username": "wrong", "password": "wrong"}
    )
    assert resp.status_code == 401
