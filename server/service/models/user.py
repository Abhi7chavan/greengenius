from sqlalchemy import Column, Integer, String, ARRAY, DateTime, func
import uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from typing import List

UserBase = declarative_base()

class User(UserBase):
    __tablename__ = "users"
    __table_args__ = {'schema': 'meta'} 

    id = Column(UUID(as_uuid=True), default=uuid.uuid1, primary_key=True, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    location = Column(String)
    ConsumptionReport = Column(ARRAY(String))
    HouseholdItems = Column(ARRAY(String))
    SubmeterCount = Column(Integer)
    created_at = Column(Integer, server_default=func.extract('epoch', func.now()))
    updated_at = Column(Integer, onupdate=func.extract('epoch', func.now()), server_default='0') 


class UserData(BaseModel):
    username: str
    email: str
    password: str
    location: str
    ConsumptionReport: List[str]
    HouseholdItems: List[str]
    SubmeterCount: int
