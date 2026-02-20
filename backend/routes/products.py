from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime

from models import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get("", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None
):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query).to_list(1000)
    return [Product(**product) for product in products]

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@router.post("", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.dict())
    await db.products.insert_one(product_obj.dict())
    return product_obj

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductUpdate):
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated = await db.products.find_one({"id": product_id})
    return Product(**updated)

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
