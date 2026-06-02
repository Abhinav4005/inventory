from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate
from typing import List
from uuid import UUID
from typing import Optional

class ProductService:

    @staticmethod
    def get_by_sku(
        db: Session,
        sku: str,
    ):
        return (
            db.query(Product)
            .filter(Product.sku == sku)
            .first()
        )

    @staticmethod
    def create_product(
        db: Session,
        payload: ProductCreate,
    ):
        product = Product(
            name=payload.name,
            sku=payload.sku,
            price=payload.price,
            stock_quantity=payload.stock_quantity,
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        return product


    @staticmethod
    def get_all_products(db: Session):
        return db.query(Product).all()

    @staticmethod
    def get_product_by_id(
        db: Session,
        product_id: UUID,
    ) -> Optional[Product]:
        return (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )


    @staticmethod
    def update_product(
        db: Session,
        product: Product,
        payload,
    ):
        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()
        db.refresh(product)

        return product


    @staticmethod
    def delete_product(
        db: Session,
        product: Product,
    ):
        db.delete(product)
        db.commit()