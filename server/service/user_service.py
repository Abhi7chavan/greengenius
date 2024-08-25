import json
from fastapi import APIRouter, HTTPException, Depends ,status
from sqlalchemy.orm import Session 
from service.models.user import User, UserData
from service.models.database import get_db
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordRequestForm
import ast
from datetime import datetime, timezone, timedelta
router = APIRouter()

ALGORITHM = "HS256"
SECRET_KEY = "68014a098ff015791d9484dcb954d0bfad225706ec0bdbef10085f3fad51f960"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
@router.post("/create_user/", response_model=dict)
async def create_user(user_data: UserData, db: Session = Depends(get_db)):
    try:
        user_db = User(**user_data)
        db.add(user_db)
        db.commit() 
        user_dict = {column.name: getattr(user_db, column.name) for column in user_db.__table__.columns}
        user_dict['id'] = str(user_dict['id'])
        # user_key = f"user:{user_dict['id']}"
        # json_data = json.dumps(user_dict)
        # redis_client.set(user_key, json_data)
        return {"statuscode": 200, "message":user_dict['username']}
    except Exception as e:
        return {"statuscode": 500, "message": f"Error creating user: {str(e)}"}

@router.get("/get_user/{username}")
async def get_user(username: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == username).first()
        if user:
            user_dict = {column.key: getattr(user, column.key) for column in User.__table__.columns}
            return {"statuscode": 200, "data": user_dict}
        else:
            return {"statuscode": 404, "message": "User not found"}
    except Exception as e:
        print("Exception:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching user: {str(e)}")

@router.post("/login")
async def login(request_data: dict, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == request_data['username']).first()
        if user and user.password == request_data['password']:  # Note: This is for demonstration purposes. Use secure password hashing in production.
            # Create JWT token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

            return {"statuscode":200,"access_token": access_token, "userid": user.id,"username":user.username ,"message": "Login successful"}
        else:
            return {"statuscode": 401, "message": "Invalid credentials"}

    except Exception as e:
        print("Exception:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error during login: {str(e)}")