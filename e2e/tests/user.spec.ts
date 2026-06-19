import { test, expect } from "@playwright/test";

test.describe("사용자 시나리오", () => {
  test("홈 페이지 로드 — 브랜드 로고 표시", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Streamfolio").first()).toBeVisible();
  });

  test("홈 페이지 — 프로젝트 카드 또는 빈 상태 표시", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="project-card"]');
    const empty = page.locator('[data-testid="empty-state"]');
    const cardCount = await cards.count();
    if (cardCount > 0) {
      expect(cardCount).toBeGreaterThan(0);
    } else {
      await expect(empty).toBeVisible();
    }
  });

  test("탐색 페이지 이동 — 검색창 표시", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("text=Explore Projects")).toBeVisible();
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });

  test("탐색 페이지 — 검색어 입력", async ({ page }) => {
    await page.goto("/explore");
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("Neural");
    await page.waitForTimeout(600);
    // 검색이 실행됐는지 확인 (결과 있거나 없거나 둘 다 ok)
    const hasCards = await page.locator('[data-testid="project-card"]').count();
    const hasNoResults = await page.locator('[data-testid="no-results"]').count();
    expect(hasCards + hasNoResults).toBeGreaterThan(0);
  });

  test("About 페이지 로드 — Skills 섹션 표시", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=About").first()).toBeVisible();
    await expect(page.locator("text=Skills")).toBeVisible();
  });

  test("사이드바 About 링크 클릭 → /about 이동", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav a[href="/about"]').first().click();
    await expect(page).toHaveURL("/about");
  });

  test("홈 → 프로젝트 상세 클릭 이동", async ({ page }) => {
    await page.goto("/");
    // 네트워크 idle 대기
    await page.waitForLoadState("networkidle");
    const cards = page.locator('[data-testid="project-card"]');
    const count = await cards.count();
    if (count > 0) {
      await cards.first().click();
      // URL이 /projects/로 바뀔 때까지 대기
      await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 });
      await expect(page.locator('[data-testid="project-title"]')).toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
    }
  });

  test("미로그인 상태에서 /admin 접근 → 로그인 페이지 리다이렉트", async ({ page }) => {
    // localStorage 비우기
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("admin_token"));
    await page.goto("/admin");
    await expect(page).toHaveURL(/admin\/signin/);
  });
});
