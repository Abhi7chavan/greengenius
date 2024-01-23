from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from service.models.user import User, UserData
from service.models.database import get_db
from service.models.redis import redis_client
router = APIRouter()

@router.post("/create_user/", response_model=dict)
async def create_user(user_data: UserData, db: Session = Depends(get_db)):
    try:
        user_dict = user_data.dict()
        user_db = User(**user_dict)
        db.add(user_db)
        db.commit()
        db.refresh(user_db)
        
        redis_client.set(user_data.username,user_data.json())
        return {"statuscode": 200, "message": f"User {user_data.username} successfully created!"}
    except Exception as e:
        return {"statuscode": 500, "message": f"Error creating user: {str(e)}"}

@router.get("get_user/username",response_model=dict)
async def get_user(username:str,db:Session=Depends(get_db)):
    try:
        cache_user_json = redis_client.get(username)
        if cache_user_json:
            userdata = UserData.parse_raw(cache_user_json)
            return {"statuscode": 200, "message": f"User {username} found in cache", "user": userdata}
        
        #if not in cache do database operation
        user_db = db.query(User).filter(User.username==username).first()
        
        
        if user_db:
            user_data = UserData.from_orm(user_db)
            #store in redis if not found in redis
            redis_client.set(username,userdata.json())
            return {"statuscode": 200, "message": f"User {username} found in the database", "user": user_data}
        else:
            return {"statuscode": 404, "message": f"User {username} not found"}
        
    except Exception as e:
        return {"statuscode": 500, "message": f"Error fetching user: {str(e)}"}