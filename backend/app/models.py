import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    brands = relationship("Brand", back_populates="owner", cascade="all, delete-orphan")


class Brand(Base):
    __tablename__ = "brands"

    # 🔒 Unicidad por dueño + nombre de marca
    __table_args__ = (
        UniqueConstraint("owner_id", "brand_name", name="uq_brand_owner_brandname"),
        Index("ix_brand_owner_name", "owner_id", "brand_name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(50), nullable=False)
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_cedula: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    logo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_blob_name: Mapped[str | None] = mapped_column(String(512), nullable=True)

    owner_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    owner = relationship("User", back_populates="brands")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
