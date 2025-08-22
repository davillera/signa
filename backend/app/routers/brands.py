from typing import List, Optional
from uuid import UUID
from pydantic import EmailStr
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app import models
from app.schemas import BrandOut
from app.auth import get_current_user
from app.storage.azure_blob import upload_logo, delete_logo

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.post("", response_model=BrandOut, status_code=201)
def create_brand(
    full_name: str = Form(...),
    email: EmailStr = Form(...),
    phone_number: str = Form(...),
    brand_name: str = Form(...),
    owner_cedula: str = Form(...),
    logo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    exists = (
        db.query(models.Brand)
        .filter(
            models.Brand.owner_id == current_user.id,
            models.Brand.brand_name == brand_name.strip(),
        )
        .first()
    )
    if exists:
        raise HTTPException(status_code=400, detail="Brand name already exists for this user")

    brand = models.Brand(
        full_name=full_name.strip(),
        email=str(email),
        phone_number=phone_number.strip(),
        brand_name=brand_name.strip(),
        owner_cedula=owner_cedula.strip(),
        owner_id=current_user.id,
    )
    db.add(brand)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Brand name must be unique per user")
    db.refresh(brand)

    if logo is not None:
        logo_url, blob_name = upload_logo(logo, brand.id)
        brand.logo_url = logo_url
        brand.logo_blob_name = blob_name
        db.add(brand)
        db.commit()
        db.refresh(brand)

    return brand

@router.patch("/{brand_id}", response_model=BrandOut)
def update_brand(
    brand_id: UUID,
    full_name: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    phone_number: Optional[str] = Form(None),
    brand_name: Optional[str] = Form(None),
    owner_cedula: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    brand = (
        db.query(models.Brand)
        .filter(models.Brand.id == brand_id, models.Brand.owner_id == current_user.id)
        .first()
    )
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    if brand_name is not None:
        new_name = brand_name.strip()
        conflict = (
            db.query(models.Brand)
            .filter(
                models.Brand.owner_id == current_user.id,
                models.Brand.brand_name == new_name,
                models.Brand.id != brand.id,
            )
            .first()
        )
        if conflict:
            raise HTTPException(status_code=400, detail="Brand name already exists for this user")
        brand.brand_name = new_name

    if full_name is not None:
        brand.full_name = full_name.strip()
    if email is not None:
        brand.email = str(email)
    if phone_number is not None:
        brand.phone_number = phone_number.strip()
    if owner_cedula is not None:
        brand.owner_cedula = owner_cedula.strip()

    if logo is not None:
        if brand.logo_blob_name:
            delete_logo(brand.logo_blob_name)
        logo_url, blob_name = upload_logo(logo, brand.id)
        brand.logo_url = logo_url
        brand.logo_blob_name = blob_name

    db.add(brand)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Brand name must be unique per user")
    db.refresh(brand)
    return brand

@router.get("", response_model=List[BrandOut])
def list_brands(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):   
    q = (
        db.query(models.Brand)
        .filter(models.Brand.owner_id == current_user.id)
        .order_by(models.Brand.created_at.desc())
    )
    return q.offset(skip).limit(limit).all()


@router.get("/{brand_id}", response_model=BrandOut)
def get_brand(
    brand_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    
    brand = (
        db.query(models.Brand)
        .filter(models.Brand.id == brand_id, models.Brand.owner_id == current_user.id)
        .first()
    )
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.delete("/{brand_id}", status_code=200)
def delete_brand(
    brand_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    brand = (
        db.query(models.Brand)
        .filter(models.Brand.id == brand_id, models.Brand.owner_id == current_user.id)
        .first()
    )
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    if brand.logo_blob_name:
        delete_logo(brand.logo_blob_name)

    db.delete(brand)
    db.commit()
    return {"detail": f"Brand '{brand.brand_name}' deleted"}