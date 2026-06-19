#!/usr/bin/env python3
import json
import sqlite3
import hashlib
import os
import hmac
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timedelta
from pathlib import Path

# 설정
DB_PATH = "portfolio.db"
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"

# 데이터베이스 초기화
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Admin 테이블
    c.execute('''CREATE TABLE IF NOT EXISTS admins
                 (id INTEGER PRIMARY KEY, username TEXT UNIQUE, hashed_password TEXT, created_at TEXT)''')

    # Project 테이블
    c.execute('''CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY, title TEXT, description TEXT, image_url TEXT, technologies TEXT, link TEXT, created_at TEXT)''')

    # ContactMessage 테이블
    c.execute('''CREATE TABLE IF NOT EXISTS contact_messages
                 (id INTEGER PRIMARY KEY, name TEXT, email TEXT, subject TEXT, message TEXT, created_at TEXT)''')

    # 초기 관리자 생성
    try:
        hashed = hash_password("admin1234")
        c.execute("INSERT INTO admins (username, hashed_password, created_at) VALUES (?, ?, ?)",
                  ("admin", hashed, datetime.utcnow().isoformat()))
        conn.commit()
    except sqlite3.IntegrityError:
        pass

    conn.close()

def hash_password(password: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode(), b'salt', 100000).hex()

def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed

def create_token(username: str) -> str:
    payload = f"{username}:{int(datetime.utcnow().timestamp())}"
    signature = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    token = base64.b64encode(f"{payload}.{signature}".encode()).decode()
    return token

def verify_token(token: str) -> str:
    try:
        decoded = base64.b64decode(token).decode()
        payload, signature = decoded.rsplit(".", 1)
        expected_sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if signature == expected_sig:
            username = payload.split(":")[0]
            return username
        return None
    except:
        return None

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/":
            self.send_json({"message": "Portfolio API running"})
        elif path == "/projects":
            self.get_projects()
        elif path.startswith("/projects/"):
            project_id = path.split("/")[-1]
            self.get_project(int(project_id))
        else:
            self.send_error(404)

    def do_POST(self):
        path = urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(body) if body else {}
        except:
            data = {}

        if path == "/admin/login":
            self.login(data)
        elif path == "/admin/change-password":
            self.change_password(data)
        elif path == "/projects":
            self.create_project(data)
        elif path == "/contact":
            self.create_contact(data)
        else:
            self.send_error(404)

    def do_DELETE(self):
        path = urlparse(self.path).path
        if path.startswith("/projects/"):
            project_id = path.split("/")[-1]
            self.delete_project(int(project_id))
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    # 헬퍼 메서드
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def get_auth_header(self):
        auth = self.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            return auth[7:]
        return None

    # API 메서드
    def login(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return self.send_json({"detail": "Missing credentials"}, 400)

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT * FROM admins WHERE username = ?", (username,))
        admin = c.fetchone()
        conn.close()

        if not admin or not verify_password(password, admin[2]):
            return self.send_json({"detail": "Invalid credentials"}, 401)

        token = create_token(username)
        self.send_json({
            "access_token": token,
            "token_type": "bearer",
            "username": username
        })

    def change_password(self, data):
        token = self.get_auth_header()
        username = verify_token(token)

        if not username:
            return self.send_json({"detail": "Unauthorized"}, 401)

        current = data.get("current_password")
        new = data.get("new_password")

        if not current or not new:
            return self.send_json({"detail": "Missing password"}, 400)

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT * FROM admins WHERE username = ?", (username,))
        admin = c.fetchone()

        if not admin or not verify_password(current, admin[2]):
            conn.close()
            return self.send_json({"detail": "Invalid current password"}, 401)

        new_hashed = hash_password(new)
        c.execute("UPDATE admins SET hashed_password = ? WHERE username = ?", (new_hashed, username))
        conn.commit()
        conn.close()

        self.send_json({"message": "Password changed successfully"})

    def get_projects(self):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, title, description, image_url, technologies, link, created_at FROM projects")
        projects = [{"id": row[0], "title": row[1], "description": row[2], "image_url": row[3], "technologies": row[4], "link": row[5], "created_at": row[6]} for row in c.fetchall()]
        conn.close()
        self.send_json(projects)

    def get_project(self, project_id):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, title, description, image_url, technologies, link, created_at FROM projects WHERE id = ?", (project_id,))
        row = c.fetchone()
        conn.close()

        if not row:
            return self.send_json({"detail": "Not found"}, 404)

        self.send_json({"id": row[0], "title": row[1], "description": row[2], "image_url": row[3], "technologies": row[4], "link": row[5], "created_at": row[6]})

    def create_project(self, data):
        token = self.get_auth_header()
        if not verify_token(token):
            return self.send_json({"detail": "Unauthorized"}, 401)

        title = data.get("title")
        description = data.get("description")
        technologies = data.get("technologies")

        if not title or not description or not technologies:
            return self.send_json({"detail": "Missing fields"}, 400)

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        created_at = datetime.utcnow().isoformat()
        c.execute("INSERT INTO projects (title, description, image_url, technologies, link, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                  (title, description, data.get("image_url", ""), technologies, data.get("link", ""), created_at))
        conn.commit()
        project_id = c.lastrowid
        conn.close()

        self.send_json({"id": project_id, "title": title, "description": description, "image_url": data.get("image_url", ""), "technologies": technologies, "link": data.get("link", ""), "created_at": created_at}, 201)

    def delete_project(self, project_id):
        token = self.get_auth_header()
        if not verify_token(token):
            return self.send_json({"detail": "Unauthorized"}, 401)

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        conn.commit()
        conn.close()

        self.send_json({"message": "Project deleted successfully"})

    def create_contact(self, data):
        name = data.get("name")
        email = data.get("email")
        subject = data.get("subject")
        message = data.get("message")

        if not all([name, email, subject, message]):
            return self.send_json({"detail": "Missing fields"}, 400)

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        created_at = datetime.utcnow().isoformat()
        c.execute("INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)",
                  (name, email, subject, message, created_at))
        conn.commit()
        conn.close()

        self.send_json({"message": "Contact message saved", "id": c.lastrowid}, 201)

    def log_message(self, format, *args):
        pass  # 로그 끄기

if __name__ == "__main__":
    init_db()
    server = HTTPServer(("localhost", 8000), APIHandler)
    print("🚀 Backend running on http://localhost:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
