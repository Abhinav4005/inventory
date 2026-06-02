from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem

from app.services.customer_service import CustomerService
from app.services.product_service import ProductService
from uuid import UUID


class OrderService:

    @staticmethod
    def create_order(
        db: Session,
        payload,
    ):

        customer = (
            CustomerService.get_customer_by_id(
                db,
                payload.customer_id,
            )
        )

        if not customer:
            raise ValueError(
                "Customer not found"
            )

        total_amount = Decimal("0.00")

        order = Order(
            customer_id=payload.customer_id,
            total_amount=0,
        )

        db.add(order)
        db.flush()

        try:

            for item in payload.items:

                product = (
                    ProductService.get_product_by_id(
                        db,
                        item.product_id,
                    )
                )

                if not product:
                    raise ValueError(
                        "Product not found"
                    )

                if (
                    product.stock_quantity
                    < item.quantity
                ):
                    raise ValueError(
                        f"Insufficient stock for {product.name}"
                    )

                product.stock_quantity -= (
                    item.quantity
                )

                item_total = (
                    product.price
                    * item.quantity
                )

                total_amount += item_total

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price,
                )

                db.add(order_item)

            order.total_amount = total_amount

            db.commit()

            db.refresh(order)

            return order

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_all_orders(
        db: Session,
    ):
        return (
            db.query(Order)
            .all()
        )

    @staticmethod
    def get_order_by_id(
        db: Session,
        order_id: UUID,
    ):
        return (
            db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )

    @staticmethod
    def delete_order(
        db: Session,
        order: Order,
    ):
        db.delete(order)
        db.commit()