from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from datetime import datetime

from models import Category, CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get("", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find().to_list(1000)
    return [Category(**cat) for cat in categories]

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: str):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return Category(**category)

@router.post("", response_model=Category)
async def create_category(category: CategoryCreate):
    category_obj = Category(**category.dict())
    await db.categories.insert_one(category_obj.dict())
    return category_obj

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: str, category: CategoryUpdate):
    existing = await db.categories.find_one({"id": category_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.categories.update_one(
        {"id": category_id},
        {"$set": update_data}
    )
    
    updated = await db.categories.find_one({"id": category_id})
    return Category(**updated)

@router.delete("/{category_id}")
async def delete_category(category_id: str):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
