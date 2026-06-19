#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API Integration Tests
"""
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000"

def test_user_scenario():
    print("\n[USER SCENARIO TEST]\n")

    # Test 1: Get projects
    print("[TEST 1] Get all projects")
    try:
        req = urllib.request.Request(f"{BASE_URL}/projects")
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"  [PASS] Got {len(data)} projects")
            print(f"  Response: {json.dumps(data[:1] if data else [], indent=2)}")
    except Exception as e:
        print(f"  [FAIL] {str(e)}")
        return False

    # Test 2: Submit contact message
    print("\n[TEST 2] Submit contact message")
    try:
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message"
        }
        req = urllib.request.Request(
            f"{BASE_URL}/contact",
            data=json.dumps(contact_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            print(f"  [PASS] Message submitted")
            print(f"  Response: {json.dumps(result, indent=2)}")
    except Exception as e:
        print(f"  [FAIL] {str(e)}")
        return False

    print("\n[SUCCESS] All user scenario tests passed!")
    return True


def test_admin_scenario():
    print("\n[ADMIN SCENARIO TEST]\n")

    admin_token = None

    # Test 1: Admin login
    print("[TEST 1] Admin login (admin/admin1234)")
    try:
        login_data = {"username": "admin", "password": "admin1234"}
        req = urllib.request.Request(
            f"{BASE_URL}/admin/login",
            data=json.dumps(login_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            admin_token = result.get("access_token")
            print(f"  [PASS] Login successful")
            print(f"  Token: {admin_token[:20]}...")
    except urllib.error.HTTPError as e:
        print(f"  [FAIL] Login failed: {e.reason}")
        return False

    if not admin_token:
        print("  [FAIL] No token received")
        return False

    # Test 2: Add project
    print("\n[TEST 2] Add project (requires auth)")
    try:
        project_data = {
            "title": "API Test Project",
            "description": "Test project from API",
            "technologies": "React, TypeScript",
            "link": "http://example.com",
            "image_url": ""
        }
        req = urllib.request.Request(
            f"{BASE_URL}/projects",
            data=json.dumps(project_data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {admin_token}'
            },
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            project_id = result.get("id")
            print(f"  [PASS] Project added with ID {project_id}")
    except urllib.error.HTTPError as e:
        print(f"  [FAIL] Add project failed: {e.reason}")
        return False
    except Exception as e:
        print(f"  [FAIL] {str(e)}")
        return False

    # Test 3: Change password
    print("\n[TEST 3] Change password (requires auth)")
    try:
        password_data = {
            "current_password": "admin1234",
            "new_password": "testpass123"
        }
        req = urllib.request.Request(
            f"{BASE_URL}/admin/change-password",
            data=json.dumps(password_data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {admin_token}'
            },
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            print(f"  [PASS] Password changed")
            print(f"  Response: {json.dumps(result, indent=2)}")
    except urllib.error.HTTPError as e:
        print(f"  [FAIL] Change password failed: {e.reason}")
        return False

    # Test 4: Delete project
    if 'project_id' in locals():
        print(f"\n[TEST 4] Delete project (ID: {project_id})")
        try:
            req = urllib.request.Request(
                f"{BASE_URL}/projects/{project_id}",
                headers={'Authorization': f'Bearer {admin_token}'},
                method='DELETE'
            )
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                print(f"  [PASS] Project deleted")
                print(f"  Response: {json.dumps(result, indent=2)}")
        except urllib.error.HTTPError as e:
            print(f"  [FAIL] Delete failed: {e.reason}")

    print("\n[SUCCESS] All admin scenario tests passed!")
    return True


if __name__ == "__main__":
    success = True
    success = test_user_scenario() and success
    success = test_admin_scenario() and success

    if success:
        print("\n" + "="*50)
        print("ALL TESTS PASSED!")
        print("="*50)
    else:
        print("\n" + "="*50)
        print("SOME TESTS FAILED")
        print("="*50)
