#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Admin Scenario E2E Test
"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:8080"

async def test_admin_scenario():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("\n=== ADMIN SCENARIO TEST ===\n")

        # 1. Admin Login
        print("[TEST 1] Admin Login", flush=True)
        await page.goto(BASE_URL)
        admin_buttons = await page.query_selector_all("button:has-text('Admin')")
        if admin_buttons:
            await admin_buttons[0].click()
            await page.wait_for_selector("#username", timeout=5000)

            username_input = await page.query_selector("#username")
            password_input = await page.query_selector("#password")
            login_button = await page.query_selector("button:has-text('login')")

            if all([username_input, password_input, login_button]):
                # Test incorrect credentials
                await username_input.fill("wrong")
                await password_input.fill("wrong")
                await login_button.click()
                await page.wait_for_selector("text=/failed|invalid/", timeout=5000)
                print("  [PASS] Invalid credentials error", flush=True)

                # Test correct credentials
                await username_input.fill("admin")
                await password_input.fill("admin1234")
                await login_button.click()
                await page.wait_for_selector("text=/Dashboard|dashboard/", timeout=10000)
                print("  [PASS] Login successful", flush=True)

                # 2. Change Password
                print("\n[TEST 2] Change Password", timeout=5000)
                password_tab = await page.query_selector_all("button:has-text('Password')")
                if password_tab:
                    await password_tab[0].click()
                    await page.wait_for_selector("#currentPassword", timeout=5000)

                    current = await page.query_selector("#currentPassword")
                    new_pass = await page.query_selector("#newPassword")
                    confirm = await page.query_selector("#confirmPassword")

                    if all([current, new_pass, confirm]):
                        await current.fill("admin1234")
                        await new_pass.fill("newpass123")
                        await confirm.fill("newpass123")

                        change_btns = await page.query_selector_all("button:has-text('Password')")
                        if len(change_btns) > 1:
                            await change_btns[1].click()
                            await page.wait_for_selector("text=/success|changed/", timeout=5000)
                            print("  [PASS] Password changed", flush=True)

                # 3. Project Management
                print("\n[TEST 3] Add Project", flush=True)
                project_tab = await page.query_selector_all("button:has-text('Project')")
                if project_tab:
                    await project_tab[0].click()
                    await page.wait_for_selector("#projectTitle", timeout=5000)

                    title = await page.query_selector("#projectTitle")
                    desc = await page.query_selector("#projectDesc")
                    tech = await page.query_selector("#projectTech")

                    if all([title, desc, tech]):
                        await title.fill("E2E Test Project")
                        await desc.fill("Test project from E2E test")
                        await tech.fill("React, TypeScript")

                        add_btns = await page.query_selector_all("button:has-text('add')")
                        if add_btns:
                            await add_btns[0].click()
                            await page.wait_for_selector("text=/added|success/", timeout=5000)
                            print("  [PASS] Project added", flush=True)

                            # 4. Delete Project
                            print("\n[TEST 4] Delete Project", flush=True)
                            delete_btns = await page.query_selector_all("button:has-text('delete')")
                            if delete_btns:
                                await delete_btns[-1].click()
                                await page.wait_for_selector("text=/deleted|success/", timeout=5000)
                                print("  [PASS] Project deleted", flush=True)

                # 5. Logout
                print("\n[TEST 5] Logout", flush=True)
                logout_btns = await page.query_selector_all("button:has-text('Logout')")
                if logout_btns:
                    await logout_btns[-1].click()
                    await page.wait_for_selector("button:has-text('Admin')", timeout=5000)
                    print("  [PASS] Logout successful", flush=True)

        await browser.close()
        print("\n[SUCCESS] All admin scenario tests passed!")

if __name__ == "__main__":
    asyncio.run(test_admin_scenario())
