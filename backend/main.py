from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from database import engine, get_db, Base
from models import Admin, Project, ContactMessage
from schemas import (
    ProjectCreate, Project as ProjectSchema,
    ContactMessageCreate, ContactMessage as ContactMessageSchema,
    AdminLogin, Token, ChangePassword
)
from security import (
    hash_password, verify_password, create_access_token,
    get_current_admin, verify_token
)
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio API")

# CORS — auth uses a Bearer token in the Authorization header (not cookies),
# so allow_credentials must stay False for "*" origins to be valid per the CORS spec.
# This lets every Vercel domain (including preview *.vercel.app subdomains) call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize admin user if not exists
def init_admin(db: Session):
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin:
        hashed_password = hash_password("admin1234")
        admin = Admin(username="admin", hashed_password=hashed_password)
        db.add(admin)
        db.commit()

@app.on_event("startup")
async def startup():
    db = next(get_db())
    try:
        init_admin(db)
    finally:
        db.close()

# === Authentication ===
@app.post("/admin/login", response_model=Token)
def login(credentials: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == credentials.username).first()
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={"sub": admin.username},
        expires_delta=timedelta(minutes=30)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": admin.username
    }

@app.post("/admin/change-password")
def change_password(
    req: ChangePassword,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    current_admin.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

# === Projects ===
@app.get("/projects", response_model=list[ProjectSchema])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@app.post("/projects", response_model=ProjectSchema)
def create_project(
    project: ProjectCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project_update: ProjectCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in project_update.dict().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

# === Contact ===
@app.post("/contact", response_model=ContactMessageSchema)
def create_contact_message(
    message: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    db_message = ContactMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/contact-messages", response_model=list[ContactMessageSchema])
def get_contact_messages(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    messages = db.query(ContactMessage).all()
    return messages

# === Health Check ===
@app.get("/")
def read_root():
    return {"message": "Portfolio API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
