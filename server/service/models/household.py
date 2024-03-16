from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base


class HouseItemSchema(BaseModel):
    item_id: int
    item_name: str
    min_watt_range: int
    max_watt_range: int
