#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove test-created projects from the deployed backend."""
import json, urllib.request

B = "https://bskim-api-production.up.railway.app"

def call(m, p, body=None, tok=None):
    h = {"Content-Type": "application/json"}
    if tok:
        h["Authorization"] = "Bearer " + tok
    d = json.dumps(body).encode() if body else None
    r = urllib.request.Request(B + p, data=d, headers=h, method=m)
    with urllib.request.urlopen(r, timeout=30) as x:
        return json.loads(x.read().decode() or "null")

tok = call("POST", "/admin/login", {"username": "admin", "password": "admin1234"})["access_token"]
projs = call("GET", "/projects")
test = [p for p in projs if p["title"].startswith("E2E")]
for p in test:
    call("DELETE", "/projects/" + str(p["id"]), tok=tok)
remaining = call("GET", "/projects")
print(f"Deleted {len(test)} test projects. Remaining: {len(remaining)}")
