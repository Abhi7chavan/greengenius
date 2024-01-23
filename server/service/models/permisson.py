from sqlalchemy import Column, DateTime, func, Boolean , Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import text
from datetime import datetime
from pydantic import BaseModel
import uuid

PermissionBase = declarative_base()

class PermissionData(BaseModel):
    userid: int
    electric: bool
    water: bool
    weather: bool

class Permission(PermissionBase):
    __tablename__ = "permissions"
    __table_args__ = {'schema': 'meta'}
     
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, unique=True, index=True, nullable=False)
    userid = Column(Integer, nullable=False)  # Assuming you want to store user ID here
    electric = Column(Boolean, default=False)
    water = Column(Boolean, default=False)
    weather = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
