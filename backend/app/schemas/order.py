from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field
from datetime import datetime



class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: UUID
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: UUID
    quantity: int
    unit_price: Decimal

    model_config = {
        "from_attributes": True
    }


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    total_amount: Decimal
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }