from service.models.licence import LicenseData
from service.models.user import UserData
from fastapi import APIRouter
from fastapi import FastAPI, Depends

router = APIRouter()
@router.post("/submit_license")
async def submit_license(data: LicenseData):
    # Process the data as needed (e.g., store in a database)
    print("Received data:", data.dict())
    # Return a response (you can customize this based on your needs)
    return {"message": "Data received successfully"}