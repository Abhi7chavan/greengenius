from fastapi import APIRouter, HTTPException, Depends, status
from service.models.user import EscalationSchema, Escalation
from service.models.database import get_db
from sqlalchemy.orm import Session 
from uuid import UUID

router = APIRouter()

@router.post("/create_escalation/", response_model=dict)
async def create_escalation(escalation_data: EscalationSchema, db: Session = Depends(get_db)):
    try:
        escalation_data = escalation_data.dict()
        user_id = UUID(escalation_data['user_id'])
        escalation_data['user_id'] = user_id
        print(escalation_data)
        escalation_db = Escalation(**escalation_data)
        db.add(escalation_db)
        db.commit()
        escalation_dict = {column.name: getattr(escalation_db, column.name) for column in escalation_db.__table__.columns}
        return {"status_code":200, "message":"Escalation data is successfully created", "data": escalation_dict}
    except Exception as e:
        return {"status_code": 500, "message": f"Error creating user: {str(e)}"}
    
@router.delete("/delete_escalation/{escalation_name}")
async def delete_escalation(escalation_name:str, db:Session = Depends(get_db)):
    try:
        escalation = db.query(Escalation).filter(Escalation.escalation_name== escalation_name).first()

        if escalation:
            db.delete(escalation)
            db.commit()
            return {"status_code":200, "message":"Escalation deleted Successfully"}
        else:
            return {"status_code":500, "message":"Record not found"}
    except Exception as e:
             return {"status_code": 500, "message": f"Error deleting: {str(e)}"}

