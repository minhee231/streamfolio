# /tdd-cycle — TDD Red→Green→Refactor 사이클

새 기능을 구현할 때 반드시 이 순서를 따른다.

## 사이클

### 1. Red — 실패하는 테스트 먼저 작성
- 구현 코드 없이 테스트 파일만 작성한다.
- 프론트엔드: Vitest + Testing Library (`frontend/src/__tests__/`)
- 백엔드: pytest + httpx AsyncClient (`backend/tests/`)
- 테스트 실행 → **반드시 실패를 확인**한다 (통과하면 테스트가 잘못된 것).

### 2. Green — 테스트를 통과하는 최소 구현
- 테스트만 통과시킬 수 있는 가장 단순한 코드를 작성한다.
- 과설계 금지 — 지금 테스트가 요구하지 않는 기능은 추가하지 않는다.
- 테스트 실행 → **통과를 확인**한다.

### 3. Refactor — 중복 제거 및 정리
- 기능은 건드리지 않고 코드 품질만 개선한다.
- 테스트 재실행 → **여전히 통과하는지 확인**한다.

## 검증 명령어

```bash
# 프론트엔드
cd frontend && pnpm test --run

# 백엔드
cd backend && pytest -x -q

# 전체 타입·린트
cd frontend && pnpm typecheck && pnpm lint
cd backend && ruff check . && mypy app/
```

## 규칙
- Green 단계 전에 구현 코드 작성 금지
- 테스트 없이 "완료"라고 선언 금지
- 실패 이유를 확인하지 않고 테스트 수정 금지
