from fastapi import FastAPI, HTTPException
from sqlalchemy import text

from app.core.database import engine
from app.core.config import settings
from app.api.products import router as product_router
from app.api.customers import router as customer_router
from app.api.orders import router as order_router
from app.api.dashboard import router as dashboard_router

from app.core.exceptions import (
    http_exception_handler,
    generic_exception_handler,
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)


@app.get("/")
def health_check():
    return {"status": "healthy"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/db-health")
def db_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"database": "connected"}