from sqlalchemy import Column, Integer, String, JSON, DateTime, func, ForeignKey,ARRAY
import uuid
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from typing import List,Any

SubmeterBase = declarative_base()


class Submeter(SubmeterBase):
    __tablename__ = "submeters"
    __table_args__ = {'schema': 'meta'} 

    id = Column(UUID(as_uuid=True), default=uuid.uuid1, primary_key=True, unique=True, index=True, nullable=False)
    username = Column(String,nullable=False)
    associations = Column(JSON, nullable=False) 
    created_at = Column(Integer, server_default=func.extract('epoch', func.now()))
    updated_at = Column(Integer, onupdate=func.extract('epoch', func.now()), server_default='0')


class SubmeterData(BaseModel):
    username: str
    associations: Any