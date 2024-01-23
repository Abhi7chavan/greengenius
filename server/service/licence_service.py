from service.models.licence import LicenseData
from service.models.licence import LicenseDB
from service.models.user import User
from service.user_service import create_user, UserData
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from service.models.database import get_db
from fastapi import FastAPI, Depends

router = APIRouter()
@router.post("/submit_license")
async def submit_license(data: LicenseData,db: Session = Depends(get_db)):
    try:
        message = {}

        # Check if the username is already in use
        existing_username = db.query(LicenseDB).filter(LicenseDB.username == data.username).first()
        if existing_username:
            message["error"] = f"{data.username} already in use"

        # Check if the email is already in use
        existing_email = db.query(LicenseDB).filter(LicenseDB.email == data.email).first()
        if existing_email:
            message["error"] = f"{data.email} is already in use"

        # If there are errors, raise an HTTPException with the error details and status code
        if message:
            return {"statuscode":400,"message":message}

        license_db = LicenseDB(**data.dict())
        # Add the license to the database
        db.add(license_db)
        db.commit()
        db.refresh(license_db)
        #create user from licence data
        user_data = {
            "username": data.username,
            "email": data.email,
            "password": f"Admin{data.username}",
            "location": data.location,
            "ConsumptionReport": data.information,
            "HouseholdItems": data.householdItems,
            "SubmeterCount": data.submeters
        }
        user = User(**user_data)
        db.add(user)
        db.commit()
        user_data = UserData(
        username=data.username,
        email=data.email,
        password=f"Admin{data.username}",  # You might want to generate a password here
        location=data.location,
        ConsumptionReport=data.information,
        HouseholdItems=data.householdItems,
        SubmeterCount=data.submeters
        )
        
        await create_user(user_data, db)
        
        #create_permisson for user
        

        # Return the created license
        return {"statuscode":200,"message":f"User {data.username} successfully created!"}

    except Exception as e:
        # Handle any exceptions (e.g., validation errors, database errors)
        raise HTTPException(status_code=500, detail=str(e))
        

