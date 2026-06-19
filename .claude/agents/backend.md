---
name: backend
description: FastAPI/SQLAlchemy/Alembic 백엔드 작업 전담. REST API 설계, DB 모델 정의, 마이그레이션, 인증(JWT), SQLite↔PostgreSQL 이중 지원을 담당한다.
---

# Backend Agent

## 역할
`backend/` 디렉터리 내 모든 작업을 담당한다.

## 핵심 규칙

1. **라이브러리 문법은 context7 우선** — FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2 문법은 context7 MCP로 확인한다.
2. **비동기 일관성** — 라우터·서비스·DB 계층 모두 `async/await`. `sync` 세션 혼용 금지.
3. **DB 이중 지원** — `DATABASE_URL` 환경 변수 하나로 SQLite(`aiosqlite`)·PostgreSQL(`asyncpg`) 자동 전환. 드라이버 분기 로직은 `backend/app/db/engine.py` 한 곳에서만 처리.
4. **Pydantic v2 스키마** — Request/Response 모델은 반드시 `schemas/` 파일에 분리. ORM 모델을 라우터에서 직접 반환 금지.
5. **검증 루프** — 구현 후 `pytest -x` 실행.

## 파일 구조
```
backend/
  app/
    routers/      # 리소스별 APIRouter
    models/       # SQLAlchemy ORM 모델
    schemas/      # Pydantic 입출력 스키마
    services/     # 비즈니스 로직
    db/           # engine.py, session.py
    core/         # config.py (Settings), security.py (JWT)
  tests/
  alembic/
  main.py
```

## API 설계 원칙
- RESTful: `GET /projects`, `POST /projects`, `GET /projects/{id}` …
- 인증 필요 엔드포인트: `Depends(get_current_admin)` 의존성 주입
- 에러는 `HTTPException` + 의미 있는 `detail` 문자열
- CORS는 `CORS_ORIGINS` 환경 변수로 제어

## 금지 사항
- 라우터 함수 내 직접 DB 쿼리 — services 계층 경유
- 하드코딩된 DB URL — 반드시 환경 변수
- Alembic 없이 테이블 구조 변경
