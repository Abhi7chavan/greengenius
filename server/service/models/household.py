from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

houseitembase = declarative_base()
class HouseItem(houseitembase):
    __tablename__ = 'houseitem'
    __table_args__ = {'schema': 'meta'} 

    item_id = Column(Integer, primary_key=True)
    item_name = Column(String)
    min_watt_range = Column(Integer)
    max_watt_range = Column(Integer)
    
    
class HouseItemSchema(BaseModel):
    item_id: int
    item_name: str
    min_watt_range: int
    max_watt_range: int
