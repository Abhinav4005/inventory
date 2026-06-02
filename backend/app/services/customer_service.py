from uuid import UUID

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


class CustomerService:

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ):
        return (
            db.query(Customer)
            .filter(Customer.email == email)
            .first()
        )

    @staticmethod
    def create_customer(
        db: Session,
        payload: CustomerCreate,
    ):
        customer = Customer(
            full_name=payload.full_name,
            email=payload.email,
            phone_number=payload.phone_number,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def get_all_customers(
        db: Session,
    ):
        return db.query(Customer).all()

    @staticmethod
    def get_customer_by_id(
        db: Session,
        customer_id: UUID,
    ):
        return (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

    @staticmethod
    def delete_customer(
        db: Session,
        customer: Customer,
    ):
        db.delete(customer)
        db.commit()

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: UUID,
        payload,
    ):
        customer = (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

        if not customer:
            return None

        customer.full_name = payload.full_name
        customer.email = payload.email
        customer.phone_number = payload.phone_number

        db.commit()
        db.refresh(customer)

        return customer