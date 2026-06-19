#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""End-to-end Playwright test against the DEPLOYED site (Vercel frontend + Railway backend)."""
import sys
from playwright.sync_api import sync_playwright, expect

SITE = "https://bskim-portfolio.vercel.app"
BACKEND = "https://bskim-api-production.up.railway.app"

results = []
def check(label, cond, detail=""):
    results.append(cond)
    print(f"  [{'PASS' if cond else 'FAIL'}] {label} {detail}", flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.set_default_timeout(20000)
    console_msgs = []
    api_responses = []
    page.on("console", lambda m: console_msgs.append(f"{m.type}: {m.text}"))
    page.on("pageerror", lambda e: console_msgs.append(f"pageerror: {e}"))
    page.on("requestfailed", lambda r: console_msgs.append(f"requestfailed: {r.method} {r.url} :: {r.failure}"))
    page.on("response", lambda r: api_responses.append(f"{r.request.method} {r.url.replace(BACKEND,'')} -> {r.status}")
            if BACKEND in r.url else None)

    print("\n=== USER SCENARIO (deployed) ===", flush=True)

    # 1. Home loads
    page.goto(SITE, wait_until="networkidle")
    page.wait_for_selector("text=사용자 경험을 혁신하는 개발자")
    check("home page loaded", True)

    # 2. config.js loaded and points at Railway (not localhost) — the silent-fallback guard
    api = page.evaluate("() => (window.APP_CONFIG && window.APP_CONFIG.API_URL) || null")
    check("config.js API_URL points to Railway", api == BACKEND, f"-> {api}")

    # 3. Projects page loads (calls backend GET /projects via CORS)
    page.get_by_role("button", name="Projects").first.click()
    page.wait_for_selector("text=포트폴리오 프로젝트")
    # list renders (either cards or the empty-state message; both prove the fetch resolved)
    page.wait_for_selector("#projectsList")
    check("projects page rendered (backend fetch ok)", True)

    # 4. Contact form submit (browser POST /contact across origins -> CORS test)
    page.get_by_role("button", name="Contact").first.click()
    page.wait_for_selector("#contactName")
    page.fill("#contactName", "E2E Tester")
    page.fill("#contactEmail", "e2e@example.com")
    page.fill("#contactSubject", "Hello from Playwright")
    page.fill("#contactMessage", "This message is sent by the live E2E test.")
    page.get_by_role("button", name="보내기").click()
    page.wait_for_selector("text=메시지가 전송되었습니다", timeout=20000)
    check("contact message sent (CORS POST ok)", True)

    print("\n=== ADMIN SCENARIO (deployed) ===", flush=True)

    # 1. Open Admin, reject wrong creds
    page.get_by_role("button", name="Admin").click()
    page.wait_for_selector("text=관리자 로그인")
    page.fill("#username", "admin")
    page.fill("#password", "wrongpass")
    page.get_by_role("button", name="로그인").click()
    page.wait_for_selector("text=Invalid", timeout=20000)
    check("wrong credentials rejected", True)

    # 2. Login with correct creds
    page.fill("#username", "admin")
    page.fill("#password", "admin1234")
    page.get_by_role("button", name="로그인").click()
    page.wait_for_selector("text=대시보드", timeout=20000)
    check("admin login ok", True)

    # 3. Change password (password form is the default tab), then revert
    page.wait_for_selector("#currentPassword")
    page.fill("#currentPassword", "admin1234")
    page.fill("#newPassword", "pwtest456")
    page.fill("#confirmPassword", "pwtest456")
    page.locator('button[type="submit"]:has-text("비밀번호 변경")').click()
    page.wait_for_selector("text=비밀번호가 변경되었습니다", timeout=20000)
    check("password changed", True)
    # revert to admin1234 so the known credential keeps working
    page.fill("#currentPassword", "pwtest456")
    page.fill("#newPassword", "admin1234")
    page.fill("#confirmPassword", "admin1234")
    page.locator('button[type="submit"]:has-text("비밀번호 변경")').click()
    page.wait_for_selector("text=비밀번호가 변경되었습니다", timeout=20000)
    check("password reverted to admin1234", True)

    # 4. Project management: add a project
    import time as _time
    uid = str(int(_time.time() * 1000))[-9:]
    title = f"E2E Test {uid}"
    page.get_by_role("button", name="프로젝트 관리").click()
    page.wait_for_selector("#projectTitle")
    page.fill("#projectTitle", title)
    page.fill("#projectDesc", "Added by the live Playwright test")
    page.fill("#projectTech", "React, FastAPI, PostgreSQL")
    page.fill("#projectLink", "https://example.com")
    page.get_by_role("button", name="추가").click()
    # Reliable success signal: the uniquely-titled project appears in the admin list
    # (handleAddProject calls loadAdminProjects() on a successful POST).
    try:
        page.wait_for_selector(f"text={title}", timeout=30000)
        check("project added + shows in admin list (auth POST ok)", True)
    except Exception:
        am = page.query_selector("#adminMessage")
        print("  [DEBUG] #adminMessage:", repr(am.inner_text() if am else None), flush=True)
        print("  [DEBUG] api responses:", api_responses[-8:], flush=True)
        print("  [DEBUG] console tail:", console_msgs[-6:], flush=True)
        page.screenshot(path="tests/add_fail.png")
        raise

    # 5. Delete THIS project (find its card by unique title, click its 삭제 button).
    page.on("dialog", lambda d: d.accept())
    card = page.locator(".glass-card", has_text=title)
    card.get_by_role("button", name="삭제").click()
    # Reliable signal: the uniquely-titled card disappears from the list.
    page.wait_for_selector(f"text={title}", state="detached", timeout=30000)
    check("project deleted (removed from list)", True)

    # 6. Logout
    page.get_by_role("button", name="로그아웃").click()
    page.wait_for_selector("button:has-text('Admin')", timeout=20000)
    check("logout ok", True)

    browser.close()

passed = sum(1 for r in results if r)
total = len(results)
print(f"\n{'='*46}\n{passed}/{total} checks passed", flush=True)
print(("ALL DEPLOYED E2E TESTS PASSED" if passed == total else "SOME DEPLOYED E2E TESTS FAILED") + f"\n{'='*46}", flush=True)
sys.exit(0 if passed == total else 1)
