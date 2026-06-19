#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Live smoke test against the deployed Railway backend (PostgreSQL)."""
import json, sys, urllib.request, urllib.error

BASE = "https://bskim-api-production.up.railway.app"

def call(method, path, body=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode() or "null")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

ok = True
def check(label, cond, detail=""):
    global ok
    print(f"  [{'PASS' if cond else 'FAIL'}] {label} {detail}")
    if not cond: ok = False

print("\n=== USER SCENARIO (live) ===")
s, b = call("GET", "/projects")
check("GET /projects", s == 200 and isinstance(b, list), f"-> {s}")
s, b = call("POST", "/contact", {"name":"Tester","email":"t@example.com","subject":"Hi","message":"live test"})
check("POST /contact", s == 200, f"-> {s}")

print("\n=== ADMIN SCENARIO (live) ===")
s, b = call("POST", "/admin/login", {"username":"admin","password":"admin1234"})
token = b.get("access_token") if isinstance(b, dict) else None
check("login admin/admin1234", s == 200 and token, f"-> {s}")

s, b = call("POST", "/admin/login", {"username":"admin","password":"wrong"})
check("reject wrong password", s == 401, f"-> {s}")

s, b = call("POST", "/projects", {"title":"Live Proj","description":"d","technologies":"React, FastAPI","link":"https://x.com","image_url":""}, token)
pid = b.get("id") if isinstance(b, dict) else None
check("create project (auth)", s == 200 and pid, f"-> {s}")

s, b = call("POST", "/projects", {"title":"NoAuth","description":"d","technologies":"x"})
check("reject create without token", s in (401,403), f"-> {s}")

s, b = call("GET", "/projects")
check("project appears in list", any(p.get("id")==pid for p in b) if isinstance(b,list) else False, f"-> {s}")

s, b = call("POST", "/admin/change-password", {"current_password":"admin1234","new_password":"newpass999"}, token)
check("change password", s == 200, f"-> {s}")
s, b = call("POST", "/admin/login", {"username":"admin","password":"newpass999"})
newtok = b.get("access_token") if isinstance(b, dict) else None
check("login with new password", s == 200 and newtok, f"-> {s}")
# revert so admin1234 keeps working
s, b = call("POST", "/admin/change-password", {"current_password":"newpass999","new_password":"admin1234"}, newtok)
check("revert password to admin1234", s == 200, f"-> {s}")

s, b = call("DELETE", f"/projects/{pid}", token=token)
check("delete project (auth)", s == 200, f"-> {s}")
s, b = call("GET", "/projects")
check("project removed from list", all(p.get("id")!=pid for p in b) if isinstance(b,list) else False, f"-> {s}")

print("\n" + ("ALL LIVE BACKEND TESTS PASSED" if ok else "SOME LIVE TESTS FAILED"))
sys.exit(0 if ok else 1)
