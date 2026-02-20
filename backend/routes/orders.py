from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from datetime import datetime

from models import Order, OrderCreate

router = APIRouter(prefix="/api/orders", tags=["orders"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("", response_model=Order)
async def create_order(order: OrderCreate):
    # Calculate total
    total = sum(item.price * item.quantity for item in order.items)
    
    order_obj = Order(
        **order.dict(),
        total=total
    )
    
    await db.orders.insert_one(order_obj.dict())
    return order_obj

@router.get("", response_model=List[Order])
async def get_orders():
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    return [Order(**order) for order in orders]

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated successfully"}
