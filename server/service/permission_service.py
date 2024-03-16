from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from service.models.permission import Permission,PermissionData
from service.models.database import get_db
from service.models.my_redis import redis_client
from sqlalchemy import select
import json

router = APIRouter()


@router.post("/create_permission/", response_model=dict)
async def create_permission(userdata, db: Session = Depends(get_db)):
    try:
        if userdata is not None:
            if 'electric' in userdata['ConsumptionReport']:
                has_electric = True
            else:
                has_electric= False
            if 'water' in userdata['ConsumptionReport']:
                has_water = True
            else:
                has_water= False
            if 'weather' in userdata['ConsumptionReport']:
                has_weather = True
            else:
                has_weather= False

            print(has_electric,has_water,has_weather)
            # Create a Permission record based on the conditions
            permission_db = {
                "userid": userdata['id'],
                "electric": has_electric,
                "water": has_water,
                "weather": has_weather,
            }
            print(type(permission_db))
            permission_db = Permission(**permission_db)
            db.add(permission_db)
            db.commit()
            db.refresh(permission_db)
        
            # Retrieve the Permission data
            permission_dict = {column.name: getattr(permission_db, column.name) for column in permission_db.__table__.columns}
            permission_dict = json.dumps(permission_dict)
            # Update Redis key with the Permission information
            permission_key = f"permission:{permission_dict['id']}"  # Assuming 'id' is the primary key of the Permission model
            redis_client.set(permission_key, permission_dict)
           
            return {"statuscode": 200, "message": permission_dict}
    except Exception as e:
        return {"statuscode": 400, "message": str(e)}
    finally:
        db.close()



@router.get("/get_permission/{userid}")
async def get_permission(userid:str, db: Session = Depends(get_db)):
    permission = db.query(Permission).filter(Permission.userid == userid).first()
    if permission:
            user_dict = {column.key: getattr(permission, column.key) for column in Permission.__table__.columns}
            return {"statuscode": 200, "data": user_dict}
    else:
        return {"statuscode": 404, "message": "Permission not found for User"}
