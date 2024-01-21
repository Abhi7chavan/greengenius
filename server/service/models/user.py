from sqlalchemy import Column, Integer, String, create_engine, ARRAY, DateTime, func
from service.models.database import Base, engine
from pydantic import BaseModel

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'meta'} 

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    location = Column(String)
    ConsumptionReport = Column(ARRAY(String))  # Fixed typo in column name
    HouseholdItems = Column(ARRAY(String))
    SubmeterCount = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserData(BaseModel):
    username: str
    email: str
    password: str
    location: str
    ConsumptionReport: list  # Adjusted to use list instead of str
    HouseholdItems: list  # Adjusted to use list instead of str