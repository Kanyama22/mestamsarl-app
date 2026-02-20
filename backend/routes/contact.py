from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from datetime import datetime

from models import ContactMessage, ContactCreate

router = APIRouter(prefix="/api/contact", tags=["contact"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("", response_model=ContactMessage)
async def create_message(message: ContactCreate):
    message_obj = ContactMessage(**message.dict())
    await db.contact_messages.insert_one(message_obj.dict())
    return message_obj

@router.get("", response_model=List[ContactMessage])
async def get_messages():
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(1000)
    return [ContactMessage(**msg) for msg in messages]

@router.put("/{message_id}/status")
async def update_message_status(message_id: str, status: str):
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Message status updated successfully"}
