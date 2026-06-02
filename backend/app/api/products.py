from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session
from uuid import UUID

from app.dependencies.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.services.product_service import ProductService


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
):

    existing_product = ProductService.get_by_sku(
        db,
        payload.sku,
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU already exists",
        )

    return ProductService.create_product(
        db,
        payload,
    )

@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    return ProductService.get_all_products(db)

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db),
):
    product = ProductService.get_product_by_id(
        db,
        product_id,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product

@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
):

    product = ProductService.get_product_by_id(
        db,
        product_id,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if payload.sku:

        existing_product = ProductService.get_by_sku(
            db,
            payload.sku,
        )

        if (
            existing_product
            and existing_product.id != product.id
        ):
            raise HTTPException(
                status_code=409,
                detail="Product SKU already exists",
            )

    return ProductService.update_product(
        db,
        product,
        payload,
    )

@router.delete(
    "/{product_id}",
    status_code=204
)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
):

    product = ProductService.get_product_by_id(
        db,
        product_id,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    ProductService.delete_product(
        db,
        product,
    )

    return None