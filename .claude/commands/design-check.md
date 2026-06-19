# /design-check — 화면 설계 일치 검증

Playwright로 현재 구현 화면을 stitch 원안과 비교해 이탈 항목을 보고한다.

## 실행 절차

1. **개발 서버 확인** — `frontend/` 의 dev server가 실행 중인지 확인한다. 꺼져 있으면 `pnpm dev`를 백그라운드로 실행한다.

2. **Playwright 스크린샷 촬영** — 검증할 페이지 URL을 받아 스크린샷을 찍는다.
   ```
   mcp__playwright__browser_navigate → 해당 페이지
   mcp__playwright__browser_take_screenshot → 현재 구현 화면
   ```

3. **stitch 원안 확인** — 해당 화면의 `stitch_dynamic_personal_portfolio_cms/_N/screen.png`를 Read로 열어 시각적으로 비교한다.

4. **체크리스트 평가** — 아래 항목을 순서대로 점검한다.
   - [ ] 배경색 `#131313` 적용 여부
   - [ ] 좌측 사이드바 구조 (아이콘 + 레이블)
   - [ ] 카드 16:9 썸네일 비율
   - [ ] 타이포그래피 (Inter 폰트, 크기·굵기)
   - [ ] Primary 컬러 `#ffb4a8` 사용 위치
   - [ ] 반응형 — 사이드바 접힘 동작

5. **결과 보고** — 일치 항목 ✅ / 이탈 항목 ❌ 목록과 수정 제안을 한국어로 출력한다.

## 인수
```
/design-check [페이지명]
# 예: /design-check home | about | explore | admin | detail | signin
```
페이지명 생략 시 _1 (Home)부터 순서대로 검증한다.
