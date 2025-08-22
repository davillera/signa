from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class BrandBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    brand_name: str
    owner_cedula: str

class BrandOut(BrandBase):
    id: UUID
    logo_url: Optional[str] = None
    owner_id: UUID
    model_config = ConfigDict(from_attributes=True)

class BrandUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    brand_name: Optional[str] = None
    owner_cedula: Optional[str] = None
