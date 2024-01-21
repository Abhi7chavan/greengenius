# models.py
from sqlalchemy import Column, Integer, String, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import List

Base = declarative_base()

class Licence(Base):
    __tablename__ = "licence"
    __table_args__ = {'schema': 'meta'} 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    lastname = Column(String, index=True)
    location = Column(String, index=True)
    information = Column(ARRAY(String))  # Use ARRAY for array types
    householdItems = Column(ARRAY(String))  # Use ARRAY for array types

class LicenseData(BaseModel):
    name: str
    lastname: str
    location: str
    information: List[str] = []  # Use List with the actual type
    householdItems: List[str] = []  # Use List with the actual type
    submeters: int
