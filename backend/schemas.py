from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    technologies: str
    link: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactMessage(ContactMessageCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

class AdminInfo(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True
