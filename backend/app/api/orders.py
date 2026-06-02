from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.dependencies.database import get_db

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
)

from app.services.order_service import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
):
    try:
        return OrderService.create_order(
            db,
            payload,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

@router.get(
    "",
    response_model=list[OrderResponse],
)
def get_orders(
    db: Session = Depends(get_db),
):
    return OrderService.get_all_orders(
        db
    )

@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def get_order(
    order_id: UUID,
    db: Session = Depends(get_db),
):

    order = (
        OrderService.get_order_by_id(
            db,
            order_id,
        )
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order

@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_order(
    order_id: UUID,
    db: Session = Depends(get_db),
):

    order = (
        OrderService.get_order_by_id(
            db,
            order_id,
        )
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    OrderService.delete_order(
        db,
        order,
    )