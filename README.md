# Streamfolio

> Cinematic Stream 다크 테마 포트폴리오 CMS — React + FastAPI + PostgreSQL

---

## 🔗 라이브 데모

| | URL |
|---|---|
| **프론트엔드** | [https://frontend-vert-two-46.vercel.app](https://frontend-vert-two-46.vercel.app) |
| **API (백엔드)** | [https://backend-production-fcdc.up.railway.app](https://backend-production-fcdc.up.railway.app) |
| **API 문서** | [https://backend-production-fcdc.up.railway.app/docs](https://backend-production-fcdc.up.railway.app/docs) |

---

## 프로젝트 소개

Google Stitch로 설계한 "Cinematic Stream" 다크 테마를 직접 구현한 풀스택 포트폴리오 웹앱입니다.  
유튜브 스타일의 프로젝트 그리드, 어드민 CMS 대시보드, JWT 인증을 포함합니다.

- **홈**: 프로젝트 카드 그리드 (유튜브 스타일)
- **Explore**: 카테고리 필터 + 검색
- **About**: 프로필 · 스킬 · 경력
- **Admin**: 프로젝트 CRUD CMS (로그인 필요)

---

## 기술 스택

### 프론트엔드
- React 18 + TypeScript + Vite
- Tailwind CSS v3 (Cinematic Stream 디자인 토큰)
- React Router v6, TanStack Query v5, Zustand
- 배포: **Vercel**

### 백엔드
- Python 3.12 + FastAPI + Uvicorn
- SQLAlchemy 2.x (aiosqlite / asyncpg 이중 지원)
- JWT 인증 (python-jose) + bcrypt 해싱
- 개발 DB: SQLite3 | 배포 DB: PostgreSQL
- 배포: **Railway**

### 테스트
- Playwright E2E (사용자 시나리오 8개 + 관리자 시나리오 7개)
- pytest + pytest-asyncio (백엔드 유닛 테스트)

---

## 로컬 실행

### 사전 요구사항
- Python 3.12+
- Node.js 18+

### 백엔드

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # 필요 시 값 수정
uvicorn main:app --reload
# → http://localhost:8000
# → API 문서: http://localhost:8000/docs
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### E2E 테스트

백엔드(8000)·프론트엔드(5173) 실행 후:

```bash
cd e2e
npx playwright test
npx playwright show-report   # HTML 리포트
```

---

## 환경 변수

### 백엔드 (`.env`)

| 변수 | 설명 | 예시 |
|------|------|------|
| `DATABASE_URL` | DB 연결 URL | `sqlite+aiosqlite:///./dev.db` |
| `SECRET_KEY` | JWT 서명 키 | (랜덤 48자 이상) |
| `ADMIN_PASSWORD` | 어드민 비밀번호 | (강력한 비밀번호) |
| `CORS_ORIGINS` | 허용 프론트 도메인 | `https://your-app.vercel.app` |

### 프론트엔드 (Vercel 환경변수)

| 변수 | 설명 |
|------|------|
| `VITE_API_URL` | Railway 백엔드 URL |

---

## 어드민 접근

`/admin` 경로 → 로그인 페이지  
기본 계정은 `.env.example` 참고 (프로덕션에서는 반드시 환경변수로 변경)
