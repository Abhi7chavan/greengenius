import time
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from service.models.database import get_db
from service.models.my_redis import redis_client
from fastapi.security import OAuth2PasswordRequestForm
from service.submeters_service import get_submeter
from service.household_service import get_item_by_name
from confluent_kafka import Producer
import asyncio
import random

router = APIRouter()

def delivery_report(err, msg):
    if err is not None:
        print('Message delivery failed: {}'.format(err))
    else:
        print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))

class KafkaProducer:
    def __init__(self, client_id='ems-household-manager'):
        self.producer = Producer({
            "bootstrap.servers": "172.30.109.131:9092",
            "client.id": client_id
        })
        self.topic = 'energy'

    def produce_message(self, message):
        self.producer.produce(topic=self.topic, value=json.dumps(message), callback=delivery_report)
        self.producer.flush()

producer = KafkaProducer()

@router.get("/send_realtime_data/{username}")
async def send_realtime_data(username: str, db: Session = Depends(get_db)):
    submeter_data = await get_submeter(username, db)
    sub_data = submeter_data['data']
    associations = sub_data.get('associations', {})

    itemlist = []
    household_items = {}

    for record, items in associations.items():
        itemlist.extend(items)

    for item in itemlist:
        data = await get_item_by_name(item, db)
        data = data[0]
        household_items[data[1]] = {"watt_range": (data[2], data[3]), "is_on": True, "status": "cool"}

    while True:
        realtime_data = generate_realtime_data(household_items)
        producer.produce_message(realtime_data)
        await asyncio.sleep(2)

def generate_realtime_data(household_items):
    realtime = {"timestamp": "", "power_factor": 0.9, "voltage": 120, "total_consumption": 0, "items": {}}

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

    return realtime
