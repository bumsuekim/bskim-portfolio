import { test, expect } from '@playwright/test';

test.describe('사용자 시나리오', () => {
  test('포트폴리오 메인 페이지 방문', async ({ page }) => {
    await page.goto('/');

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/포트폴리오/);

    // 네비게이션 확인
    await expect(page.getByRole('button', { name: /portfolio/i })).toBeVisible();

    // 헤로우 섹션 확인
    await expect(page.getByText(/사용자 경험을 혁신하는 개발자/i)).toBeVisible();

    // CTA 버튼 확인
    await expect(page.getByRole('link', { name: /프로젝트 보기/i })).toBeVisible();
  });

  test('About 페이지 방문', async ({ page }) => {
    await page.goto('/');

    // About 버튼 클릭
    await page.getByRole('button', { name: /About/i }).click();

    // 페이지 내용 확인
    await expect(page.getByText(/포트폴리오/)).toBeVisible();
    await expect(page.getByText(/소개/)).toBeVisible();
    await expect(page.getByText(/주요 경력/)).toBeVisible();
    await expect(page.getByText(/Google Korea/i)).toBeVisible();
  });

  test('Projects 페이지 방문 및 프로젝트 목록 확인', async ({ page }) => {
    await page.goto('/');

    // Projects 버튼 클릭
    await page.getByRole('button', { name: /Projects/i }).click();

    // 프로젝트 제목 확인
    await expect(page.getByText(/포트폴리오 프로젝트/)).toBeVisible();

    // 프로젝트 카드가 로드될 때까지 대기
    await page.waitForSelector('.glass-card');

    // 최소 하나의 프로젝트 확인
    const projectCards = await page.locator('.glass-card').count();
    expect(projectCards).toBeGreaterThan(0);
  });

  test('Contact 페이지 방문 및 메시지 전송', async ({ page }) => {
    await page.goto('/');

    // Contact 버튼 클릭
    await page.getByRole('button', { name: /Contact/i }).click();

    // 폼 필드 확인
    await expect(page.getByLabel(/이름/)).toBeVisible();
    await expect(page.getByLabel(/이메일/)).toBeVisible();
    await expect(page.getByLabel(/제목/)).toBeVisible();
    await expect(page.getByLabel(/메시지/)).toBeVisible();

    // 폼 작성
    await page.getByLabel(/이름/).fill('테스트 사용자');
    await page.getByLabel(/이메일/).fill('test@example.com');
    await page.getByLabel(/제목/).fill('테스트 제목');
    await page.getByLabel(/메시지/).fill('이것은 테스트 메시지입니다.');

    // 전송 버튼 클릭
    await page.getByRole('button', { name: /보내기/i }).click();

    // 성공 메시지 확인
    await expect(page.getByText(/메시지가 전송되었습니다/)).toBeVisible();
  });

  test('네비게이션 일관성 확인', async ({ page }) => {
    const pages = [
      { path: '/', name: 'Home' },
      { path: '/about', name: 'About' },
      { path: '/projects', name: 'Projects' },
      { path: '/contact', name: 'Contact' }
    ];

    for (const p of pages) {
      await page.goto(p.path);
      await expect(page.getByRole('button', { name: p.name })).toBeVisible();

      // 헤더 확인
      await expect(page.getByRole('button', { name: /portfolio/i })).toBeVisible();

      // 푸터 확인
      await expect(page.getByText(/© 2024 Portfolio/)).toBeVisible();
    }
  });
});
