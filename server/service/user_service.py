import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from service.models.user import User, UserData
from service.models.database import get_db
from service.models.my_redis import redis_client
import ast
from datetime import datetime, timezone, timedelta
router = APIRouter()

@router.post("/create_user/", response_model=dict)
async def create_user(user_data: UserData, db: Session = Depends(get_db)):
    try:
        user_db = User(**user_data)
        db.add(user_db)
        db.commit() 
     
        user_dict = {column.name: getattr(user_db, column.name) for column in user_db.__table__.columns}
        user_dict['id'] = str(user_dict['id'])
        user_key = f"user:{user_dict['id']}"
        json_data = json.dumps(user_dict)
        redis_client.set(user_key, json_data)
        return {"statuscode": 200, "message":user_dict['id']}
    except Exception as e:
        return {"statuscode": 500, "message": f"Error creating user: {str(e)}"}

@router.get("/get_user/{username}", response_model=dict)
async def get_user(userid: str, db: Session = Depends(get_db)):
    try:
        
        user_key = f"user:{userid}"
        user_data_json = redis_client.get(user_key)
        if user_data_json:
            return user_data_json

    except Exception as e:
        return {"statuscode": 500, "message": f"Error fetching user: {str(e)}"}