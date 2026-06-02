from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    sku: str = Field(..., min_length=2, max_length=100)
    price: Decimal = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)


class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    price: Decimal | None = None
    stock_quantity: int | None = None


class ProductResponse(BaseModel):
    id: UUID
    name: str
    sku: str
    price: Decimal
    stock_quantity: int

    model_config = {
        "from_attributes": True
    }