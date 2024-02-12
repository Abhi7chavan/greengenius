from typing import List
from fastapi import APIRouter, HTTPException, Depends, status,Body
from sqlalchemy.orm import Session
from service.models.submeter import Submeter, SubmeterData
from service.models.database import get_db
from service.models.user import User

router = APIRouter()

@router.post("/create_submeter/")
def create_submeter(
    submeter_data: dict = Body(...),
    db: Session = Depends(get_db),
):
    try:
        # Check if the user with the given username exists
        name_items_dict = {v['name']: v['items'] for k, v in submeter_data.items() if k.isnumeric()}

        # Extract 'username' value
        username = submeter_data['username']
        user = db.query(User).filter(User.username ==username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with username {username} not found",
            )
            
        submeter = Submeter(
                username=username,
                associations=name_items_dict,
            )
        
        db.add(submeter)
        db.commit()
        db.refresh(submeter)

        return {"statuscode": 200,"message": "Submeter created successfully", "submeter_id": submeter.id}
    except Exception as e:
        return {"statuscode": 400,"message": "Bad request"}
        

@router.get("/get_submeters/{username}")
async def get_submeter(username: str, db: Session = Depends(get_db)):
    submeter = db.query(Submeter).filter(Submeter.username == username).first()

    if not submeter:
        raise HTTPException(status_code=404, detail=f"Submeter with username {username} not found")

    return {"statuscode": 200, "data": submeter}
