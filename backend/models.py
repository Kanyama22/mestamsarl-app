from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# Category Models
class CategoryBase(BaseModel):
    name: str
    description: str
    image: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Product Models
class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    description: str
    image: str
    featured: bool = False
    specifications: Optional[Dict[str, str]] = {}

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class CustomerInfo(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    customer_info: CustomerInfo

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[OrderItem]
    total: float
    status: str = "pending"
    customer_info: CustomerInfo
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Contact Models
class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str

class ContactMessage(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

class DashboardStats(BaseModel):
    total_products: int
    total_categories: int
    total_orders: int
    total_messages: int
