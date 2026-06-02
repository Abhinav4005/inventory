from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class CustomerCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    email: EmailStr

    phone_number: str = Field(
        ...,
        min_length=10,
        max_length=20,
    )


class CustomerResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone_number: str

    model_config = {
        "from_attributes": True
    }

class CustomerUpdate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str