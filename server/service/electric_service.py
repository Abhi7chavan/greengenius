import json
from fastapi import APIRouter, HTTPException, Depends ,status
from sqlalchemy.orm import Session 
from service.models.database import get_db
from service.models.my_redis import redis_client
from fastapi.security import OAuth2PasswordRequestForm
import ast
from datetime import datetime, timezone, timedelta
from service.submeters_service import get_submeter
from service.household_service import get_household_items,get_item_by_name
import random
import time
import json


router = APIRouter()

@router.get("/get_electric/{username}")
async def get_electricdata(username: str, db: Session = Depends(get_db)):
    submeter_data = await get_submeter(username, db)
    
    sub_data = submeter_data['data']
    associations = sub_data.get('associations', {})  # Get associations, default to empty dictionary if not present

    itemlist = []
    household_items = {}
    for record, items in associations.items():
        itemlist.extend(items)
        
    for item in itemlist:
        print(item)
        data = await get_item_by_name(item,db)
        data = data[0]
        household_items[data[1]]={"watt_range":(data[2],data[3]),"is_on": True, "status": "cool"}
    realdata = generate_realtime_data(household_items)
    return realdata

    
def generate_realtime_data(household_items):
    realtime = {"timestamp": "", "power_factor": 0.9, "voltage": 120, "total_consumption": 0, "items": {}}

    while True:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        realtime["timestamp"] = timestamp

        total_wattage = 0
        items_dict = {}

        for item, details in household_items.items():
            if details["is_on"]:
                wattage = random.randint(details["watt_range"][0], details["watt_range"][1])
                status = "hot" if wattage == details["watt_range"][1] else "cool"
                item_data = {"wattage": wattage, "status": status, "is_on": details['is_on']}
                items_dict[item] = item_data
                total_wattage += wattage
            else:
                item_data = {"wattage": 0, "status": "OFF"}
                items_dict[item] = item_data

        realtime["total_consumption"] = total_wattage
        realtime["items"] = items_dict

        time.sleep(2)  # Generate data every 2 seconds (for testing purposes)
        return realtime



