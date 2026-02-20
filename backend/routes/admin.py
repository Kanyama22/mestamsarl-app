from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta
import jwt

from models import AdminLogin, AdminToken, DashboardStats

router = APIRouter(prefix="/api/admin", tags=["admin"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret (in production, use environment variable)
SECRET_KEY = os.environ.get('JWT_SECRET', 'mestam-secret-key-2025')
ALGORITHM = "HS256"

# Mock admin credentials (in production, use hashed passwords in DB)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@router.post("/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    if credentials.username != ADMIN_USERNAME or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token_data = {
        "sub": credentials.username,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    
    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return AdminToken(access_token=access_token)

@router.get("/stats", response_model=DashboardStats)
async def get_stats():
    total_products = await db.products.count_documents({})
    total_categories = await db.categories.count_documents({})
    total_orders = await db.orders.count_documents({})
    total_messages = await db.contact_messages.count_documents({})
    
    return DashboardStats(
        total_products=total_products,
        total_categories=total_categories,
        total_orders=total_orders,
        total_messages=total_messages
    )
