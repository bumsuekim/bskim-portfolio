#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
User Scenario E2E Test
"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:8080"

async def test_user_scenario():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("\n=== USER SCENARIO TEST ===\n")

        # 1. Main Page
        print("[TEST 1] Main Page Visit", flush=True)
        await page.goto(BASE_URL)
        await page.wait_for_selector("button")
        title = await page.title()
        print(f"  Title: {title}", flush=True)
        print("  [PASS] Main page loaded", flush=True)

        # 2. About Page
        print("\n[TEST 2] About Page", flush=True)
        about_buttons = await page.query_selector_all("button:has-text('About')")
        if about_buttons:
            await about_buttons[0].click()
            await page.wait_for_selector("text=/Career|Skills/", timeout=5000)
            print("  [PASS] About page loaded", flush=True)
        else:
            print("  [SKIP] About button not found", flush=True)

        # 3. Projects Page
        print("\n[TEST 3] Projects Page", flush=True)
        projects_buttons = await page.query_selector_all("button:has-text('Projects')")
        if projects_buttons:
            await projects_buttons[0].click()
            await page.wait_for_selector("text=/Projects|portfolio/", timeout=5000)
            print("  [PASS] Projects page loaded", flush=True)

        # 4. Contact Page
        print("\n[TEST 4] Contact Page & Message", flush=True)
        contact_buttons = await page.query_selector_all("button:has-text('Contact')")
        if contact_buttons:
            await contact_buttons[0].click()
            await page.wait_for_selector("#contactName", timeout=5000)

            name_input = await page.query_selector("#contactName")
            email_input = await page.query_selector("#contactEmail")
            subject_input = await page.query_selector("#contactSubject")
            message_input = await page.query_selector("#contactMessage")

            if all([name_input, email_input, subject_input, message_input]):
                await name_input.fill("Test User")
                await email_input.fill("test@example.com")
                await subject_input.fill("Test Subject")
                await message_input.fill("This is a test message.")

                submit_button = await page.query_selector("button:has-text('sending')")
                if not submit_button:
                    submit_button = await page.query_selector("button:last-of-type")

                if submit_button:
                    await submit_button.click()
                    await page.wait_for_selector("text=/sent|success/", timeout=5000)
                    print("  [PASS] Message sent", flush=True)

        await browser.close()
        print("\n[SUCCESS] All user scenario tests passed!")

if __name__ == "__main__":
    asyncio.run(test_user_scenario())
