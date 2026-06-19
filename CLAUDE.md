# Isaac Portfolio — CLAUDE.md

## 프로젝트 개요
1인 포트폴리오 풀스택 웹앱 **Streamfolio**.  
Google Stitch로 설계된 "Cinematic Stream" 다크 테마를 React로 구현하고 FastAPI로 콘텐츠를 관리한다.

## 디자인 레퍼런스
`stitch_dynamic_personal_portfolio_cms/` 안의 6개 HTML 파일이 유일한 진실(source of truth).

| 파일 | 화면 |
|------|------|
| `_1` | Home — 프로젝트 그리드 (유튜브 스타일) |
| `_2` | About — 프로필·스킬·경력 |
| `_3` | Explore — 필터·검색 |
| `_4` | Admin Dashboard — 콘텐츠 관리 CMS |
| `_5` | Project Detail — 단일 프로젝트 상세 |
| `_6` | Sign-in — 어드민 로그인 |

디자인 토큰은 `cinematic_stream/DESIGN.md` 참고. 폰트: Inter. 아이콘: Material Symbols Outlined.

## 기술 스택

### 프론트엔드 (`frontend/`)
- TypeScript + React 18 + Vite
- Tailwind CSS v3 (DESIGN.md 토큰 적용)
- React Router v6, TanStack Query v5, Zustand
- 배포: **Vercel**

### 백엔드 (`backend/`)
- Python 3.12 + FastAPI + Uvicorn
- SQLAlchemy 2.x (비동기 aiosqlite / asyncpg 이중 지원)
- Alembic 마이그레이션
- 개발 DB: SQLite3 | 배포 DB: PostgreSQL (Railway)
- 배포: **Railway**

## Karpathy 4원칙 (필수)
1. **가정 명시** — 확인되지 않은 사실은 "가정:" 접두어로 표시 후 검증
2. **단순함 우선** — 추상화·추가 레이어는 세 번 이상 반복될 때만 도입
3. **외과적 수정** — 요청 범위 밖 코드는 건드리지 않음
4. **검증 루프** — 변경 후 반드시 테스트·린트·타입 체크 실행

## 개발 워크플로

```
라이브러리 문법 질문 → context7 MCP로 최신 문서 확인
새 기능 구현       → /tdd-cycle 로 테스트 먼저 작성
화면 구현 후       → /design-check 로 stitch 원안과 비교
```

## 디렉터리 규칙
- 컴포넌트: `frontend/src/components/<도메인>/<컴포넌트>.tsx`
- 페이지:   `frontend/src/pages/<페이지>.tsx`
- API 라우터: `backend/app/routers/<리소스>.py`
- 스키마:    `backend/app/schemas/<리소스>.py`
- DB 모델:   `backend/app/models/<리소스>.py`

## 언어 규칙
- **모든 답변은 한국어**
- 코드 내 주석·변수명은 영어 (국제 협업 대비)

## 환경 변수
- `DATABASE_URL` — SQLite(`sqlite+aiosqlite:///./dev.db`) 또는 PostgreSQL URL
- `SECRET_KEY` — JWT 서명 키
- `CORS_ORIGINS` — 프론트엔드 도메인 (Vercel URL)
