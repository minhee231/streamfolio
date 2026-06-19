import { test, expect } from "@playwright/test";

const ADMIN_USER = "admin";
const ADMIN_PASS = "streamfolio2024";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/signin");
  await page.fill('[data-testid="username-input"]', ADMIN_USER);
  await page.fill('[data-testid="password-input"]', ADMIN_PASS);
  await page.click('[data-testid="login-submit"]');
  await expect(page).toHaveURL("/admin", { timeout: 10_000 });
}

test.describe("관리자 시나리오", () => {
  test("로그인 페이지 — 폼 요소 표시", async ({ page }) => {
    await page.goto("/admin/signin");
    await expect(page.locator("text=Streamfolio Studio")).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test("잘못된 자격증명 → 오류 메시지 표시", async ({ page }) => {
    await page.goto("/admin/signin");
    await page.fill('[data-testid="username-input"]', "wrong_user");
    await page.fill('[data-testid="password-input"]', "wrong_pass");
    await page.click('[data-testid="login-submit"]');
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible({ timeout: 5_000 });
  });

  test("올바른 자격증명 → 대시보드 이동", async ({ page }) => {
    await login(page);
    await expect(page.locator("text=Channel Dashboard")).toBeVisible();
    await expect(page.locator('[data-testid="projects-table"]')).toBeVisible();
  });

  test("프로젝트 생성 → 테이블에 표시", async ({ page }) => {
    await login(page);
    await page.click('[data-testid="create-project-btn"]');
    await expect(page.locator('[data-testid="field-title"]')).toBeVisible();
    await page.fill('[data-testid="field-title"]', "E2E Test Project");
    await page.fill('[data-testid="field-description"]', "Created by Playwright E2E");
    await page.fill('[data-testid="field-category"]', "Full Stack");
    await page.click('[data-testid="save-project-btn"]');
    await expect(page.locator("text=E2E Test Project")).toBeVisible({ timeout: 5_000 });
  });

  test("프로젝트 수정 → 제목 변경 확인", async ({ page }) => {
    await login(page);
    const rows = page.locator('[data-testid="project-row"]');
    await page.waitForTimeout(500);
    const count = await rows.count();
    if (count === 0) {
      // 프로젝트 없으면 먼저 생성
      await page.click('[data-testid="create-project-btn"]');
      await page.fill('[data-testid="field-title"]', "편집할 프로젝트");
      await page.fill('[data-testid="field-category"]', "Full Stack");
      await page.click('[data-testid="save-project-btn"]');
      await expect(page.locator("text=편집할 프로젝트")).toBeVisible();
    }
    const editBtn = rows.first().locator('[data-testid="edit-btn"]');
    await editBtn.click();
    await expect(page.locator('[data-testid="field-title"]')).toBeVisible();
    const titleInput = page.locator('[data-testid="field-title"]');
    await titleInput.clear();
    await titleInput.fill("수정된 프로젝트 제목");
    await page.click('[data-testid="save-project-btn"]');
    await expect(page.locator("text=수정된 프로젝트 제목")).toBeVisible({ timeout: 5_000 });
  });

  test("프로젝트 삭제 → 행 수 감소", async ({ page }) => {
    await login(page);
    const rows = page.locator('[data-testid="project-row"]');
    await page.waitForTimeout(500);
    const countBefore = await rows.count();
    if (countBefore === 0) {
      // 삭제할 대상 생성
      await page.click('[data-testid="create-project-btn"]');
      await page.fill('[data-testid="field-title"]', "삭제될 프로젝트");
      await page.fill('[data-testid="field-category"]', "Full Stack");
      await page.click('[data-testid="save-project-btn"]');
      await expect(page.locator("text=삭제될 프로젝트")).toBeVisible();
    }
    const currentCount = await rows.count();
    const deleteBtn = rows.first().locator('[data-testid="delete-btn"]');
    await deleteBtn.click();
    await page.waitForTimeout(800);
    const countAfter = await rows.count();
    expect(countAfter).toBeLessThan(currentCount);
  });

  test("로그아웃 → 로그인 페이지 이동", async ({ page }) => {
    await login(page);
    await page.click('[data-testid="logout-btn"]');
    await expect(page).toHaveURL(/admin\/signin/, { timeout: 5_000 });
  });
});
