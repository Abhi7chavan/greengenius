from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from service.models.permisson import Permission,PermissionData
from service.models.database import get_db



router = APIRouter()


