import { test, expect } from '@playwright/test';

test.describe('관리자 시나리오', () => {
  test('Admin 페이지 접근 및 로그인', async ({ page }) => {
    await page.goto('/');

    // Admin 버튼 클릭
    await page.getByRole('button', { name: /Admin/i }).click();

    // 로그인 폼 확인
    await expect(page.getByText(/관리자 로그인/i)).toBeVisible();
    await expect(page.getByLabel(/사용자명/)).toBeVisible();
    await expect(page.getByLabel(/비밀번호/)).toBeVisible();

    // 잘못된 자격증명 테스트
    await page.getByLabel(/사용자명/).fill('wrong');
    await page.getByLabel(/비밀번호/).fill('wrong');
    await page.getByRole('button', { name: /로그인/i }).click();

    // 에러 메시지 확인
    await expect(page.getByText(/로그인 실패|잘못된 사용자명|Invalid/i)).toBeVisible();
  });

  test('올바른 자격증명으로 로그인', async ({ page }) => {
    await page.goto('/');

    // Admin 버튼 클릭
    await page.getByRole('button', { name: /Admin/i }).click();

    // 올바른 자격증명으로 로그인
    await page.getByLabel(/사용자명/).fill('admin');
    await page.getByLabel(/비밀번호/).fill('admin1234');
    await page.getByRole('button', { name: /로그인/i }).click();

    // 대시보드 페이지로 이동 확인
    await page.waitForSelector('text=/대시보드|비밀번호 변경|프로젝트 관리/');
    await expect(page.getByText(/대시보드/)).toBeVisible();
  });

  test('관리자가 비밀번호 변경', async ({ page }) => {
    // 로그인
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await page.getByLabel(/사용자명/).fill('admin');
    await page.getByLabel(/비밀번호/).fill('admin1234');
    await page.getByRole('button', { name: /로그인/i }).click();

    // 대시보드 로드 대기
    await page.waitForSelector('text=대시보드');

    // 비밀번호 변경 탭 클릭
    await page.getByRole('button', { name: /비밀번호 변경/i }).click();

    // 비밀번호 변경 폼 작성
    await page.getByLabel(/현재 비밀번호/).fill('admin1234');
    await page.getByLabel(/새 비밀번호/).first().fill('newpassword123');
    await page.getByLabel(/새 비밀번호 확인/i).fill('newpassword123');

    // 변경 버튼 클릭
    await page.getByRole('button', { name: /비밀번호 변경/i }).nth(1).click();

    // 성공 메시지 확인
    await expect(page.getByText(/비밀번호가 변경되었습니다/i)).toBeVisible();
  });

  test('관리자가 프로젝트 추가', async ({ page }) => {
    // 로그인
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await page.getByLabel(/사용자명/).fill('admin');
    await page.getByLabel(/비밀번호/).fill('admin1234');
    await page.getByRole('button', { name: /로그인/i }).click();

    // 대시보드 로드 대기
    await page.waitForSelector('text=대시보드');

    // 프로젝트 관리 탭 클릭
    await page.getByRole('button', { name: /프로젝트 관리/i }).click();

    // 프로젝트 추가 폼 작성
    await page.getByPlaceholder(/프로젝트 제목/).fill('테스트 프로젝트');
    await page.getByPlaceholder(/프로젝트 설명/).fill('이것은 테스트 프로젝트입니다.');
    await page.getByPlaceholder(/사용 기술/).fill('React, TypeScript, Tailwind');
    await page.getByPlaceholder(/링크/).fill('https://example.com');

    // 추가 버튼 클릭
    await page.getByRole('button', { name: /추가/i }).click();

    // 성공 메시지 확인
    await expect(page.getByText(/프로젝트가 추가되었습니다/i)).toBeVisible();

    // 프로젝트 목록에 추가된 프로젝트 확인
    await expect(page.getByText(/테스트 프로젝트/)).toBeVisible();
  });

  test('관리자가 프로젝트 삭제', async ({ page }) => {
    // 로그인 및 프로젝트 추가
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await page.getByLabel(/사용자명/).fill('admin');
    await page.getByLabel(/비밀번호/).fill('admin1234');
    await page.getByRole('button', { name: /로그인/i }).click();

    await page.waitForSelector('text=대시보드');
    await page.getByRole('button', { name: /프로젝트 관리/i }).click();

    // 프로젝트 추가
    await page.getByPlaceholder(/프로젝트 제목/).fill('삭제할 프로젝트');
    await page.getByPlaceholder(/프로젝트 설명/).fill('이 프로젝트는 삭제됩니다.');
    await page.getByPlaceholder(/사용 기술/).fill('Test');
    await page.getByRole('button', { name: /추가/i }).click();

    // 성공 대기
    await page.waitForSelector('text=/프로젝트가 추가되었습니다/');

    // 삭제 버튼 클릭
    const deleteButtons = await page.getByRole('button', { name: /삭제/i }).all();
    if (deleteButtons.length > 0) {
      await deleteButtons[deleteButtons.length - 1].click();

      // 확인 대화 처리
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      // 삭제 성공 메시지 확인
      await expect(page.getByText(/프로젝트가 삭제되었습니다/i)).toBeVisible();
    }
  });

  test('관리자 로그아웃', async ({ page }) => {
    // 로그인
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await page.getByLabel(/사용자명/).fill('admin');
    await page.getByLabel(/비밀번호/).fill('admin1234');
    await page.getByRole('button', { name: /로그인/i }).click();

    // 대시보드 로드 대기
    await page.waitForSelector('text=대시보드');

    // 로그아웃 버튼 클릭
    await page.getByRole('button', { name: /로그아웃/i }).click();

    // 홈페이지로 돌아가고 Admin 버튼이 보이는지 확인
    await expect(page.getByRole('button', { name: /Admin/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dashboard/i })).not.toBeVisible();
  });
});
